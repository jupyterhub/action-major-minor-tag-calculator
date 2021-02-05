// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
const { env } = require("process");
const semver = require("semver");

function supportedPrerelease(pre) {
  // Supported prereleases are either empty or digits only.
  //
  // Example: The semver version 1.2.3-4 is a supported but 1.2.3-alpha.1 isn't
  //          supported.
  //
  return !pre.length || String(pre).match(/^\d+$/);
}

async function calculateTags(token, owner, repo, ref, prefix) {
  // About the parameters:
  // - token is used to authenticate against the GitHub API that in turn is used
  //   to list tags for github.com/<owner>/<repo>.
  // - ref is the git reference that triggered the GitHub Workflow's Job's step
  //   where this action runs and is what decides the output given the GitHub
  //   repo's available tags.
  //
  core.debug(`ref: ${ref}`);

  if (!ref) {
    core.debug("No ref");
    return [];
  }
  if (ref.startsWith("refs/heads/")) {
    const branch = ref.substring(11);
    core.debug(`Branch: ${branch}`);
    return [`${prefix}${branch}`];
  }
  if (!ref.startsWith("refs/tags/")) {
    throw new Error(`Not a tag or branch: ${ref}`);
  }

  const currentTag = ref.substring(10);
  core.debug(`currentTag: ${currentTag}`);
  if (!semver.valid(currentTag)) {
    throw new Error(`Invalid semver tag: ${currentTag}`);
  }

  const current = semver.parse(currentTag, { includePrerelease: true });
  if (!supportedPrerelease(current.prerelease)) {
    core.warning(`Tag prerelease ${currentTag} is not supported`);
    return [`${prefix}${currentTag}`];
  }

  const octokit = github.getOctokit(token);
  const tagrefs = await octokit.paginate(octokit.repos.listTags, {
    owner: owner,
    repo: repo,
  });
  const parsedTagrefs = tagrefs.map((a) =>
    semver.parse(a.name, { includePrerelease: true })
  );

  const tags = parsedTagrefs
    .filter((t) => supportedPrerelease(t.prerelease))
    .sort((a, b) => semver.compare(a, b))
    .reverse();
  core.debug(`tags: ${tags}`);

  const majorTags = tags.filter((t) => t.major == current.major);
  core.debug(`majorTags: ${majorTags}`);

  const minorTags = majorTags.filter((t) => t.minor == current.minor);
  core.debug(`minorTags: ${minorTags}`);

  let outputTags = [];
  if (current.prerelease.length) {
    outputTags.push(`${prefix}${current.version}`);
  }

  outputTags.push(
    `${prefix}${current.major}.${current.minor}.${current.patch}`
  );

  core.debug(semver.compare(current, tags[0]) >= 0);
  if (!tags.length || semver.compare(current.toString().split("-")[0], tags[0]) >= 0) {
    outputTags.push(`${prefix}${current.major}.${current.minor}`);
    outputTags.push(`${prefix}${current.major}`);
    outputTags.push(`${prefix}latest`);
  } else if (semver.compare(current.toString().split("-")[0], majorTags[0]) >= 0) {
    outputTags.push(`${prefix}${current.major}.${current.minor}`);
    outputTags.push(`${prefix}${current.major}`);
  } else if (semver.compare(current.toString().split("-")[0], minorTags[0]) >= 0) {
    outputTags.push(`${prefix}${current.major}.${current.minor}`);
  }
  core.debug(`outputTags: ${outputTags}`);
  return outputTags;
}

async function run() {
  try {
    // The workflow must set githubToken to the GitHub Secret Token
    // githubToken: ${{ secrets.GITHUB_TOKEN }}
    const githubToken = core.getInput("githubToken");
    const prefix = core.getInput("prefix");

    core.debug(JSON.stringify(github.context));
    const allTags = await calculateTags(
      githubToken,
      github.context.payload.repository.owner.login,
      github.context.payload.repository.name,
      github.context.payload.ref,
      prefix
    );

    core.info(allTags);
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
