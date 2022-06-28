import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import React from "react";

export function ProcessListItem({ attributes: { heading } }) {
  const className = "usa-process-list__item";
  const blockProps = useBlockProps.save({ className });
  return (
    <li {...blockProps}>
      <h4 className="usa-process-list__heading">{heading}</h4>
      <InnerBlocks.Content />
    </li>
  );
}
