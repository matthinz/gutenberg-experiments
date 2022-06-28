import { Client } from "./github";

type CommitChangesOptions = {
  branch: string;
  path: string;
  content: string;
  client: Client;
};

/**
 * Commits a change to a single file.
 * @param {CommitChangesOptions} options
 */
export async function commitChanges({
  branch,
  path,
  content,
  client,
}: CommitChangesOptions): Promise<void> {
  // 1. Get the commit that the branch currently points to
  const parentCommit = await client.getCommitForBranch(branch);

  // 2. Create a new tree based on that
  const treeSha = await client.createTree({
    parent: parentCommit.tree,
    items: [
      {
        path,
        content,
      },
    ],
  });

  // 4. Create a commit pointing to the new tree
  const commit = await client.createCommit({
    parent: parentCommit.sha,
    tree: treeSha,
    message: `Update ${path}`,
  });

  // 5. Update the branch ref to point at the commit
  await client.updateBranch({
    branch,
    sha: commit,
  });
}
