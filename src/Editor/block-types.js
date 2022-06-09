import * as column from "@wordpress/block-library/build-module/column";
import * as columns from "@wordpress/block-library/build-module/columns";
import * as heading from "@wordpress/block-library/build-module/heading";
import * as list from "@wordpress/block-library/build-module/list";
import * as listItem from "@wordpress/block-library/build-module/list-item";
import * as paragraph from "@wordpress/block-library/build-module/paragraph";
import * as quote from "@wordpress/block-library/build-module/quote";

import * as alert from "./blocks/Alert";

export const BLOCK_TYPES = [
  alert,
  column,
  columns,
  heading,
  list,
  listItem,
  paragraph,
  quote,
];
