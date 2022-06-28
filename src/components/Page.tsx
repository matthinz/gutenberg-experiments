import React, { PropsWithChildren } from "react";

import { Breadcrumb } from "./Breadcrumb";

export type PageProps = PropsWithChildren<{
  branch?: string;
  owner?: string;
  repo?: string;
  path?: string;
}>;

export function Page({ children, branch, owner, repo, path }: PageProps) {
  const trail = [owner, repo, branch, ...(path ?? "").split("/")].filter(
    (x) => x
  );

  return (
    <div className="grid-container">
      <Breadcrumb
        items={trail.map((item, index) => ({
          text: item,
          url: `/${trail.slice(0, index + 1).join("/")}`,
        }))}
      />
      {children}
    </div>
  );
}
