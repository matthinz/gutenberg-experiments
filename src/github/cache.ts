import { Blob, Client, GetBlobOptions, GetTreeOptions, Tree } from "./types";
import localforage from "localforage";

export function withCaching(client: Client): Client {
  async function call<T>(
    key: string,
    func: () => Promise<T>,
    ...args: unknown[]
  ): Promise<T> {
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

  async function getBlob({ sha }: GetBlobOptions): Promise<Blob> {
    const key = ["blobs", sha].join(".");
    return call(key, client.getBlob.bind(client), { owner, repo, sha });
  }

  function getTree({ owner, repo, sha }: GetTreeOptions): Promise<Tree> {
    const key = [owner, repo, "trees", sha].join(".");
    return call(key, client.getTree.bind(client), { owner, repo, sha });
  }

  return {
    ...client,
    getBlob,
    getTree,
  };
}
