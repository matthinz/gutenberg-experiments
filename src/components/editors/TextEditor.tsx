import React, { useCallback } from "react";
import { Editor, EditorProps } from "./types";

type TextEditorProps = EditorProps & {
  className?: string;
};

export function TextEditorComponent({
  className,
  value,
  onChange,
}: TextEditorProps) {
  const handleChange = useCallback(
    (evt) => {
      onChange(evt.target.value);
    },
    [onChange]
  );

  const classes = ["width-full", "height-card", className]
    .filter((x) => x)
    .join(" ");

  return (
    <textarea className={classes} value={value.raw} onChange={handleChange} />
  );
}

export const TextEditor: Editor = {
  component: TextEditorComponent,
};
