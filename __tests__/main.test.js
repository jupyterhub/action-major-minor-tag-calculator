"use strict";

const { calculateTags } = require("../src/index");
const { MockAgent, setGlobalDispatcher } = require("undici");
let mockAgent;
let tagInterceptor;

beforeEach(() => {
  mockAgent = new MockAgent({ connections: 1 });
  mockAgent.disableNetConnect();
  setGlobalDispatcher(mockAgent);
  tagInterceptor = mockAgent
    .get("https://api.github.com")
    .intercept({ path: "/repos/owner/repo/tags" })
    .defaultReplyHeaders({ "Content-Type": "application/json; charset=utf-8" });
});

afterEach(() => {
  mockAgent.assertNoPendingInterceptors();
  mockAgent.close();
});

test("No other tags", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);

  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
  });
  expect(tags).toEqual(["0.0.1", "0.0", "0", "latest"]);
});

test("Is the latest tag", async () => {
  tagInterceptor.reply(200, [
    {
      name: "1.0.0",
    },
    {
      name: "2.0.0",
    },
  ]);
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/2.0.0",
  });
  expect(tags).toEqual(["2.0.0", "2.0", "2", "latest"]);
});

test("Not the latest major tag", async () => {
  tagInterceptor.reply(200, [
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
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0",
  });
  expect(tags).toEqual(["1.1.0", "1.1", "1"]);
});

test("Not the latest minor tag", async () => {
  tagInterceptor.reply(200, [
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
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/2.2.1",
  });
  expect(tags).toEqual(["2.2.1", "2.2"]);
});

test("Includes pre-releases", async () => {
  tagInterceptor.reply(200, [
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
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-2",
  });
  expect(tags).toEqual(["1.1.0-2", "1.1.0", "1.1", "1"]);
});

test("Includes pre-releases jump one", async () => {
  tagInterceptor.reply(200, [
    {
      name: "1.0.0",
    },
    {
      name: "1.1.0-1",
    },
  ]);
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-2",
  });
  expect(tags).toEqual(["1.1.0-2", "1.1.0", "1.1", "1", "latest"]);
});

test("Includes pre-releases no jump", async () => {
  tagInterceptor.reply(200, [
    {
      name: "1.1.0",
    },
  ]);
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-1",
  });
  expect(tags).toEqual(["1.1.0-1", "1.1.0", "1.1", "1", "latest"]);
});

test("Handling of an outdated build number", async () => {
  tagInterceptor.reply(200, [
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
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-1",
  });
  expect(tags).toEqual(["1.1.0-1"]);
});

test("Handling build number comparisons numerically", async () => {
  tagInterceptor.reply(200, [
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
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-10",
  });
  expect(tags).toEqual(["1.1.0-10", "1.1.0", "1.1", "1"]);
});

test("Unsupported prerelease tag", async () => {
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/2.0.0-rc1",
  });
  expect(tags).toEqual(["2.0.0-rc1"]);
});

test("Unsupported prerelease tag, loose parsing", async () => {
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/2.0.0b1",
  });
  expect(tags).toEqual(["2.0.0b1"]);
});

test("Not a tag", async () => {
  await expect(
    calculateTags({
      token: "TOKEN",
      owner: "owner",
      repo: "repo",
      ref: "something/else",
    }),
  ).rejects.toEqual(new Error("Not a tag or branch: something/else"));
});

test("Invalid semver tag", async () => {
  await expect(
    calculateTags({
      token: "TOKEN",
      owner: "owner",
      repo: "repo",
      ref: "refs/tags/v1",
    }),
  ).rejects.toEqual(new Error("Invalid semver tag: v1"));
});

test("No ref", async () => {
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: null,
  });
  expect(tags).toEqual([]);
});

test("No ref use default", async () => {
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: null,
    defaultTag: "default-tag",
  });
  expect(tags).toEqual(["default-tag"]);
});

test("Single prefix", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
    prefix: "prefix:",
  });
  expect(tags).toEqual([
    "prefix:0.0.1",
    "prefix:0.0",
    "prefix:0",
    "prefix:latest",
  ]);
});

test("Multiple prefix", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
    // test use of different whitespace separators and a combination of both
    prefix: "prefix1:\tprefix2:\n, prefix3:",
  });
  expect(tags).toEqual([
    "prefix1:0.0.1",
    "prefix2:0.0.1",
    "prefix3:0.0.1",
    "prefix1:0.0",
    "prefix2:0.0",
    "prefix3:0.0",
    "prefix1:0",
    "prefix2:0",
    "prefix3:0",
    "prefix1:latest",
    "prefix2:latest",
    "prefix3:latest",
  ]);
});

test("Branch", async () => {
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/heads/main",
  });
  expect(tags).toEqual(["main"]);
});

test("Branch doesn't match regex", async () => {
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/heads/branch/with/slash",
    regexAllowed: "^[^/]+$",
  });
  expect(tags).toEqual([]);
});

test("Branch doesn't match regex with default", async () => {
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/heads/branch/with/slash",
    prefix: "prefix-ignored-by-defaultTag",
    defaultTag: "default-tag",
    regexAllowed: "^[^/]+$",
  });
  expect(tags).toEqual(["default-tag"]);
});

test("Includes pre-releases one", async () => {
  tagInterceptor.reply(200, [
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
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-1",
  });
  expect(tags).toEqual(["1.1.0-1", "1.1.0", "1.1", "1", "latest"]);
});

test("Includes pre-releases one with new tag", async () => {
  tagInterceptor.reply(200, [
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
  const tags = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-1",
  });
  expect(tags).toEqual(["1.1.0-1", "1.1.0", "1.1", "1"]);
});
