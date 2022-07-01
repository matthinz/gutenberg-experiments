import React, { useEffect, useState } from "react";

import { ClientContext } from "../contexts";

import { Client, createClient } from "../github";

import { Home } from "../components/Home";

type AuthenticationProps = React.PropsWithChildren<{}>;

export function AuthenticationRoute({ children }: AuthenticationProps) {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    window.localStorage.getItem("githubAccessToken") ?? undefined
  );

  let client: Client | undefined;

  if (accessToken) {
    client = createClient(accessToken);
  }

  if (client) {
    return (
      <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
    );
  }

  return (
    <Home accessToken={accessToken} onAccessTokenChanged={setAccessToken} />
  );
}
