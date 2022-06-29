import { Editor } from "./types";
import { BlockEditor } from "./BlockEditor";
import { MarkdownEditor } from "./MarkdownEditor";
import { TextEditor } from "./TextEditor";

export * from "./types";
export { BlockEditor } from "./BlockEditor";
export { createFrontMatterEditor } from "./FrontMatterEditor";
export { MarkdownEditor } from "./MarkdownEditor";
export { TextEditor } from "./TextEditor";

export function createEditorBasedOnPath(path: string): Editor {
  if (/\.html$/.test(path)) {
    return BlockEditor;
  } else if (/\.md$/.test(path)) {
    return MarkdownEditor;
  } else {
    return TextEditor;
  }
}
