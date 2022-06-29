import React, { useContext, useEffect, useMemo, useState } from "react";
import { RouteComponentProps, useLocation } from "@reach/router";

import { GithubApiContext } from "../components/GithubApi";
import { Page } from "../components/Page";
import { TreeView } from "../components/TreeView";
import {
  Blob,
  BlobMetadata,
  Client,
  createClient,
  Tree,
  TreeItem,
} from "../github";
import { BlobView } from "../components/BlobView";

interface FilesRouteProps extends RouteComponentProps {
  owner: string;
  branch: string;
  repo: string;
  "*"?: string;
}

export function FilesRoute({ branch, owner, repo, ...rest }: FilesRouteProps) {
  const accessToken = window.localStorage.getItem("githubAccessToken");

  if (accessToken == null) {
    return <div>No access token found</div>;
  }

  const path: string[] = (rest["*"] ?? "").split("/").filter((x) => x !== "");

  const client = useMemo(
    () =>
      createClient({
        accessToken,
        owner,
        repo,
      }),
    [accessToken, owner, repo]
  );

  const [item, setItem] = useState<
    | { tree: Tree; blob?: undefined }
    | { blob: BlobMetadata; tree?: undefined }
    | undefined
  >(undefined);

  const location = useLocation();

  useEffect(() => {
    let canceled = false;

    (async () => {
      const nextItem = await getBlobOrTree(client, branch, path);

      // Ensure tree paths end with '/' to keep relative links working
      if (nextItem.tree && !location.pathname.endsWith("/")) {
        history.replaceState(null, "", `${location.pathname}/`);
      }

      if (!canceled) {
        setItem(nextItem);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [client, location.pathname]);

  return (
    <GithubApiContext.Provider value={client}>
      <Page branch={branch} owner={owner} repo={repo} path={path.join("/")}>
        {item?.tree && <TreeView tree={item.tree} />}
        {item?.blob && (
          <BlobView
            fullPath={path.join("/")}
            branch={branch}
            metadata={item.blob}
            owner={owner}
            repo={repo}
          />
        )}
      </Page>
    </GithubApiContext.Provider>
  );
}

async function getBlobOrTree(
  client: Client,
  branch: string,
  path: string[]
): Promise<
  { tree: Tree; blob?: undefined } | { blob: BlobMetadata; tree?: undefined }
> {
  let branchSha = await client.getShaForBranch({
    branch,
  });

  console.log("sha for %s is %s", branch, branchSha);

  let tree = await client.getTree({
    sha: branchSha,
  });

  console.log("tree for %s is %o", branch, tree);

  for (let i = 0; i < path.length; i++) {
    const item = tree.items.find((item) => {
      return item.path == path[i];
    });
    if (!item) {
      const fullPath = path.slice(0, i + 1).join("/");
      console.log(tree);
      console.log(path[i]);
      throw new Error(`item not found in tree: ${fullPath}`);
    }
    if (item.type === "tree") {
      tree = await client.getTree({ sha: item.sha });
      console.log("tree for %s is %o", path[i], tree);
    } else {
      if (i < path.length - 1) {
        throw new Error(`item is not a tree: ${item.path}`);
      }
      return { blob: item };
    }
  }

  return { tree };
}
