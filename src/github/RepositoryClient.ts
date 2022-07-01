import { Octokit } from "@octokit/rest";
import {
  ChangeSet,
  Directory,
  File,
  FileContent,
  RepositoryClient,
} from "../types";

type Promised<T> = T extends Promise<infer P> ? P : never;

type OctokitTree = Promised<
  ReturnType<InstanceType<typeof Octokit>["git"]["getTree"]>
>["data"];

type OctokitTreeItem = OctokitTree["tree"][number];

export class GitHubRepositoryClient implements RepositoryClient {
  constructor(
    private readonly octokit: Octokit,
    private readonly owner: string,
    private readonly repo: string,
    private readonly baseBranch: string = "main"
  ) {}

  applyChanges(changes: ChangeSet): Promise<void> {
    throw new Error("NOT IMPLEMENTED");
  }

  getChanges(id: string): Promise<ChangeSet | undefined> {
    throw new Error("NOT IMPLEMENTED");
  }

  async getItem(path: string): Promise<Directory | File | undefined> {
    const pathParts = path
      .replace(/(^\/+|\/+$)/g, "")
      .split("/")
      .filter((part) => part.length > 0);

    let tree = await this.getTreeForRef(`heads/${this.baseBranch}`);
    const currentPath: string[] = [];

    while (pathParts.length > 0) {
      const part = pathParts.shift();
      if (part != null) currentPath.push(part);

      // NOTE: paths in tree.tree are relative to the root of the tree
      //       (e.g. "index.html", not "foo/bar/index.html")
      const treeEntry = tree.tree.find((e) => e.path === part);

      if (treeEntry == null) {
        throw new Error(`item not found in tree: ${currentPath.join("/")}`);
      } else if (treeEntry.type === "tree") {
        // Load this tree to continue our search
        const { sha } = treeEntry;
        if (sha == null) {
          throw new Error(`tree entry does not have sha: ${treeEntry.path}`);
        }
        tree = await this.getTreeBySha(sha);
      } else if (treeEntry.type === "blob") {
        if (pathParts.length > 0) {
          throw new Error(`item is not a tree: ${currentPath.join("/")}`);
        }
        return this.blobToFile(`/${currentPath.join("/")}`, treeEntry);
      } else {
        throw new Error(`unknown tree entry type: ${treeEntry.type}`);
      }
    }

    return this.treeToDirectory(`/${currentPath.join("/")}`, tree.sha);
  }

  prepareChanges(
    name: string,
    saveFiles: File[],
    deleteFiles: File[]
  ): Promise<ChangeSet> {
    throw new Error("NOT IMPLEMENTED");
  }

  private blobToFile(path, blob: OctokitTreeItem): File {
    const { path: name, sha } = blob;

    if (name == null) {
      throw new Error("blob does not have path");
    }

    if (sha == null) {
      throw new Error("blob does not have a sha");
    }

    return {
      type: "file",
      name,
      path,
      content: this.getBlobContents.bind(this, sha),
    };
  }

  private async getBlobContents(sha: string): Promise<FileContent> {
    const { owner, repo } = this;

    const {
      data: { content, encoding },
    } = await this.octokit.git.getBlob({
      owner,
      repo,
      file_sha: sha,
    });

    if (encoding !== "utf-8" && encoding !== "base64") {
      throw new Error(`unsupported encoding: ${encoding}`);
    }

    return { content, encoding };
  }

  private async getDirectoryItemsBySha(
    path: string,
    sha: string
  ): Promise<(Directory | File)[]> {
    const tree = await this.getTreeBySha(sha);
    return tree.tree
      .map((item) => {
        const itemPath =
          path === "/" ? `/${item.path}` : `${path}/${item.path}`;

        if (item.type === "tree") {
          return this.treeToDirectory(itemPath, item.sha ?? "");
        } else if (item.type === "blob") {
          return this.blobToFile(itemPath, item);
        } else {
          return undefined;
        }
      })
      .filter((x) => x) as Directory[];
  }

  private async getTreeBySha(sha: string): Promise<OctokitTree> {
    const { owner, repo } = this;

    const { data } = await this.octokit.git.getTree({
      owner,
      repo,
      tree_sha: sha,
    });

    return data;
  }

  private async getTreeForRef(ref: string): Promise<OctokitTree> {
    const { owner, repo } = this;

    const {
      data: {
        object: { sha },
      },
    } = await this.octokit.git.getRef({
      owner,
      repo,
      ref,
    });

    return await this.getTreeBySha(sha);
  }

  private treeToDirectory(path: string, treeSha: string): Directory {
    return {
      type: "directory",
      name: path.split("/").pop() ?? "",
      path,
      items: this.getDirectoryItemsBySha.bind(this, path, treeSha),
    };
  }
}
