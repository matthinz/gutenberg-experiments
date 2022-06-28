import React, { useCallback } from "react";

type TextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TextEditor({ value, onChange }: TextEditorProps) {
  const handleChange = useCallback(
    (evt) => {
      onChange(evt.target.value);
    },
    [onChange]
  );
  return (
    <textarea
      className="width-full height-card"
      value={value}
      onChange={handleChange}
    />
  );
}
