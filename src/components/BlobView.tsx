import React, { useCallback, useContext, useEffect, useState } from "react";
import { BlobMetadata, Client } from "../github";
import { GithubApiContext } from "./GithubApi";
import { BlockEditor } from "./editors/BlockEditor";
import { TextEditor } from "./editors/TextEditor";
import { FrontMatterEditor } from "./editors/FrontMatterEditor";

export type BlobViewProps = {
  branch: string;
  metadata: BlobMetadata;
};

type CommitChangesOptions = {
  branch: string;
  path: string;
  content: string;
  client: Client;
};

async function commitChanges({
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
    message: "Test commit",
  });

  // 5. Update the branch ref to point at the commit
  await client.updateBranch({
    branch,
    sha: commit,
  });
}

export function BlobView({ branch, metadata: { path, sha } }: BlobViewProps) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [content, setContent] = useState<string | undefined>();
  const client = useContext(GithubApiContext);

  useEffect(() => {
    let cancel = false;

    (async () => {
      if (content == null) {
        const blob = await client.getBlob({
          sha,
        });

        if (cancel) {
          return;
        }

        setContent(
          blob.encoding === "base64" ? atob(blob.content) : blob.content
        );
      }
    })();

    return () => {
      cancel = true;
    };
  });

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();
      setSubmitting(true);
      (async () => {
        if (content == null) {
          throw new Error("content is null");
        }
        await commitChanges({
          branch,
          path,
          content,
          client,
        });
      })().finally(() => setSubmitting(false));
    },
    [branch, path, content, client]
  );

  const handleChange = useCallback((evt) => {
    setContent(evt.target.value);
  }, []);

  let editor: React.ComponentType<{
    value: string;
    onChange: (value: string) => void;
  }>;

  if (/\.html$/.test(path)) {
    editor = BlockEditor;
  } else {
    editor = TextEditor;
  }

  return (
    <div className="grid-container">
      <h1>{path}</h1>
      {content == null && "Loading..."}
      {content != null && (
        <form onSubmit={handleSubmit}>
          <FrontMatterEditor
            value={content}
            onChange={handleChange}
            editor={editor}
          />
          <button type="submit" className="usa-button" disabled={submitting}>
            Save
          </button>
        </form>
      )}
    </div>
  );
}
