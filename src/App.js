import React, { useCallback, useEffect, useState } from "react";
import { Editor } from "./Editor";
import { serialize } from "@wordpress/blocks";

import "./style.scss";

export function App() {
  const [blocks, setBlocks] = useState([]);
  const [serializedBlocks, setSerializedBlocks] = useState([]);
  let timer;

  const handleChange = useCallback((newBlocks) => {
    setBlocks(newBlocks);
  }, []);

  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    timer = setTimeout(() => {
      timer = undefined;
      setSerializedBlocks(serialize(blocks));
    }, 500);
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
    };
  }, [timer, blocks]);

  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col">
          <h1>Editor</h1>
          <Editor blocks={blocks} onChange={handleChange} />
          <hr />
          <h2>Serialized blocks</h2>
          <textarea
            readOnly
            value={serializedBlocks}
            className="width-full height-card"
          />
        </div>
      </div>
    </div>
  );
}
