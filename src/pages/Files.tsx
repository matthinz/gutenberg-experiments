import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ClientContext } from "../contexts";
import { Directory, File } from "../types";
import { DirectoryView } from "../components/DirectoryView";

type FilesProps = {
  path: string;
  owner: string;
  repo: string;
};

/**
 * Page listing files at a specific path.
 */
export function Files({ owner, path, repo }: FilesProps) {
  const [item, setItem] = useState<File | Directory | undefined>();
  const client = useContext(ClientContext);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (cancel) return;
      const repoClient = client.createClientForRepository(`${owner}/${repo}`);
      const item = await repoClient.getItem(path);
      if (cancel) return;
      setItem(item);
    })();

    return () => {
      cancel = true;
    };
  }, [owner, path, repo]);

  return (
    <div className="grid-container">
      <h1>{repo}</h1>
      {item?.type === "directory" && <DirectoryView directory={item} />}
    </div>
  );
}

export const FilesRoute = (props: Omit<FilesProps, "path" | "repo">) => {
  const params = useParams();
  return (
    <Files
      {...props}
      owner={params["owner"] ?? ""}
      repo={params["repo"] ?? ""}
      path={params["*"] ?? ""}
    />
  );
};
