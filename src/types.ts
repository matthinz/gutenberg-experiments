export type ChangeSet = {
  readonly id: string;
  readonly toInsert: File[];
  readonly toUpdate: File[];
  readonly toDelete: FileReference[];
};

export type Client = {
  createClientForRepository(repo: Repository | string): RepositoryClient;
  getRepositories(): Promise<Repository[]>;
};

export type Directory = {
  readonly type: "directory";
  readonly name: string;
  readonly path: string;
  readonly items: () => Promise<(Directory | File)[]>;
};

export type File = {
  readonly type: "file";
  readonly name: string;
  readonly path: string;
  readonly content: () => Promise<FileContent>;
};

export type FileContent = {
  readonly encoding: "utf-8" | "base64";
  readonly content: string;
};

export type FileReference = File | string;

export type Repository = {
  id: string;
  name: string;
};

export type RepositoryClient = {
  applyChanges(changeset: ChangeSet): Promise<void>;
  getChanges(id: string): Promise<ChangeSet | undefined>;
  getItem(path: string): Promise<Directory | File | undefined>;
  prepareChanges(
    name: string,
    saveFiles: File[],
    deleteFiles: File[]
  ): Promise<ChangeSet>;
};
