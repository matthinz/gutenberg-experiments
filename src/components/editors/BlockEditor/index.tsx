import React, { useCallback, useEffect, useState } from "react";
import {
  createBlock,
  setDefaultBlockName,
  registerBlockType,
  parse,
  serialize,
} from "@wordpress/blocks";
import {
  BlockEditorProvider,
  BlockList,
  BlockTools,
  WritingFlow,
  ObserveTyping,
  __experimentalLibrary as Library,
} from "@wordpress/block-editor";
import { SlotFillProvider, Popover } from "@wordpress/components";
import { ShortcutProvider } from "@wordpress/keyboard-shortcuts";

// @wordpress/format-library registers all the core rich text formatting actions (bold, italic, etc.)
import "@wordpress/format-library";

import { BLOCK_TYPES } from "./block-types";

BLOCK_TYPES.forEach(({ metadata, settings, name }) => {
  // Format for invoking registerBlockType cribbed from
  // https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/index.js#L127
  registerBlockType({ ...metadata, name }, settings);
});

setDefaultBlockName("core/paragraph");

// Make sure to load the block editor stylesheets too
import "@wordpress/components/build-style/style.css";
import "@wordpress/block-editor/build-style/style.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/editor.css";
import "@wordpress/block-library/build-style/theme.css";

import "./block-editor.scss";

type BlockEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<any[] | undefined>(undefined);

  const handleChange = useCallback((newBlocks) => {}, []);

  useEffect(() => {
    let parsedBlocks = parse(value);

    // If we don't have any blocks, put the HTML content into a single custom HTML block
    if (parsedBlocks.length === 0 && value !== "") {
      parsedBlocks = [createBlock("core/html", { content: value })];
    }

    setBlocks(parsedBlocks);
  }, [value]);

  if (!blocks) {
    return null;
  }

  return (
    <BlockEditorProvider
      value={blocks}
      onInput={handleChange}
      onChange={handleChange}
    >
      <ShortcutProvider>
        <SlotFillProvider>
          <div className="grid-row grid-gap">
            <div className="grid-col-4 bg-base-lighter">
              <Library />
            </div>
            <div className="grid-col-8 padding-y-4">
              <BlockTools>
                <WritingFlow>
                  <ObserveTyping>
                    <BlockList />
                  </ObserveTyping>
                </WritingFlow>
              </BlockTools>
            </div>
          </div>
          <Popover.Slot />
        </SlotFillProvider>
      </ShortcutProvider>
    </BlockEditorProvider>
  );
}