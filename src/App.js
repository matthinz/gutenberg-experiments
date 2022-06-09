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
      <h1>Gutenberg Editor</h1>
      <p>
        This is an experiment with using Wordpress's Gutenberg editor outside
        Wordpress itself, incorporating elements from the U.S. Web Design
        System.
      </p>
      <Editor blocks={blocks} onChange={handleChange} />
      <hr />
      <h2>Serialized blocks</h2>
      <p>
        This is the serialized output from the block editor. It is valid HTML
        and can be stored as a string.
      </p>
      <textarea
        readOnly
        value={serializedBlocks}
        className="width-full height-card"
      />
    </div>
  );
}
