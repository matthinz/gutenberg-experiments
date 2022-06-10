import React from "react";
import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";

export function ProcessList() {
  const className = "usa-process-list";
  const blockProps = useBlockProps.save({ className });
  const innerBlocksProps = useInnerBlocksProps.save(blockProps);
  return <ol {...innerBlocksProps} />;
}
