import _metadata from "./block.json";

import { ProcessListItemEditor as edit } from "./edit";
import { ProcessListItem as save } from "./save";

export const { name } = _metadata;
export const metadata = _metadata;
export const settings = { edit, save };
