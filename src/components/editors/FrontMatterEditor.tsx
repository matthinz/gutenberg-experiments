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

export function FrontMatterEditor({
  value,
  onChange,
  editor: Editor,
}: FrontMatterEditorProps) {
  const [frontMatter, setFrontMatter] = React.useState<
    { [key: string]: any } | undefined
  >();
  const [content, setContent] = React.useState<string | undefined>();

  useEffect(() => {
    if (content == null) {
      const { data, content: parsedContent } = matter(value);
      setFrontMatter(data);
      setContent(parsedContent);
    }
  }, [value]);

  const handleChange = useCallback(
    (value: string) => {
      onChange(matter.stringify(value, frontMatter as Object));
    },
    [onChange, frontMatter]
  );

  return <Editor value={value} onChange={handleChange} />;
}
