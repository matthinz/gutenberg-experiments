import errorIcon from "@uswds/uswds/img/usa-icons/error.svg";
import infoIcon from "@uswds/uswds/img/usa-icons/info.svg";
import successIcon from "@uswds/uswds/img/usa-icons/check_circle.svg";
import warningIcon from "@uswds/uswds/img/usa-icons/warning.svg";

export const DEFAULT_ALERT_TYPE = "info";

export const ALERT_TYPES = {
  error: {
    className: "bg-error-lighter",
    icon: errorIcon,
    label: "Error",
  },
  info: {
    className: "bg-info-lighter",
    icon: infoIcon,
    label: "Info",
  },
  success: {
    className: "bg-success-lighter",
    icon: successIcon,
    label: "Success",
  },
  warning: {
    className: "bg-warning-lighter",
    icon: warningIcon,
    label: "Warning",
  },
};
