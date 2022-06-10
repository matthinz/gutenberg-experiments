import React from "react";
import { RichText, InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const TEMPLATE = [["core/paragraph"]];

export function ProcessListItemEditor({ setAttributes }) {
  const blockProps = useBlockProps({
    className: "usa-process-list__item",
  });

  return (
    <li {...blockProps}>
      <RichText
        tagName="h4"
        className="usa-process-list__heading"
        placeholder="Heading"
        identifier="heading"
        onChange={(newHeading) => setAttributes({ heading: newHeading })}
      />
      <InnerBlocks renderAppender={false} template={TEMPLATE} />
    </li>
  );
}
