import React from "react";
import {
  RichText,
  useBlockProps,
  useInnerBlocksProps,
} from "@wordpress/block-editor";

const TEMPLATE = [["core/list"]];

export function SummaryBoxEditor({ setAttributes }) {
  const blockProps = useBlockProps({
    className: "usa-summary-box",
    role: "region",
    "aria-labelledby": "summary-box-key-information",
  });
  const innerBlocksProps = useInnerBlocksProps(
    {
      ...blockProps,
      className: "usa-summary-box__text",
    },
    {
      template: TEMPLATE,
    }
  );
  return (
    <div {...blockProps}>
      <div className="usa-summary-box__body">
        <RichText
          className="usa-summary-box__heading"
          tagName="h3"
          identifier="heading"
          placeholder="Summary box title"
          onChange={(newHeading) => setAttributes({ heading: newHeading })}
        />
        <div {...innerBlocksProps}></div>
      </div>
    </div>
  );
}
