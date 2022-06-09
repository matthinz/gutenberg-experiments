import { RichText } from "@wordpress/block-editor";
import React from "react";

export function saveAlert({ attributes: { title, text } }) {
  return (
    <div className="usa-alert usa-alert--info">
      <div className="usa-alert__body">
        <h4 className="usa-alert__heading">
          <RichText.Content value={title} />
        </h4>
        <div className="usa-alert__text">
          <RichText.Content value={text} />
        </div>
      </div>
    </div>
  );
}
