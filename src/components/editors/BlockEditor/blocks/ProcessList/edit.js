import React from "react";
import {
  InnerBlocks,
  useBlockProps,
  useInnerBlocksProps,
} from "@wordpress/block-editor";

const TEMPLATE = [["uswds/process-list-item"]];

export function ProcessListEditor() {
  const blockProps = useBlockProps({
    className: "usa-process-list",
  });
  const innerBlocksProps = useInnerBlocksProps(blockProps, {
    allowedBlocks: ["uswds/process-list-item"],
    renderAppender: false,
    template: TEMPLATE,
  });

  return (
    <div {...blockProps}>
      <ol className="usa-process-list" {...innerBlocksProps}></ol>
      <InnerBlocks.ButtonBlockAppender />
    </div>
  );
}
