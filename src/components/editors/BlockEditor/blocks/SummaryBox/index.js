import { SummaryBoxEditor as edit } from "./edit";
import { SummaryBox as save } from "./save";

import _metadata from "./block.json";

export const metadata = _metadata;

export const { name } = metadata;

export const settings = {
  edit,
  save,
};
