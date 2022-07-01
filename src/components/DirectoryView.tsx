import React, { useEffect, useState } from "react";

import { Directory, File } from "../types";

type DirectoryViewProps = {
  directory: Directory;
};

export function DirectoryView({ directory }) {
  const [items, setItems] = useState<(Directory | File)[] | undefined>();

  useEffect(() => {
    let cancel = false;
    directory.items().then((nextItems) => {
      console.log(nextItems);
      if (!cancel) {
        setItems(nextItems);
      }
    });
    return () => {
      cancel = true;
    };
  }, [directory.path]);

  if (!items) {
    return null;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.name}>
          <a href={item.path}>{item.name}</a>
        </li>
      ))}
    </ul>
  );
}
