import React, { useEffect, useState } from "react";

import { ClientContext } from "../contexts";
import { GitHubClient } from "../github";
import { Home } from "../components/Home";
import { Client } from "../types";

type AuthenticationProps = React.PropsWithChildren<{
  uri: string;
}>;

/**
 * The authentication route checks that the user is authenticated and provides
 * a client for interacting with the datastore to all its descendants.
 */
export function AuthenticationRoute({ children, uri }: AuthenticationProps) {
  const [client, setClient] = useState<Client | undefined>();
  const [accessToken, setAccessToken] = useState<string | undefined>(
    localStorage.getItem("accessToken") ?? undefined
  );

  useEffect(() => {
    if (accessToken) {
      setClient(new GitHubClient(accessToken));
    } else {
      setClient(undefined);
    }
  }, [uri, accessToken]);

  if (client && uri !== "/") {
    return (
      <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
    );
  }

  return (
    <Home accessToken={accessToken} onAccessTokenChanged={setAccessToken} />
  );
}
