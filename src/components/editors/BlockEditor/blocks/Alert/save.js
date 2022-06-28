import React from "react";
import { RichText } from "@wordpress/block-editor";

import { DEFAULT_ALERT_TYPE } from "./alert-types";

export function saveAlert({
  attributes: { title, text, type = DEFAULT_ALERT_TYPE, titleHeadingLevel = 4 },
}) {
  const Title = `h${titleHeadingLevel}`;

  return (
    <div className={`usa-alert usa-alert--${type}`}>
      <div className="usa-alert__body">
        <Title className="usa-alert__heading">
          <RichText.Content value={title} />
        </Title>
        <div className="usa-alert__text">
          <RichText.Content value={text} />
        </div>
      </div>
    </div>
  );
}
