import React from "react";
import { Link } from "@reach/router";

export type BreadcrumbProps = {
  items: {
    text: string;
    url: string;
  }[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="usa-breadcrumb" aria-label="Breadcrumbs">
      <ol className="usa-breadcrumb__list">
        {items.map(({ text, url }, index) => (
          <li
            key={index}
            className={[
              "usa-breadcrumb__list-item",
              index === items.length - 1 && "usa-current",
            ]
              .filter((x) => x)
              .join(" ")}
          >
            <Link to={url} className="usa-breadcrumb__link">
              <span>{text}</span>
            </Link>
          </li>
        ))}
        {/* <li
          className="usa-breadcrumb__list-item usa-current"
          aria-current="page"
        >
          <span>Women-owned small business federal contracting program</span>
        </li> */}
      </ol>
    </nav>
  );
}
