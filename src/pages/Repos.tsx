import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ClientContext } from "../contexts";
import { Repository } from "../types";

type ReposProps = {};

export function Repos({}: ReposProps) {
  const [repos, setRepos] = useState<Repository[] | undefined>();
  const client = useContext(ClientContext);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (cancel) return;
      const nextRepos = await client.getRepositories();
      if (cancel) return;
      setRepos(nextRepos);
    })();

    return () => {
      cancel = true;
    };
  }, [client]);

  return (
    <div className="grid-container">
      <h1>Select a repo!</h1>
      <p>Pick one of your repos to work with.</p>
      {repos && (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link to={repo.id}>{repo.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
