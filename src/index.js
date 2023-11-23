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

function equalMajorMinorPatch(a, b) {
  // Predicate function for filtering
  return a.major == b.major && a.minor == b.minor && a.patch == b.patch;
}

function checkAgainstRegex(name, regexAllowed) {
  const re = new RegExp(regexAllowed);
  return re.test(name);
}

function expandPrefix(prefix, tag) {
  // Adds one or more prefixes to a tag, where prefix could be a single prefix
  // or a comma/whitespace separated list of prefixes.
  if (!prefix) {
    return [tag];
  }

  let rv = [];
  let prefixes = prefix.split(/\s|,/).filter(Boolean);
  prefixes.forEach((p) => rv.push(`${p}${tag}`));
  return rv;
}

async function calculateTags({
  token,
  owner,
  repo,
  ref,
  prefix = "",
  defaultTag = "",
  regexAllowed = "",
}) {
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
    if (defaultTag) {
      return [defaultTag];
    }
    return [];
  }
  if (ref.startsWith("refs/heads/")) {
    const branch = ref.substring(11);
    core.debug(`Branch: ${branch}`);
    if (!checkAgainstRegex(branch, regexAllowed)) {
      if (defaultTag) {
        return [defaultTag];
      }
      return [];
    }
    return expandPrefix(prefix, branch);
  }
  if (!ref.startsWith("refs/tags/")) {
    throw new Error(`Not a tag or branch: ${ref}`);
  }

  const currentTag = ref.substring(10);
  core.debug(`currentTag: ${currentTag}`);
  if (!semver.valid(currentTag, { loose: true })) {
    throw new Error(`Invalid semver tag: ${currentTag}`);
  }

  const current = semver.parse(currentTag, {
    includePrerelease: true,
    loose: true,
  });
  if (!supportedPrerelease(current.prerelease)) {
    core.warning(`Tag prerelease ${currentTag} is not supported`);
    return expandPrefix(prefix, currentTag);
  }

  const octokit = github.getOctokit(token);
  const tagrefs = await octokit.paginate(octokit.rest.repos.listTags, {
    owner: owner,
    repo: repo,
  });
  const parsedTagrefs = tagrefs
    .filter((a) => semver.valid(a.name, { loose: true }))
    .map((a) => semver.parse(a.name, { includePrerelease: true, loose: true }));

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
    outputTags.push(...expandPrefix(prefix, current.version));

    // return without additional output tags if we got an outdated build number
    const similarTags = tags.filter(
      (t) => t.prerelease.length && equalMajorMinorPatch(current, t),
    );
    if (similarTags.length && semver.compare(current, similarTags[0]) < 0) {
      return outputTags;
    }
  }

  outputTags.push(
    ...expandPrefix(prefix, `${current.major}.${current.minor}.${current.patch}`),
  );

  core.debug(semver.compare(current, tags[0]) >= 0);
  if (
    !tags.length ||
    semver.compare(current.toString().split("-")[0], tags[0]) >= 0
  ) {
    outputTags.push(
      ...expandPrefix(prefix, `${current.major}.${current.minor}`),
    );
    outputTags.push(...expandPrefix(prefix, `${current.major}`));
    outputTags.push(...expandPrefix(prefix, "latest"));
  } else if (
    semver.compare(current.toString().split("-")[0], majorTags[0]) >= 0
  ) {
    outputTags.push(
      ...expandPrefix(prefix, `${current.major}.${current.minor}`),
    );
    outputTags.push(...expandPrefix(prefix, `${current.major}`));
  } else if (
    semver.compare(current.toString().split("-")[0], minorTags[0]) >= 0
  ) {
    outputTags.push(
      ...expandPrefix(prefix, `${current.major}.${current.minor}`),
    );
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
    const defaultTag = core.getInput("defaultTag");
    const branchRegex = core.getInput("branchRegex");

    core.debug(JSON.stringify(github.context));
    const allTags = await calculateTags({
      token: githubToken,
      owner: github.context.payload.repository.owner.login,
      repo: github.context.payload.repository.name,
      ref: github.context.payload.ref,
      prefix: prefix,
      defaultTag: defaultTag,
      regexAllowed: branchRegex,
    });

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
