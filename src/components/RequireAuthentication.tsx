import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import { ClientContext } from "../contexts";
import { GitHubClient } from "../github";
import { Client } from "../types";

type RequireAuthenticationProps = React.PropsWithChildren<{}>;

export function RequireAuthentication({
  children,
}: RequireAuthenticationProps) {
  const accessToken = localStorage.getItem("githubAccessToken") ?? undefined;
  const [client, setClient] = useState<Client | undefined>();

  if (accessToken == null) {
    return <Navigate to="/" />;
  }

  if (client == null) {
    setClient(new GitHubClient(accessToken));
    return null;
  }

  return (
    <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
  );
}
