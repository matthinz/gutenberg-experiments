import React, { PropsWithChildren, useState, useEffect } from "react";

import { createClient, Client } from "../github";
import { withCaching } from "../github/cache";

export const GithubApiContext = React.createContext<Client>(
  undefined as any as Client
);

type GithubApiProps = PropsWithChildren<{
  owner: string;
  repo: string;
}>;

export function GithubApi({ children, owner, repo }: GithubApiProps) {
  const accessToken = window.localStorage.getItem("githubAccessToken");
  const [client, setClient] = useState<Client | undefined>();

  useEffect(() => {
    if (accessToken) {
      setClient(
        withCaching(
          createClient({
            accessToken,
            owner,
            repo,
          })
        )
      );
    }
  }, [accessToken]);

  if (client) {
    return (
      <GithubApiContext.Provider value={client}>
        {children}
      </GithubApiContext.Provider>
    );
  }

  return (
    <div>
      Set <code>githubAccessToken</code> in localStorage to continue.
    </div>
  );
}
