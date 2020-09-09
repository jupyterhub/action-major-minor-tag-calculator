const { calculateTags } = require("../src/index");
const nock = require("nock");

test("No other tags", async () => {
  nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "0.0.1",
      },
    ]);
  const tags = await calculateTags("TOKEN", "owner", "repo", "refs/tags/0.0.1");
  expect(tags).toEqual(new Set(["0.0.1", "0.0", "0", "latest"]));
});

test("Is the latest tag", async () => {
  nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0",
      },
    ]);
  const tags = await calculateTags("TOKEN", "owner", "repo", "refs/tags/2.0.0");
  expect(tags).toEqual(new Set(["2.0.0", "2.0", "2", "latest"]));
});

test("Not the latest major tag", async () => {
  nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0",
      },
      {
        name: "1.1.0",
      },
    ]);
  const tags = await calculateTags("TOKEN", "owner", "repo", "refs/tags/1.1.0");
  expect(tags).toEqual(new Set(["1.1.0"]));
});

test("Not the latest minor tag", async () => {
  nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0",
      },
      {
        name: "2.1.0",
      },
      {
        name: "2.0.1",
      },
    ]);
  const tags = await calculateTags("TOKEN", "owner", "repo", "refs/tags/2.0.1");
  expect(tags).toEqual(new Set(["2.0.1"]));
});

test("Ignore existing pre-releases", async () => {
  nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0-rc1",
      },
      {
        name: "1.1.0",
      },
    ]);
  const tags = await calculateTags("TOKEN", "owner", "repo", "refs/tags/1.1.0");
  expect(tags).toEqual(new Set(["1.1.0", "1.1", "1", "latest"]));
});

test("Pre-release tag", async () => {
  nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      { name: "2.0.0-rc1" },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/2.0.0-rc1"
  );
  expect(tags).toEqual(new Set(["2.0.0-rc1"]));
});

test("Not a tag", async () => {
  await expect(
    calculateTags("TOKEN", "owner", "repo", "refs/heads/main")
  ).rejects.toEqual(new Error("Not a tag: refs/heads/main"));
});

test("Invalid semver tag", async () => {
  await expect(
    calculateTags("TOKEN", "owner", "repo", "refs/tags/v1")
  ).rejects.toEqual(new Error("Invalid semver tag: v1"));
});
