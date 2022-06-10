import { ProcessListEditor as edit } from "./edit";
import { ProcessList as save } from "./save";
import _metadata from "./block.json";

export const { name } = _metadata;
export const metadata = _metadata;
export const settings = { save, edit };
