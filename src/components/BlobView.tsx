import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BlobMetadata } from "../github";
import { GithubApiContext } from "./GithubApi";
import { decode as decodeBase64 } from "js-base64";

import { commitChanges } from "../git";
import {
  createEditorBasedOnPath,
  createFrontMatterEditor,
  EditorValue,
} from "./editors";
import { navigate } from "@reach/router";

export type BlobViewProps = {
  branch: string;
  fullPath: string;
  metadata: BlobMetadata;
  owner: string;
  repo: string;
};

export function BlobView({
  branch,
  fullPath,
  metadata: { path, sha },
  owner,
  repo,
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

  const editor = useMemo(() => {
    return createFrontMatterEditor(createEditorBasedOnPath(path));
  }, [path]);

  const handleConvertToHtml = useCallback(() => {
    setSubmitting(true);
    (async () => {
      const { convertToHtml } = editor;

      if (!convertToHtml || content == null) {
        return;
      }

      // rename the using ".html" as the extension and commit the updated contents
      const newPath = `${fullPath.replace(/\.[^.]+$/, "")}.html`;

      const htmlContent = convertToHtml(content);

      const commit = await commitChanges({
        branch,
        path: newPath,
        content: htmlContent,
        client,
      });

      console.log("Committed %s to %s", commit, branch);

      navigate(`/${owner}/${repo}/${branch}/${newPath}`);
    })().finally(() => setSubmitting(false));
  }, [editor, content]);

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

  const handleChange = useCallback((newValue: EditorValue) => {
    console.log(newValue);
    setContent(newValue.raw);
  }, []);

  const FrontMatterEditorComponent = editor.component;

  return (
    <div className="grid-container">
      <h1>{path}</h1>
      {content == null && "Loading..."}
      {content != null && (
        <form onSubmit={handleSubmit}>
          <FrontMatterEditorComponent
            value={{ raw: content }}
            onChange={handleChange}
          />
          <ul className="usa-button-group">
            <li className="usa-button-group__item">
              <button
                type="submit"
                className="usa-button"
                disabled={submitting}
              >
                Save
              </button>
            </li>
            {editor.convertToHtml && (
              <li className="usa-button-group__item">
                <button
                  type="button"
                  className="usa-button usa-button--outline"
                  disabled={submitting}
                  onClick={handleConvertToHtml}
                >
                  Convert to HTML
                </button>
              </li>
            )}
          </ul>
        </form>
      )}
    </div>
  );
}
