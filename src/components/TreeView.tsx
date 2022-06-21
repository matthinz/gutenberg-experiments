import React from "react";
import { Tree } from "../github";

type TreeViewProps = {
  tree: Tree;
};

export function TreeView({ tree }: TreeViewProps) {
  return (
    <ul>
      {tree.items.map((item) => (
        <li key={item.sha}>
          <a href={item.path}>{item.path}</a>
        </li>
      ))}
    </ul>
  );
}
