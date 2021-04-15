"use strict";

const { calculateTags } = require("../src/index");
const nock = require("nock");

test("No other tags", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "0.0.1",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/0.0.1",
    "",
    ""
  );
  expect(tags).toEqual(["0.0.1", "0.0", "0", "latest"]);
  scope.done();
});

test("Is the latest tag", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/2.0.0",
    "",
    ""
  );
  expect(tags).toEqual(["2.0.0", "2.0", "2", "latest"]);
  scope.done();
});

test("Not the latest major tag", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.23",
      },
      {
        name: "2.0.0",
      },
      {
        name: "1.1.0",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0", "1.1", "1"]);
  scope.done();
});

test("Not the latest minor tag", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0",
      },
      {
        name: "2.10.0",
      },
      {
        name: "2.2.1",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/2.2.1",
    "",
    ""
  );
  expect(tags).toEqual(["2.2.1", "2.2"]);
  scope.done();
});

test("Includes pre-releases", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0-1",
      },
      {
        name: "1.1.0-1",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0-2",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0-2", "1.1.0", "1.1", "1"]);
  scope.done();
});

test("Includes pre-releases jump one", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "1.1.0-1",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0-2",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0-2", "1.1.0", "1.1", "1", "latest"]);
  scope.done();
});

test("Includes pre-releases no jump", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.1.0",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0-1",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0-1", "1.1.0", "1.1", "1", "latest"]);
  scope.done();
});

test("Handling of an outdated build number", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0-2",
      },
      {
        name: "1.1.0-2",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0-1",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0-1"]);
  scope.done();
});

test("Handling build number comparisons numerically", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "2.0.0-2",
      },
      {
        name: "1.1.0-2",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0-10",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0-10", "1.1.0", "1.1", "1"]);
  scope.done();
});

test("Unsupported prerelease tag", async () => {
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/2.0.0-rc1",
    "",
    ""
  );
  expect(tags).toEqual(["2.0.0-rc1"]);
});

test("Not a tag", async () => {
  await expect(
    calculateTags("TOKEN", "owner", "repo", "something/else", "", "")
  ).rejects.toEqual(new Error("Not a tag or branch: something/else"));
});

test("Invalid semver tag", async () => {
  await expect(
    calculateTags("TOKEN", "owner", "repo", "refs/tags/v1", "", "")
  ).rejects.toEqual(new Error("Invalid semver tag: v1"));
});

test("No ref", async () => {
  const tags = await calculateTags("TOKEN", "owner", "repo", null, "", "");
  expect(tags).toEqual([]);
});

test("No ref use default", async () => {
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    null,
    "",
    "default-tag"
  );
  expect(tags).toEqual(["default-tag"]);
});

test("Prefix", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "0.0.1",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/0.0.1",
    "prefix:",
    ""
  );
  expect(tags).toEqual([
    "prefix:0.0.1",
    "prefix:0.0",
    "prefix:0",
    "prefix:latest",
  ]);
  scope.done();
});

test("Branch", async () => {
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/heads/main",
    "",
    ""
  );
  expect(tags).toEqual(["main"]);
});

test("Includes pre-releases one", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "1.1.0",
      },
      {
        name: "1.1.0-0",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0-1",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0-1", "1.1.0", "1.1", "1", "latest"]);
  scope.done();
});

test("Includes pre-releases one with new tag", async () => {
  const scope = nock("https://api.github.com")
    .get("/repos/owner/repo/tags")
    .reply(200, [
      {
        name: "1.0.0",
      },
      {
        name: "1.1.0",
      },
      {
        name: "2.0.0",
      },
      {
        name: "1.1.0-0",
      },
    ]);
  const tags = await calculateTags(
    "TOKEN",
    "owner",
    "repo",
    "refs/tags/1.1.0-1",
    "",
    ""
  );
  expect(tags).toEqual(["1.1.0-1", "1.1.0", "1.1", "1"]);
  scope.done();
});
