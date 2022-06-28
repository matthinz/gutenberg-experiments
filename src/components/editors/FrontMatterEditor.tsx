import React from "react";
import matter from "gray-matter";
import { useEffect } from "react";
import { useCallback } from "react";

type EditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type FrontMatterEditorProps = EditorProps & {
  editor: React.ComponentType<EditorProps>;
};

type FrontMatter = { [key: string]: any };

export function FrontMatterEditor({
  value,
  onChange,
  editor: Editor,
}: FrontMatterEditorProps) {
  const [frontMatter, setFrontMatter] = React.useState<FrontMatter>({});
  const [content, setContent] = React.useState<string | undefined>();

  useEffect(() => {
    if (content == null) {
      const { data, content: parsedContent } = matter(value);
      setFrontMatter(data);
      setContent(parsedContent);
    }
  }, [value]);

  const handleChange = useCallback(
    (
      newContent: string | undefined,
      newFrontMatter: FrontMatter | undefined
    ) => {
      newContent != null && setContent(newContent);
      newFrontMatter != null && setFrontMatter(newFrontMatter);
      onChange(
        matter.stringify(
          newContent ?? value,
          (newFrontMatter ?? frontMatter) as Object
        )
      );
    },
    [onChange, frontMatter]
  );

  const KEYS = ["title"];
  return (
    <>
      {frontMatter != null &&
        KEYS.map((key) => (
          <div className="display-flex padding-4" key={key}>
            <label className="flex-1">{key}:</label>
            <input
              className="flex-2"
              type="text"
              value={frontMatter[key] ?? ""}
              onChange={(e) => {
                handleChange(undefined, {
                  ...frontMatter,
                  [key]: e.target.value,
                });
              }}
            />
          </div>
        ))}
      {content != null && <Editor value={content} onChange={handleChange} />}
    </>
  );
}
