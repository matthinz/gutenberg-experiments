import React, { useCallback, useEffect, useState } from "react";

import { Icon } from "./Icon";
import { Client, createClient } from "../github";

type AccessTokenInputProps = {
  onValidTokenEntered: (
    accessToken: string,
    userName: string,
    client: Client
  ) => void;
  value: string;
};

type InputState = "unknown" | "checking" | "invalid" | "valid";

const DEFAULT_CHECK_DELAY = 1000;
const IMMEDIATE_CHECK_DELAY = 0;

export function AccessTokenInput(props: AccessTokenInputProps) {
  const [value, setValue] = useState(props.value);
  const [state, setState] = useState<InputState>("unknown");
  const [checkDelay, setCheckDelay] = useState(DEFAULT_CHECK_DELAY);

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setState("unknown");
      setCheckDelay(DEFAULT_CHECK_DELAY);
      setValue(evt.target.value);
    },
    []
  );

  const handlePaste = useCallback(() => {
    // On paste, we validate the token immediately.
    setCheckDelay(IMMEDIATE_CHECK_DELAY);
  }, []);

  useEffect(() => {
    let cancel = false;

    if (value.trim() === "") {
      return;
    }

    const timeout = setTimeout(() => {
      setState("checking");

      const client = createClient(value);

      (async () => {
        if (cancel) {
          return;
        }
        try {
          const [_, userName] = await Promise.all([
            client.getRepos(),
            client.getUserName(),
          ]);

          if (cancel) {
            return;
          }

          setState("valid");
          props.onValidTokenEntered(value, userName, client);
        } catch (err: unknown) {
          console.error(err);
          setState("invalid");
          return;
        }
      })();
    }, checkDelay);

    return () => {
      clearTimeout(timeout);
      cancel = true;
    };
  }, [value, checkDelay]);

  const className = [
    "usa-input",
    state === "invalid" && "usa-input--error",
    state === "valid" && "usa-input--success",
  ]
    .filter((x) => x)
    .join(" ");

  return (
    <>
      <input
        className={className}
        type="text"
        placeholder="GitHub access token"
        aria-label="GitHub access token"
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        disabled={state === "valid" || state === "checking"}
      />
      {state === "invalid" && (
        <div className="usa-alert usa-alert--error usa-alert--slim">
          <div className="usa-alert__body">
            Whoops, it doesn't look like this is a valid token.
          </div>
        </div>
      )}
    </>
  );
}
