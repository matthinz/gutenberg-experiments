import { AlertEdit } from "./edit";
import { saveAlert } from "./save";

import _metadata from "./block.json";

export const metadata = _metadata;

export const { name } = metadata;

export const settings = {
  edit: AlertEdit,
  save: saveAlert,
};
