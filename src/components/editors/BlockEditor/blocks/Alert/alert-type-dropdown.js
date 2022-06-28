import React from "react";
import { ALERT_TYPES } from "./alert-types";

/**
 * WordPress dependencies
 */
import { ToolbarDropdownMenu } from "@wordpress/components";

function AlertIcon({ type }) {
  const { className, icon, label } = ALERT_TYPES[type];
  return <img className={className} src={icon} alt={label} />;
}

export function AlertTypeDropdown({ selectedType, onChange }) {
  return (
    <ToolbarDropdownMenu
      icon={<AlertIcon type={selectedType} />}
      label={"Change alert type"}
      controls={Object.keys(ALERT_TYPES).map((type) => {
        {
          const { label } = ALERT_TYPES[type];
          const isActive = type === selectedType;
          return {
            icon: <AlertIcon type={type} isPressed={isActive} />,
            label,
            isActive,
            onClick() {
              onChange(type);
            },
          };
        }
      })}
    />
  );
}
