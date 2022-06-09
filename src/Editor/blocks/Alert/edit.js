import React from "react";
import {
  AlignmentControl,
  BlockControls,
  RichText,
  useBlockProps,
} from "@wordpress/block-editor";

export function AlertEdit({ setAttributes }) {
  return (
    <>
      <BlockControls group="block"></BlockControls>
      <div className="usa-alert usa-alert--info">
        <div className="usa-alert__body">
          <RichText
            tagName="h4"
            className="usa-alert__heading"
            placeholder="Title"
            identifier="title"
            onChange={(newContent) => setAttributes({ title: newContent })}
          />
          <RichText
            tagName="p"
            className="usa-alert__text"
            placeholder="Text"
            identifier="text"
            onChange={(newContent) => setAttributes({ text: newContent })}
          />
        </div>
      </div>
    </>
  );
}
