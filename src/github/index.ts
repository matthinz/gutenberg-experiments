import { Octokit } from "@octokit/rest";

import {
  Blob,
  Client,
  Commit,
  CreateCommitOptions,
  CreateTreeOptions,
  GetBlobOptions,
  GetShaForBranchOptions,
  GetTreeOptions,
  RepoClient,
  Tree,
  TreeItem,
  UpdateBranchOptions,
} from "./types";

export * from "./types";

export function createClient(accessToken: string): Client {
  const o = new Octokit({
    auth: accessToken,
  });

  function createClientForRepo(repo: string): RepoClient {
    return createRepoClient(o, repo);
  }

  function getRepos(): Promise<string[]> {
    return o.repos
      .listForAuthenticatedUser({
        type: "owner",
      })
      .then((resp) => {
        return resp.data.map((repo) => repo.name);
      });
  }

  function getUserName(): Promise<string> {
    return o.users.getAuthenticated().then((resp) => resp.data.login);
  }

  return { createClientForRepo, getRepos, getUserName };
}

function createRepoClient(o: Octokit, repo: string): RepoClient {
  async function createCommit({
    message,
    parent,
    tree,
  }: CreateCommitOptions): Promise<string> {
    const commit = await o.git.createCommit({
      parents: [parent],
      owner,
      message,
      repo,
      tree,
    });
    return commit.data.sha;
  }

  async function createTree({
    parent,
    items,
  }: CreateTreeOptions): Promise<string> {
    const tree = await o.git.createTree({
      owner,
      repo,
      base_tree: parent,
      tree: items.map(({ path, content }) => ({
        mode: "100644",
        type: "blob",
        path,
        content,
      })),
    });
    return tree.data.sha;
  }

  async function getBlob({ sha }: GetBlobOptions): Promise<Blob> {
    const resp = await o.git.getBlob({
      owner,
      repo,
      file_sha: sha,
    });

    const { content, encoding } = resp.data;

    if (encoding !== "utf8" && encoding !== "base64") {
      throw new Error(`Invalid encoding: ${encoding}`);
    }

    return { content, encoding, sha };
  }

  async function getCommitForBranch(branch: string): Promise<Commit> {
    const ref = `heads/${branch}`;

    const resp = await o.git.getRef({
      owner,
      repo,
      ref,
    });

    const { type, sha } = resp.data.object;

    if (type !== "commit") {
      throw new Error(`ref '${ref}' is not a commit`);
    }

    const commit = await o.git.getCommit({
      owner,
      repo,
      commit_sha: sha,
    });

    return {
      sha: commit.data.sha,
      tree: commit.data.tree.sha,
      message: commit.data.message,
    };
  }

  async function getTree({ sha }: GetTreeOptions): Promise<Tree> {
    const resp = await o.git.getTree({
      owner,
      repo,
      tree_sha: sha,
    });

    const { tree, truncated } = resp.data;

    if (truncated) {
      throw new Error("Not supported: truncated trees");
    }

    return {
      sha,
      items: tree as TreeItem[],
    };
  }

  async function getShaForBranch({
    branch,
  }: GetShaForBranchOptions): Promise<string> {
    const shasSeen: { [key: string]: number } = {};

    // XXX: Make github tell us twice before we believe it.
    //      (eventual consistency after updating heads)

    while (true) {
      const ref = await o.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });

      const { sha } = ref.data.object;
      shasSeen[sha] = (shasSeen[sha] ?? 0) + 1;

      if (shasSeen[sha] > 1) {
        return sha;
      }

      await sleep(1000);
    }
  }

  async function updateBranch({
    branch,
    sha,
  }: UpdateBranchOptions): Promise<void> {
    o.git.updateRef({
      owner,
      ref: `heads/${branch}`,
      repo,
      sha,
    });
  }

  return {
    createCommit,
    createTree,
    getBlob,
    getCommitForBranch,
    getShaForBranch,
    getTree,
    updateBranch,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
