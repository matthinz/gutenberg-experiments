import React, { useContext, useEffect, useState } from "react";
import { Link, useMatch } from "@reach/router";

import { ClientContext } from "../contexts";

type ReposRouteProps = {
  owner: string;
};

export function ReposRoute({ owner }: ReposRouteProps) {
  const [repos, setRepos] = useState<string[] | undefined>();
  const client = useContext(ClientContext);

  const match = useMatch(`/${owner}`);

  useEffect(() => {
    let cancel = false;

    (async () => {
      const newRepos = await client.getRepos();

      if (cancel) {
        return;
      }

      setRepos(newRepos);
    })();

    return () => {
      cancel = true;
    };
  }, [owner, client]);

  return (
    <div className="grid-container">
      <h1>Select a repo</h1>
      <p>Pick one of your repos to work with.</p>
      {repos && (
        <ul>
          {repos.map((repo) => (
            <li key={repo}>
              <Link to={repo}>{repo}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
