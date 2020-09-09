// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const { env } = require("process");
const semver = require("semver");

async function calculateTags(token, owner, repo, ref) {
  core.debug(`ref: ${ref}`);
  if (!ref.startsWith("refs/tags/")) {
    throw new Error(`Not a tag: ${ref}`);
  }

  const currentTag = ref.substring(10);
  core.debug(`currentTag: ${currentTag}`);
  if (!semver.valid(currentTag)) {
    throw new Error(`Invalid semver tag: ${currentTag}`);
  }

  const octokit = github.getOctokit(token);
  const tagrefs = await octokit.paginate(octokit.repos.listTags, {
    owner: owner,
    repo: repo,
  });

  let outputTags = new Set([currentTag]);
  core.debug(`tagrefs: ${tagrefs}`);
  if (semver.prerelease(currentTag)) {
    return outputTags;
  }

  // Ignore existing pre-release tags
  let tags = tagrefs.map((a) => a.name).filter((t) => !semver.prerelease(t));
  tags.sort((a, b) => -semver.compare(a, b));
  core.debug(`tags: ${tags}`);

  if (!tags.length || semver.compare(currentTag, tags[0]) >= 0) {
    const major = semver.major(currentTag);
    const minor = semver.minor(currentTag);
    outputTags.add([major, minor].join("."));
    outputTags.add(String(major));
    outputTags.add("latest");
  }
  core.debug(`outputTags: ${outputTags}`);
  return outputTags;
}

async function run() {
  try {
    // The workflow must set githubToken to the GitHub Secret Token
    // githubToken: ${{ secrets.GITHUB_TOKEN }}
    const githubToken = core.getInput("githubToken");

    console.debug(JSON.stringify(github.context));
    const allTags = Array.from(
      await calculateTags(
        githubToken,
        github.context.payload.repository.owner.login,
        github.context.payload.repository.name,
        github.context.payload.ref
      )
    );

    console.log(allTags);
    core.setOutput("tags", allTags);
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Don't run when imported as module
if (!module.parent) {
  run();
}

exports.calculateTags = calculateTags;
