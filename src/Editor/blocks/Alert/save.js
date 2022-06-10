import React from "react";
import { RichText } from "@wordpress/block-editor";

// import { DEFAULT_ALERT_TYPE } from "./alert-types";

export function saveAlert({ attributes: { title, text, type = "info" } }) {
  return (
    <div className={`usa-alert usa-alert--${type}`}>
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
