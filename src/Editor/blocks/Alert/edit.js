import React from "react";
import { BlockControls, RichText } from "@wordpress/block-editor";

import { AlertTypeDropdown } from "./alert-type-dropdown";
import { DEFAULT_ALERT_TYPE } from "./alert-types";

export function AlertEdit({
  attributes: { type = DEFAULT_ALERT_TYPE },
  setAttributes,
}) {
  return (
    <>
      <BlockControls group="block">
        <AlertTypeDropdown
          selectedType={type}
          onChange={(newType) => setAttributes({ type: newType })}
        />
      </BlockControls>
      <div className={`usa-alert usa-alert--${type}`}>
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
