import React, { useEffect, useState } from "react";
import { RepoClient } from "../github";

type BranchesRouteProps = {
  client: RepoClient;
};

export function BranchesRoute({ client }: BranchesRouteProps) {
  const [branches, setBranches] = useState<string[] | undefined>();

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (cancel) {
        return;
      }

      const newBranches = await client.getBranches();
      if (cancel) {
        return;
      }
      setBranches(newBranches);
    })();

    return () => {
      cancel = true;
    };
  }, [client]);

  return (
    <div className="grid-container">
      <h1>Select a branch</h1>
      <p>Pick one of your branches to work with.</p>
      {branches && (
        <ul>
          {branches.map((branch) => (
            <li key={branch}>{branch}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
