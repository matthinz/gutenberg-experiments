export type ChangeSet = {
  id: string;
  save: File[];
  delete: FileMetadata[];
};

export type Client = {
  createClientForRepository(repo: Repository): RepositoryClient;
  getRepositories(): Promise<Repository[]>;
};

export type Directory = {
  readonly name: string;
  readonly parent?: Directory;
  readonly children: (Directory | FileMetadata)[];
};

export type FileMetadata = {
  name: string;
  parent: Directory;
};

export type File = FileMetadata & {
  content: string;
  encoding: "utf8" | "base64";
};

export type Repository = {
  id: string;
  name: string;
};

export type RepositoryClient = {
  applyChanges(changeset: ChangeSet): Promise<void>;
  getDirectory(path: string): Promise<Directory>;
  getRootDirectory(): Promise<Directory>;
  prepareChanges(
    name: string,
    saveFiles: File[],
    deleteFiles: FileMetadata[]
  ): Promise<ChangeSet>;
};
