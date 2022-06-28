import React from "react";
import {
  BlockControls,
  RichText,
  useBlockProps,
} from "@wordpress/block-editor";

import { AlertTypeDropdown } from "./alert-type-dropdown";
import { HeadingLevelDropdown } from "./heading-level-dropdown";
import { DEFAULT_ALERT_TYPE } from "./alert-types";

export function AlertEdit({
  attributes: { titleHeadingLevel = 4, type = DEFAULT_ALERT_TYPE },
  setAttributes,
}) {
  // useBlockProps is required when using apiVersion: 2 in metadata.
  // See https://developer.wordpress.org/block-editor/reference-guides/block-api/block-api-versions/
  const blockProps = useBlockProps({
    className: `usa-alert usa-alert--${type}`,
  });

  return (
    <>
      <BlockControls group="block">
        <AlertTypeDropdown
          selectedType={type}
          onChange={(newType) => setAttributes({ type: newType })}
        />
        <HeadingLevelDropdown
          selectedLevel={titleHeadingLevel}
          onChange={(newLevel) =>
            setAttributes({ titleHeadingLevel: newLevel })
          }
        />
      </BlockControls>
      <div {...blockProps}>
        <div className="usa-alert__body">
          <RichText
            tagName={`h${titleHeadingLevel}`}
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
