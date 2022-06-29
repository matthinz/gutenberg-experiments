import React, { useCallback, useEffect } from "react";
import matter from "gray-matter";
import { Editor, EditorProps, EditorValue } from "./types";

type FrontMatterEditorProps = EditorProps & {
  editor: Editor;
};

type FrontMatter = { [key: string]: any };

const FRONT_MATTER_KEYS = ["title"];

/**
 * @param {Editor} editor
 * @returns {Editor}
 */
export function createFrontMatterEditor(editor: Editor): Editor {
  return {
    ...editor,
    component: function (props: EditorProps) {
      return <FrontMatterEditorComponent {...props} editor={editor} />;
    },
  };
}

export function FrontMatterEditorComponent({
  value,
  onChange,
  editor,
  ...rest
}: FrontMatterEditorProps) {
  const [frontMatter, setFrontMatter] = React.useState<FrontMatter>({});
  const [content, setContent] = React.useState<EditorValue | undefined>();

  useEffect(() => {
    if (content == null) {
      const { data, content: parsedContent } = matter(value.raw);
      setFrontMatter(data);
      setContent({
        raw: parsedContent,
      });
    }
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const raw = matter.stringify(
        {
          content: content?.raw ?? "",
        },
        frontMatter
      );
      onChange({ raw });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [frontMatter, content]);

  const handleFrontMatterChange = useCallback((newFrontMatter: FrontMatter) => {
    setFrontMatter(newFrontMatter);
  }, []);

  const handleContentChange = useCallback((newContent: EditorValue) => {
    setContent(newContent);
  }, []);

  const InternalEditor = editor.component;

  return (
    <>
      {frontMatter != null &&
        FRONT_MATTER_KEYS.map((key) => (
          <div className="display-flex padding-4" key={key}>
            <label className="flex-1">{key}:</label>
            <input
              className="flex-2"
              type="text"
              value={frontMatter[key] ?? ""}
              onChange={(e) => {
                handleFrontMatterChange({
                  ...frontMatter,
                  [key]: e.target.value,
                });
              }}
            />
          </div>
        ))}
      {content != null && (
        <InternalEditor
          value={content}
          onChange={handleContentChange}
          {...rest}
        />
      )}
    </>
  );
}
