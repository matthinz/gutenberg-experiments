import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { AccessTokenInput } from "../components/AccessTokenInput";

export function Home() {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("githubAccessToken") ?? undefined
  );

  const [accessTokenIsValid, setAccessTokenIsValid] = useState<boolean>(false);

  const handleValidTokenEntered = useCallback((accessToken, client) => {
    localStorage.setItem("githubAccessToken", accessToken);
    setAccessToken(accessToken);
    setAccessTokenIsValid(true);
  }, []);

  return (
    <div className="grid-container usa-prose">
      <h1>Gutenberg / GitHub proof-of-concept</h1>
      <p>
        This app is a proof-of-concept demonstrating the use of Wordpress's
        Gutenberg editor outside of Wordpress itself.
      </p>
      <p>
        This app needs to be able to read from and write to your GitHub
        repositories. To do that, it will use a{" "}
        <strong>personal access token</strong> you provide. This token allows
        the app to talk to GitHub as though it were you. It stored in your web
        browser's local storage, and sent to GitHub via API requests, but not
        transmitted anywhere else.
      </p>
      <p>To proceed:</p>
      <ol>
        <li>
          Create a personal access token in your{" "}
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener"
          >
            GitHub settings
          </a>
        </li>
        <li>
          <label className="padding-right-1">Enter it here:</label>

          <AccessTokenInput
            onValidTokenEntered={handleValidTokenEntered}
            value={accessToken ?? ""}
          />

          {accessTokenIsValid && (
            <div className="usa-alert usa-alert--success usa-alert--slim">
              <div className="usa-alert__body">
                Great! This looks like a valid token.
                <br />
                Pick from your <Link to="/repos">list of repositories</Link> to
                get started.
              </div>
            </div>
          )}
        </li>
      </ol>
    </div>
  );
}
