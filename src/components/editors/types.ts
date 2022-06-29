import { ComponentType } from "react";

/**
 * Container for a value stored by an editor. We store a raw string value as
 * well as an optional parsed / structured value.
 */
export type EditorValue = {
  raw: string;
  structured?: any;
};

export type EditorProps = {
  value: EditorValue;
  onChange: (value: EditorValue) => void;
};

export type Editor = {
  component: ComponentType<EditorProps>;
  convertToHtml?: (value: string) => string;
};
