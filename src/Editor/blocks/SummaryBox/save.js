import React from "react";
import {
  RichText,
  useBlockProps,
  useInnerBlocksProps,
} from "@wordpress/block-editor";

export function SummaryBox({ attributes: { heading } }) {
  try {
    const className = "usa-summary-box";
    const blockProps = useBlockProps.save({
      className,
    });

    const innerBlocksProps = useInnerBlocksProps.save(
      { ...blockProps, className: "usa-summary-box__text" },
      {}
    );

    return (
      <div {...blockProps}>
        <div className="usa-summary-box__body">
          <h3 className="usa-summary-box__heading">
            <RichText.Content value={heading} />
          </h3>
          <div {...innerBlocksProps}></div>
        </div>
      </div>
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
}
