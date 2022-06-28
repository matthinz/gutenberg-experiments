import React, { useCallback, useContext, useEffect, useState } from "react";
import { BlobMetadata, Client } from "../github";
import { GithubApiContext } from "./GithubApi";
import { BlockEditor } from "./editors/BlockEditor";
import { TextEditor } from "./editors/TextEditor";
import { FrontMatterEditor } from "./editors/FrontMatterEditor";
import { decode as decodeBase64 } from "js-base64";
import { commitChanges } from "../git";

export type BlobViewProps = {
  branch: string;
  fullPath: string;
  metadata: BlobMetadata;
};

export function BlobView({
  branch,
  fullPath,
  metadata: { path, sha },
}: BlobViewProps) {
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
          blob.encoding === "base64" ? decodeBase64(blob.content) : blob.content
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
          path: fullPath,
          content,
          client,
        });
      })().finally(() => setSubmitting(false));
    },
    [branch, path, content, client]
  );

  const handleChange = useCallback((newValue) => {
    console.log(newValue);
    setContent(newValue);
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
          <div className="padding-2 margin-y-1 display-flex flex-row flex-align-end">
            <button type="submit" className="usa-button" disabled={submitting}>
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
