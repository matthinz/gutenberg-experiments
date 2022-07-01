export type BlobMetadata = {
  sha: string;
  path: string;
};

export type Blob = {
  sha: string;
  encoding: "utf8" | "base64";
  content: string;
};

export type Commit = {
  sha: string;
  message: string;
  tree: string;
};

export type CreateClientOptions = {
  accessToken: string;
  owner: string;
  repo: string;
};

export type Client = {
  createClientForRepo(repo: string): RepoClient;
  getRepos(): Promise<string[]>;
  getUserName(): Promise<string>;
};

export type RepoClient = {
  createCommit(options: CreateCommitOptions): Promise<string>;
  createTree(options: CreateTreeOptions): Promise<string>;
  getBlob(options: GetBlobOptions): Promise<Blob>;
  getBranches(): Promise<string[]>;
  getCommitForBranch(branch: string): Promise<Commit>;
  getShaForBranch(options: GetShaForBranchOptions): Promise<string>;
  getTree(options: GetTreeOptions): Promise<Tree>;
  updateBranch(options: UpdateBranchOptions): Promise<void>;
};

export type CreateCommitOptions = {
  parent: string;
  tree: string;
  message: string;
};

export type CreateTreeOptions = {
  parent: string;
  items: {
    path: string;
    content: string;
  }[];
};

export type GetBlobOptions = {
  sha: string;
};

export type GetShaForBranchOptions = {
  branch: string;
};

export type GetTreeOptions = {
  sha: string;
};

export type TreeItem = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size: Number;
  url: string;
};

export type Tree = {
  sha: string;
  items: TreeItem[];
};

export type UpdateBranchOptions = {
  branch: string;
  sha: string;
};
