# major-minor-tag-calculator GitHub Action

[![build-test](https://github.com/manics/action-major-minor-tag-calculator/workflows/build-test/badge.svg)](https://github.com/manics/action-major-minor-tag-calculator/actions)

Calculate major and minor semver tags, e.g. for tagging containers.

This will calculate major and minor prefix tags for when you want to provide users with a way to obtain the latest `major` or `major.minor` version.

Suffixes of the form `-[0-9]+` are supported since this is often used as a build number.
Any other suffixes are treated as a pre-release, and are not supported.

## Examples

Current and latest tag: `1.2.3`, returned tags: `[1.2.3, 1.2.0, 1.0.0, latest]`.

Current tag `1.2.3` but the repository already contains a more recent tag `2.0.0`: return only `[1.2.3]`.

## Required input parameters

- `githubToken`: The GitHub token, required so this action can fetch tags using the GitHub API.

## Optional parameters

- `prefix`: A string that each returned tag should be prefixed with, for example to tag a Docker container set this to `user/repository:`.

## Example

```yaml
name: Docker build

on:
  push:
    tags:
      - "*"

jobs:
  docker:
    runs-on: ubuntu-18.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      # https://github.com/manics/action-major-minor-tag-calculator-test
      - name: Get other tags
        id: gettags
        uses: manics/action-major-minor-tag-calculator@main
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          prefix: "manics/action-major-minor-tag-calculator-test:"

      # https://github.com/docker/build-push-action

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build Docker image
        uses: docker/build-push-action@v2
        with:
          tags: ${{ join(fromJson(steps.gettags.outputs.tags)) }}
          push: true
```

## Developer notes

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
