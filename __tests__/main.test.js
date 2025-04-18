"use strict";

const {
  calculateTags,
  calculateTagsFromList,
  testExports,
} = require("../src/index");
const { MockAgent, setGlobalDispatcher } = require("undici");

const core = require("@actions/core");
jest.mock("@actions/core");

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
  jest.restoreAllMocks();
});

test("No other tags", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);

  const { tags, newTag, existingTags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
  });
  expect(tags).toEqual(["0.0.1", "0.0", "0", "latest"]);
  expect(newTag).toEqual("0.0.1");
  expect(existingTags).toEqual(["0.0.1"]);
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
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
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
  const { tags, newTag, existingTags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-2",
  });
  expect(tags).toEqual(["1.1.0-2", "1.1.0", "1.1", "1"]);
  expect(newTag).toEqual("1.1.0-2");
  expect(existingTags).toEqual(["1.0.0", "2.0.0-1", "1.1.0-1"]);
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
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-10",
  });
  expect(tags).toEqual(["1.1.0-10", "1.1.0", "1.1", "1"]);
});

test("Unsupported prerelease tag", async () => {
  tagInterceptor.reply(200, []);
  const { tags, newTag, existingTags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/2.0.0-rc1",
  });
  expect(tags).toEqual(["2.0.0-rc1"]);
  expect(newTag).toEqual("2.0.0-rc1");
  expect(existingTags).toEqual([]);
});

test("Unsupported prerelease tag, loose parsing", async () => {
  tagInterceptor.reply(200, []);
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/2.0.0b1",
  });
  expect(tags).toEqual(["2.0.0b1"]);
});

test("Prerelease tag with build-number", async () => {
  tagInterceptor.reply(200, [
    {
      name: "2.0.0-rc1",
    },
  ]);
  const { tags, newTag, existingTags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/2.0.0-rc1-5",
    prefix: "example.org/",
    prereleaseHasBuild: true,
  });
  expect(tags).toEqual(["example.org/2.0.0-rc1-5", "example.org/2.0.0-rc1"]);
  expect(newTag).toEqual("2.0.0-rc1-5");
  expect(existingTags).toEqual(["2.0.0-rc1"]);
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
  const { tags, newTag, existingTags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: null,
  });
  expect(tags).toEqual([]);
  expect(newTag).toEqual(null);
  expect(existingTags).toEqual(null);
});

test("No ref use default", async () => {
  const { tags, newTag, existingTags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: null,
    defaultTag: "default-tag",
  });
  expect(tags).toEqual(["default-tag"]);
  expect(newTag).toEqual(null);
  expect(existingTags).toEqual(null);
});

test("Single prefix", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
    // test use of different whitespace separators and a combination of both
    prefix: "prefix1:\tprefix2:\n ,prefix3:",
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

test("Single suffix", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
    suffix: "-suffix",
  });
  expect(tags).toEqual([
    "0.0.1-suffix",
    "0.0-suffix",
    "0-suffix",
    "latest-suffix",
  ]);
});

test("Multiple prefix and suffix", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
    // test use of different whitespace separators and a combination of both
    prefix: "prefix1:,prefix2:",
    suffix: "-a -b",
  });
  expect(tags).toEqual([
    "prefix1:0.0.1-a",
    "prefix1:0.0.1-b",
    "prefix2:0.0.1-a",
    "prefix2:0.0.1-b",
    "prefix1:0.0-a",
    "prefix1:0.0-b",
    "prefix2:0.0-a",
    "prefix2:0.0-b",
    "prefix1:0-a",
    "prefix1:0-b",
    "prefix2:0-a",
    "prefix2:0-b",
    "prefix1:latest-a",
    "prefix1:latest-b",
    "prefix2:latest-a",
    "prefix2:latest-b",
  ]);
});

test("Multiple prefix and suffix with empty string", async () => {
  tagInterceptor.reply(200, [
    {
      name: "0.0.1",
    },
  ]);
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/0.0.1",
    // test use of ""
    prefix: '"",prefix2:',
    suffix: '"",-b',
  });
  expect(tags).toEqual([
    "0.0.1",
    "0.0.1-b",
    "prefix2:0.0.1",
    "prefix2:0.0.1-b",
    "0.0",
    "0.0-b",
    "prefix2:0.0",
    "prefix2:0.0-b",
    "0",
    "0-b",
    "prefix2:0",
    "prefix2:0-b",
    "latest",
    "latest-b",
    "prefix2:latest",
    "prefix2:latest-b",
  ]);
});

test("Branch", async () => {
  const { tags, newTag, existingTags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/heads/main",
  });
  expect(tags).toEqual(["main"]);
  expect(newTag).toEqual(null);
  expect(existingTags).toEqual(null);
});

test("Branch doesn't match regex", async () => {
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/heads/branch/with/slash",
    regexAllowed: "^[^/]+$",
  });
  expect(tags).toEqual([]);
});

test("Branch doesn't match regex with default", async () => {
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
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
  const { tags } = await calculateTags({
    token: "TOKEN",
    owner: "owner",
    repo: "repo",
    ref: "refs/tags/1.1.0-1",
  });
  expect(tags).toEqual(["1.1.0-1", "1.1.0", "1.1", "1"]);
});

test("Externally provided tags", async () => {
  const tags = await calculateTagsFromList({
    newTag: "4.1.2-10",
    existingTags: [
      "other",
      "3.1.2",
      "4.0.0",
      "4.1.2",
      "4.1.2-9",
      "4.1.2-10invalid",
      "4.1.2-10-invalid",
      "4.2.0-0",
      "5.2.2",
      "5.2.2-2",
    ],
  });
  expect(tags).toEqual(["4.1.2-10", "4.1.2", "4.1"]);
});

test("Externally provided tags including existing current", async () => {
  const tags = await calculateTagsFromList({
    newTag: "4.1.2-10",
    existingTags: [
      "other",
      "3.1.2",
      "4.0.0",
      "4.1.2",
      "4.1.2-9",
      "4.1.2-10invalid",
      "4.1.2-10-invalid",
      "4.1.2-10",
      "4.2.0-0",
      "5.2.2",
      "5.2.2-2",
    ],
  });
  expect(tags).toEqual(["4.1.2-10", "4.1.2", "4.1"]);
});

describe("main", () => {
  const mockInputs = {
    githubToken: "",
    existingTags: "[]",
    newTag: "1.2.3",
    prefix: "",
    suffix: "",
    defaultTag: "",
    branchRegex: "",
  };

  it("run with provided tags existing", async () => {
    core.debug.mockImplementation(console.debug);
    core.info.mockImplementation(console.debug);
    const setOutput = jest.spyOn(core, "setOutput");
    const setFailed = jest.spyOn(core, "setFailed");

    core.getInput.mockImplementation((a) => {
      return { ...mockInputs, existingTags: '["asd", "2.0.0-0"]' }[a];
    });

    await testExports.run();

    console.log(setFailed.mock.calls);
    expect(setFailed).toHaveBeenCalledTimes(0);
    expect(setOutput).toHaveBeenCalledTimes(3);

    expect(setOutput.mock.calls[0]).toEqual(["tags", ["1.2.3", "1.2", "1"]]);
    expect(setOutput.mock.calls[1]).toEqual(["newTag", "1.2.3"]);
    expect(setOutput.mock.calls[2]).toEqual([
      "existingTags",
      ["asd", "2.0.0-0"],
    ]);
  });

  it("run with provided tags empty", async () => {
    core.debug.mockImplementation(console.debug);
    core.info.mockImplementation(console.debug);
    const setOutput = jest.spyOn(core, "setOutput");
    const setFailed = jest.spyOn(core, "setFailed");

    core.getInput.mockImplementation((a) => {
      return mockInputs[a];
    });

    await testExports.run();

    expect(setFailed).toHaveBeenCalledTimes(0);
    expect(setOutput).toHaveBeenCalledTimes(3);

    expect(setOutput.mock.calls[0]).toEqual([
      "tags",
      ["1.2.3", "1.2", "1", "latest"],
    ]);
    expect(setOutput.mock.calls[1]).toEqual(["newTag", "1.2.3"]);
    expect(setOutput.mock.calls[2]).toEqual(["existingTags", []]);
  });
});
