import React from "react";
import { ToolbarDropdownMenu } from "@wordpress/components";

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

/**
 * @typedef {typeof HEADING_LEVELS} HeadingLevel
 */

/**
 *
 * @param {Object} props
 * @param {HeadingLevel} props.level
 */
function HeadingLevelIcon({ level }) {
  return <span>H{level}</span>;
}

/**
 * @param {Object} props
 * @param {HeadingLevel} props.selectedLevel
 */
export function HeadingLevelDropdown({ selectedLevel, onChange }) {
  return (
    <ToolbarDropdownMenu
      icon={<HeadingLevelIcon level={selectedLevel} />}
      label="Change alert title heading level"
      controls={HEADING_LEVELS.map((level) => ({
        icon: <HeadingLevelIcon level={level} />,
        label: `Heading level ${level}`,
        isActive: true,
        onClick() {
          onChange(level);
        },
      }))}
    />
  );
}
