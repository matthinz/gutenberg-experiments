import React from "react";
import { Parser, HtmlRenderer } from "commonmark";
import { Editor, EditorProps, EditorValue } from ".";
import { TextEditorComponent } from "./TextEditor";

function MarkdownEditorComponent(props: EditorProps) {
  return <TextEditorComponent className="markdown-editor" {...props} />;
}

export const MarkdownEditor: Editor = {
  component: MarkdownEditorComponent,
  convertToHtml(value: string): string {
    const reader = new Parser();
    const writer = new HtmlRenderer();
    return writer.render(reader.parse(value));
  },
};
