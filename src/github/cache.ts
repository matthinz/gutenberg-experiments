import { Blob, Client, GetBlobOptions, GetTreeOptions, Tree } from "./types";
import localforage from "localforage";

export function withCaching(client: Client): Client {
  async function call<T>(
    key: string,
    func: () => Promise<T>,
    ...args: unknown[]
  ): Promise<T> {
    d;
    let value = await localforage.getItem(key);
    if (value != null) {
      return value as T;
    }
    value = await func.call(undefined, ...args);
    if (value != null) {
      await localforage.setItem(key, value);
    }
    return value as T;
  }

  async function getBlob(options: GetBlobOptions): Promise<Blob> {
    const key = ["blobs", options.sha].join(".");
    return call(key, client.getBlob.bind(client), options);
  }

  return {
    ...client,
    getBlob,
  };
}
