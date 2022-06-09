import React from "react";
import { registerBlockType } from "@wordpress/blocks";
import {
  BlockEditorProvider,
  BlockList,
  BlockTools,
  Inserter,
  WritingFlow,
  ObserveTyping,
} from "@wordpress/block-editor";
import { SlotFillProvider, Popover } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { ShortcutProvider } from "@wordpress/keyboard-shortcuts";

// @wordpress/format-library registers all the core rich text formatting actions (bold, italic, etc.)
import "@wordpress/format-library";

import { BLOCK_TYPES } from "./block-types";

BLOCK_TYPES.forEach(({ metadata, settings, name }) => {
  // Format for invoking registerBlockType cribbed from
  // https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/index.js#L127
  registerBlockType({ name, ...metadata }, settings);
});

// Make sure to load the block editor stylesheets too
import "@wordpress/components/build-style/style.css";
import "@wordpress/block-editor/build-style/style.css";
import "@wordpress/block-library/build-style/style.css";
import "@wordpress/block-library/build-style/editor.css";
import "@wordpress/block-library/build-style/theme.css";

export function Editor({ blocks, onChange }) {
  return (
    <BlockEditorProvider
      value={blocks}
      onInput={(blocks) => onChange(blocks)}
      onChange={(blocks) => onChange(blocks)}
    >
      <ShortcutProvider>
        <SlotFillProvider>
          <BlockTools>
            <WritingFlow>
              <ObserveTyping>
                <BlockList />
              </ObserveTyping>
            </WritingFlow>
          </BlockTools>
          <Popover.Slot />
        </SlotFillProvider>
      </ShortcutProvider>
    </BlockEditorProvider>
  );
}
