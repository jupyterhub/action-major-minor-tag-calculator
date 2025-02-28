// https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
"use strict";

const core = require("@actions/core");
const github = require("@actions/github");
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

function expandPrefixSuffix(prefix, suffix, tag) {
  // Adds all combinations of prefixes and suffixes to a tag, where
  // prefix/suffix could be a single prefix/suffix or a comma/whitespace
  // separated list of prefixes/suffixes. If "" is observed, its
  // replaced with an empty string.
  let prefixes = [...new Set(prefix.split(/[\s,]/).filter(Boolean))];
  let suffixes = [...new Set(suffix.split(/[\s,]/).filter(Boolean))];
  prefixes = prefixes.map((p) => p.replaceAll(/""/g, ""));
  suffixes = suffixes.map((p) => p.replaceAll(/""/g, ""));

  // the combination logic requires at least one element in each list
  if (prefixes.length == 0) {
    prefixes.push("");
  }
  if (suffixes.length == 0) {
    suffixes.push("");
  }
  return prefixes.flatMap((p) => suffixes.map((s) => `${p}${tag}${s}`));
}

async function calculateTags({
  token,
  owner,
  repo,
  ref,
  prefix = "",
  suffix = "",
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

  const r = { tags: [], newTag: null, existingTags: null };

  if (!ref) {
    core.debug("No ref");
    if (defaultTag) {
      return { ...r, tags: [defaultTag] };
    }
    return r;
  }
  if (ref.startsWith("refs/heads/")) {
    const branch = ref.substring(11);
    core.debug(`Branch: ${branch}`);
    if (!checkAgainstRegex(branch, regexAllowed)) {
      if (defaultTag) {
        return { ...r, tags: [defaultTag] };
      }
      return r;
    }
    const tags = expandPrefixSuffix(prefix, suffix, branch);
    return { ...r, tags };
  }
  if (!ref.startsWith("refs/tags/")) {
    throw new Error(`Not a tag or branch: ${ref}`);
  }

  const newTag = ref.substring(10);
  core.debug(`newTag: ${newTag}`);
  if (!semver.valid(newTag, { loose: true })) {
    throw new Error(`Invalid semver tag: ${newTag}`);
  }

  const octokit = github.getOctokit(token);
  const tagrefs = await octokit.paginate(octokit.rest.repos.listTags, {
    owner: owner,
    repo: repo,
  });
  const existingTags = tagrefs.map((a) => a.name);
  const outputTags = await calculateTagsFromList({
    newTag,
    existingTags,
    prefix,
    suffix,
  });
  return { tags: outputTags, newTag, existingTags };
}

async function calculateTagsFromList({
  newTag,
  existingTags,
  prefix = "",
  suffix = "",
}) {
  const current = semver.parse(newTag, {
    includePrerelease: true,
    loose: true,
  });
  if (!supportedPrerelease(current.prerelease)) {
    core.warning(`Tag prerelease ${newTag} is not supported`);
    return expandPrefixSuffix(prefix, suffix, newTag);
  }

  const parsedTagrefs = existingTags
    .filter((a) => semver.valid(a, { loose: true }))
    .map((a) => semver.parse(a, { includePrerelease: true, loose: true }));

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
    outputTags.push(...expandPrefixSuffix(prefix, suffix, current.version));

    // return without additional output tags if we got an outdated build number
    const similarTags = tags.filter(
      (t) => t.prerelease.length && equalMajorMinorPatch(current, t),
    );
    if (similarTags.length && semver.compare(current, similarTags[0]) < 0) {
      return outputTags;
    }
  }

  outputTags.push(
    ...expandPrefixSuffix(
      prefix,
      suffix,
      `${current.major}.${current.minor}.${current.patch}`,
    ),
  );

  if (
    !tags.length ||
    semver.compare(current.toString().split("-")[0], tags[0]) >= 0
  ) {
    outputTags.push(
      ...expandPrefixSuffix(
        prefix,
        suffix,
        `${current.major}.${current.minor}`,
      ),
    );
    outputTags.push(...expandPrefixSuffix(prefix, suffix, `${current.major}`));
    outputTags.push(...expandPrefixSuffix(prefix, suffix, "latest"));
  } else if (
    !majorTags.length ||
    semver.compare(current.toString().split("-")[0], majorTags[0]) >= 0
  ) {
    outputTags.push(
      ...expandPrefixSuffix(
        prefix,
        suffix,
        `${current.major}.${current.minor}`,
      ),
    );
    outputTags.push(...expandPrefixSuffix(prefix, suffix, `${current.major}`));
  } else if (
    !minorTags.length ||
    semver.compare(current.toString().split("-")[0], minorTags[0]) >= 0
  ) {
    outputTags.push(
      ...expandPrefixSuffix(
        prefix,
        suffix,
        `${current.major}.${current.minor}`,
      ),
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
    const existingTagsInput = core.getInput("existingTags");
    const newTagInput = core.getInput("newTag");
    const prefix = core.getInput("prefix");
    const suffix = core.getInput("suffix");
    const defaultTag = core.getInput("defaultTag");
    const branchRegex = core.getInput("branchRegex");

    core.debug(JSON.stringify(github.context));

    if (
      (existingTagsInput && !newTagInput) ||
      (!existingTagsInput && newTagInput)
    ) {
      throw new Error("existingTags and newTag must be provided together");
    }

    let allTags, existingTags, newTag;
    if (existingTagsInput && newTagInput) {
      existingTags = JSON.parse(existingTagsInput);
      newTag = newTagInput;
      allTags = await calculateTagsFromList({
        newTag: newTag,
        // existingTags can be the empty list
        existingTags: existingTags,
        prefix: prefix,
        suffix: suffix,
      });
    } else {
      ({
        tags: allTags,
        newTag,
        existingTags,
      } = await calculateTags({
        token: githubToken,
        owner: github.context.payload.repository.owner.login,
        repo: github.context.payload.repository.name,
        ref: github.context.payload.ref,
        prefix: prefix,
        suffix: suffix,
        defaultTag: defaultTag,
        regexAllowed: branchRegex,
      }));
    }

    core.info(allTags);
    core.setOutput("tags", allTags);
    core.setOutput("newTag", newTag);
    core.setOutput("existingTags", existingTags);
  } catch (error) {
    core.setFailed(error.message);
  }
}

// Don't run when imported as module
if (!module.parent) {
  run();
}

exports.calculateTags = calculateTags;
exports.calculateTagsFromList = calculateTagsFromList;
// run is exported so it can be tested
exports.testExports = { run };
