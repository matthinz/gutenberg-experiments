import { GitHubClient } from "./Client";
import { GitHubRepositoryClient } from "./RepositoryClient";
import { OctokitClient } from "./types";

describe("GitHubClient", () => {
  describe("#ctor", () => {
    it("accepts an accessToken", () => {
      const client = new GitHubClient("foo");
      expect(client).toBeInstanceOf(GitHubClient);
    });
  });

  describe("#getRepositories", () => {
    it("returns respositories", async () => {
      const listForAuthenticatedUser = jest.fn().mockReturnValue({
        data: [
          {
            name: "foo",
            full_name: "user/foo",
          },
          {
            name: "bar",
            full_name: "user/bar",
          },
        ],
      });

      const octokit = {
        repos: {
          listForAuthenticatedUser,
        },
      } as unknown as OctokitClient;

      const client = new GitHubClient(octokit);

      const result = await client.getRepositories();

      expect(listForAuthenticatedUser).toHaveBeenCalledWith({
        type: "owner",
      });

      expect(result).toStrictEqual([
        { id: "user/foo", name: "foo" },
        { id: "user/bar", name: "bar" },
      ]);
    });
  });

  describe("#createClientForRepository", () => {
    it("returns a RepositoryClient", () => {
      const client = new GitHubClient("foo");
      const repository = { id: "user/foo", name: "foo" };
      const repositoryClient = client.createClientForRepository(repository);
      expect(repositoryClient).toBeInstanceOf(GitHubRepositoryClient);
    });
  });
});
