import { Octokit } from "@octokit/rest";
import { GitHubRepositoryClient } from "./RepositoryClient";

describe("GitHubRepositoryClient", () => {
  describe("#getItem", () => {
    const o = {
      git: {
        getTree: jest.fn().mockReturnValue({
          data: {
            tree: [
              {
                type: "blob",
                path: "foo.txt",
                sha: "1234",
              },
              {
                type: "blob",
                path: "bar.txt",
                sha: "5678",
              },
            ],
          },
        }),
        getRef: jest.fn().mockReturnValue({
          data: {
            object: {
              sha: "ABCD",
            },
          },
        }),
      },
    } as unknown as Octokit;

    const client = new GitHubRepositoryClient(o, "user", "reponame");

    it("uses main branch", async () => {
      await client.getItem("/");
      expect(o.git.getRef).toHaveBeenCalledWith({
        owner: "user",
        repo: "reponame",
        ref: "heads/main",
      });
    });

    describe("accessing root directory", () => {
      ["", "/"].forEach((path) => {
        it(`works via '${path}'`, async () => {
          const item = await client.getItem(path);

          expect(item).toStrictEqual({
            type: "directory",
            name: "",
            path: "/",
            items: expect.any(Function),
          });

          const items = item?.type === "directory" && (await item.items());

          expect(items).toStrictEqual([
            {
              type: "file",
              name: "foo.txt",
              path: "/foo.txt",
              content: expect.any(Function),
            },
            {
              type: "file",
              name: "bar.txt",
              path: "/bar.txt",
              content: expect.any(Function),
            },
          ]);
        });
      });
    });

    describe("returning file in a subdirectory", () => {
      ["", "/"].forEach((prefix) => {
        const path = `${prefix}`;
        it.todo(`works with '${path}'`);
      });
    });
  });
});
