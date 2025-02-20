# GitHub Action: Calculates all version tags to update

[![build-test](https://github.com/jupyterhub/action-major-minor-tag-calculator/workflows/build-test/badge.svg)](https://github.com/jupyterhub/action-major-minor-tag-calculator/actions)

This GitHub action can intelligently calculate and output a JSON formatted list of versions associated tags when a SemVer2 compliant tag is pushed go a GitHub repository.

This action can be useful if a git tag like `1.2.3` is pushed to a GitHub repo and you want a GitHub Workflow's job to not only take action with regards to the pushed tag `1.2.3` specifically, but also to related tags like `1.2`, `1`, and `latest` assuming the pushed tag's version is new enough to represent those more general tags.
This pattern is often used for tagging containers.

## Example output

The GitHub action's only output is named `tags` and is a JSON formatted list. See the example workflow below for details on how to convert the JSON formatted list to something else. Tags will always be in decreasing order of specificity.

| Pushed reference | GitHub repo tags | `tags` output                        | Comment                                                                       |
| ---------------- | ---------------- | ------------------------------------ | ----------------------------------------------------------------------------- |
|                  | ...              | `"[]"`                               | No git reference associated with the triggering workflow                      |
| `main`           | ...              | `"[main]"`                           | A branch reference get no associated version tags                             |
| `1.2.3`          | `1.2.0`          | `"[1.2.3, 1.2, 1, latest]"`          |                                                                               |
| `1.2.3`          | `1.2.0`, `2.0.0` | `"[1.2.3, 1.2, 1]"`                  |                                                                               |
| `1.2.3`          | `1.2.0`, `1.3.0` | `"[1.2.3, 1.2]"`                     |                                                                               |
| `1.2.3`          | `1.2.0`, `1.2.5` | `"[1.2.3]"`                          |                                                                               |
| `1.2.3-alpha.1`  | `1.2.0`          | `"[1.2.3-alpha.1]"`                  | A pre-release suffix on a version is treated like a branch                    |
| `1.2.3a1`        | `1.2.0`          | `"[1.2.3a1]"`                        | A pre-release suffix (loose parsing) on a version is treated like a branch    |
| `1.2.3-4`        | `1.2.0`, `1.2.3` | `"[1.2.3-4, 1.2.3, 1.2, 1, latest]"` | A build number suffix on a version is treated like the version but even newer |

## Recommended input parameters

By default this action works with Git tags. It will fetch tags from the current repository, and if this action is triggered by a tag push it will autodetect the current tag.

- `githubToken`: The GitHub token, required so this action can fetch tags using the GitHub API. If this parameter is not set then `defaultTag` (if set) or an empty list will be returned.

You can use this action with non-Git tags by explicitly providing the list of existing tags, and the current (new) tag.
In this case you should omit `githubToken` as no GitHub API calls are required.

- `existingTags`: List of existing tags as a JSON array, provide this if you aren't processing Git tags, e.g. `["1.2.3-0", "1.2.3-1"]`
- `currentTag`: The current (new) tag, provide this if you aren't processing Git tags, e.g. `"1.2.4-0"`

## Optional input parameters

- `prefix`: One or more whitespace or comma delimited prefixes for returned tags.

  As an example, prefix could be set to `ghcr.io/a/b: quay.io/a/b:` to provide
  image names with tags for two separate repositories.

  The string `""` can be used to represent an empty string, and all combinations
  of prefixes and suffixes are used.

- `suffix`: One or more whitespace or comma delimited suffixes for returned
  tags.

  As an example, suffix could be set to `"" -debian` to provide a default image
  variant without suffix next to an image variant referred to with a -debian
  suffix.

  The string `""` can be used to represent an empty string, and all combinations
  of prefixes and suffixes are used.

- `defaultTag`: If the tag output would be empty return this tag instead.
  This can be useful for running a workflow in pull requests where no suitable git references are present.
  `prefix` or `suffix` are _not_ automatically added.
- `branchRegex`: If a branch name does not match this regex return `defaultTag` or empty instead.

## Output parameters

- `tags`: A JSON formatted list of calculated tags.

## Example workflow

```yaml
name: Build and publish image to DockerHub

on:
  push:
    # Uncomment this if you also want a tag created for all pushed branches
    # branches:
    #   - "*"
    tags:
      - "*"

jobs:
  push-images-to-dockerhub:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # https://github.com/jupyterhub/action-major-minor-tag-calculator
      - name: Get all relevant tags
        id: gettags
        uses: jupyterhub/action-major-minor-tag-calculator@v3
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          prefix: "my-username/my-image-name:"
          branchRegex: "^[^/]+$"

      # https://github.com/docker/login-action
      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_ACCESS_TOKEN }}

      # https://github.com/docker/build-push-action
      - name: Build, tag, and push images
        uses: docker/build-push-action@v5
        with:
          push: true
          # The tags expression below could with a git reference triggering
          # this GitHub workflow evaluate to a string like:
          #
          # "my-username/my-image:1.2.3,my-username/my-image:1.2,my-username/my-image:1,my-username/my-image:latest"
          #
          tags: ${{ join(fromJson(steps.gettags.outputs.tags)) }}
```

## Developer notes

This project runs under multiple NodeJS versions, but if you are updating code you must use version 14.x. This is because the contents of the `dist/` folder are autogenerated in the packaging step but this depends on the NodeJS version, causing a failure of the CI job that verifies the generated code matches the source.

Install the dependencies:

```bash
$ npm install
```

Build the typescript, run the formatter and linter:

```bash
$ npm run build && npm run format && npm run lint
```

Package the code for distribution (uses [ncc](https://github.com/zeit/ncc)):

```bash
$ npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test
```

The tests use [nock](https://github.com/nock/nock) to mock GitHub API responses, no real requests are made so manual testing is still required.

Shortcut:

```bash
$ npm run all
```

Actions are run from GitHub repos so you must checkin the packed `dist` folder:

```bash
$ npm run all
$ git add dist
$ git commit
$ git push origin main
```
