import { Octokit } from "@octokit/rest";

import {
  Client,
  Directory,
  File,
  Repository,
  RepositoryClient,
} from "../types";
import { GitHubRepositoryClient } from "./RepositoryClient";
import { OctokitClient } from "./types";

export class GitHubClient implements Client {
  private readonly octokit: OctokitClient;

  constructor(accessToken: string | OctokitClient) {
    this.octokit =
      typeof accessToken === "string"
        ? new Octokit({
            auth: accessToken,
          })
        : accessToken;
  }

  async getRepositories(): Promise<Repository[]> {
    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      type: "owner",
    });
    return data.map((repo) => ({
      id: repo.full_name,
      name: repo.name,
    }));
  }

  createClientForRepository(repository: Repository | string): RepositoryClient {
    const [owner, repo] = (
      typeof repository === "string" ? repository : repository.id
    ).split("/");
    return new GitHubRepositoryClient(this.octokit, owner, repo);
  }
}
