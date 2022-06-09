import { AlertEdit } from "./edit";
import { saveAlert } from "./save";

export const metadata = {
  name: "uswds/alert",
  title: "Alert",
};

export const { name } = metadata;

export const settings = {
  edit: AlertEdit,
  save: saveAlert,
};
