## v3

### v3.2.0 - 2024-02-28

([full changelog](https://github.com/jupyterhub/action-major-minor-tag-calculator/compare/v3.1.0...v3.2.0))

#### New features added

- Add suffix input and support empty strings in prefix/suffix [#333](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/333) ([@consideRatio](https://github.com/consideRatio), [@manics](https://github.com/manics))

#### Bugs fixed

- Default branchRegex input to a regex describing valid tags [#329](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/329) ([@consideRatio](https://github.com/consideRatio), [@manics](https://github.com/manics))

#### Contributors to this release

The following people contributed discussions, new ideas, code and documentation contributions, and review.
See [our definition of contributors](https://github-activity.readthedocs.io/en/latest/#how-does-this-tool-define-contributions-in-the-reports).

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2023-11-24&to=2024-02-28&type=c))

@consideRatio ([activity](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2023-11-24..2024-02-28&type=Issues)) | @manics ([activity](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Amanics+updated%3A2023-11-24..2024-02-28&type=Issues))

### v3.1.0 - 2023-11-24

([full changelog](https://github.com/jupyterhub/action-major-minor-tag-calculator/compare/v3.0.0...v3.1.0))

#### Enhancements made

- Allow prefix to be a whitespace/comma separated list of prefixes [#326](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/326) ([@consideRatio](https://github.com/consideRatio), [@manics](https://github.com/manics))

#### Contributors to this release

The following people contributed discussions, new ideas, code and documentation contributions, and review.
See [our definition of contributors](https://github-activity.readthedocs.io/en/latest/#how-does-this-tool-define-contributions-in-the-reports).

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2023-11-23&to=2023-11-24&type=c))

@consideRatio ([activity](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2023-11-23..2023-11-24&type=Issues)) | @manics ([activity](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Amanics+updated%3A2023-11-23..2023-11-24&type=Issues))

### v3.0.0 - 2023-11-23

([full changelog](https://github.com/jupyterhub/action-major-minor-tag-calculator/compare/v2.0.0...v3.0.0))

#### Breaking changes

This action now uses Node.js 20.

#### Maintenance and upkeep improvements

- Update all dependencies, move to Node 20 [#323](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/323) ([@manics](https://github.com/manics))
- Stop bumping dev deps and group production PRs [#317](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/317) ([@consideRatio](https://github.com/consideRatio))
- dependabot: monthly updates of github actions and npm deps [#294](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/294) ([@consideRatio](https://github.com/consideRatio))
- update dependencies [#285](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/285) ([@minrk](https://github.com/minrk))
- ci: use v1,v2,etc tags instead of branches for dependabot bumping compatibility [#213](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/213) ([@consideRatio](https://github.com/consideRatio))
- Remove deprecated `GITHUB_TOKEN` [#140](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/140) ([@manics](https://github.com/manics))

#### Dependabot updates

https://github.com/jupyterhub/action-major-minor-tag-calculator/pulls?q=is%3Apr+merged%3A2021-10-25..2023-11-20+author%3Aapp%2Fdependabot

#### Contributors to this release

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2021-10-25&to=2023-11-19&type=c))

[@consideRatio](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2021-10-25..2023-11-19&type=Issues) | [@dependabot](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Adependabot+updated%3A2021-10-25..2023-11-19&type=Issues) | [@manics](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Amanics+updated%3A2021-10-25..2023-11-19&type=Issues) | [@minrk](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Aminrk+updated%3A2021-10-25..2023-11-19&type=Issues)

## v2

### v2.0.0 - 2021-09-26

#### Breaking changes

This release changes the behavior to parse versions less strictly. In practice,
this makes the action accept the version `2.0.0b1` as a pre-release where it
previously would error and declare it as an invalid SemVer2 version.

- use loose semver parsing to accept more prerelease formats [#125](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/125) ([@minrk](https://github.com/minrk))

#### Other merged PRs

- Bump ansi-regex from 5.0.0 to 5.0.1 [#126](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/126) ([@dependabot](https://github.com/dependabot))
- Bump prettier from 2.4.0 to 2.4.1 [#124](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/124) ([@dependabot](https://github.com/dependabot))
- Bump eslint-plugin-jest from 24.4.0 to 24.4.2 [#123](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/123) ([@dependabot](https://github.com/dependabot))
- Bump @vercel/ncc from 0.31.0 to 0.31.1 [#122](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/122) ([@dependabot](https://github.com/dependabot))
- Bump prettier from 2.3.2 to 2.4.0 [#121](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/121) ([@dependabot](https://github.com/dependabot))
- Bump jest from 27.1.0 to 27.2.0 [#120](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/120) ([@dependabot](https://github.com/dependabot))
- Bump @vercel/ncc from 0.30.0 to 0.31.0 [#119](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/119) ([@dependabot](https://github.com/dependabot))
- Bump stefanzweifel/git-auto-commit-action from 4.11.0 to 4.12.0 [#118](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/118) ([@dependabot](https://github.com/dependabot))
- Bump nock from 13.1.2 to 13.1.3 [#117](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/117) ([@dependabot](https://github.com/dependabot))
- Bump jest from 27.0.6 to 27.1.0 [#116](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/116) ([@dependabot](https://github.com/dependabot))
- Bump @vercel/ncc from 0.29.2 to 0.30.0 [#115](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/115) ([@dependabot](https://github.com/dependabot))
- Bump @vercel/ncc from 0.29.1 to 0.29.2 [#114](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/114) ([@dependabot](https://github.com/dependabot))
- Bump @actions/core from 1.2.6 to 1.5.0 [#113](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/113) ([@dependabot](https://github.com/dependabot))
- Bump nock from 13.1.1 to 13.1.2 [#112](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/112) ([@dependabot](https://github.com/dependabot))
- Bump @vercel/ncc from 0.29.0 to 0.29.1 [#111](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/111) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.31.0 to 7.32.0 [#110](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/110) ([@dependabot](https://github.com/dependabot))
- Bump eslint-plugin-jest from 24.3.6 to 24.4.0 [#109](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/109) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.30.0 to 7.31.0 [#108](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/108) ([@dependabot](https://github.com/dependabot))
- Bump @vercel/ncc from 0.27.0 to 0.29.0 [#107](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/107) ([@dependabot](https://github.com/dependabot))
- Bump jest from 27.0.5 to 27.0.6 [#106](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/106) ([@dependabot](https://github.com/dependabot))
- Bump nock from 13.1.0 to 13.1.1 [#105](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/105) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.29.0 to 7.30.0 [#104](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/104) ([@dependabot](https://github.com/dependabot))
- Bump jest from 27.0.4 to 27.0.5 [#103](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/103) ([@dependabot](https://github.com/dependabot))
- Bump prettier from 2.3.1 to 2.3.2 [#102](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/102) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.28.0 to 7.29.0 [#101](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/101) ([@dependabot](https://github.com/dependabot))
- Bump jest from 27.0.3 to 27.0.4 [#100](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/100) ([@dependabot](https://github.com/dependabot))
- Bump glob-parent from 5.1.1 to 5.1.2 [#98](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/98) ([@dependabot](https://github.com/dependabot))
- Bump prettier from 2.3.0 to 2.3.1 [#97](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/97) ([@dependabot](https://github.com/dependabot))
- Bump nock from 13.0.11 to 13.1.0 [#96](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/96) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.27.0 to 7.28.0 [#95](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/95) ([@dependabot](https://github.com/dependabot))
- Bump Actions-R-Us/actions-tagger from 95c51c646e75db5c6b7d447e3087bcee58677341 to 2.0.2 [#69](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/69) ([@dependabot](https://github.com/dependabot))
- Bump semver from 7.3.4 to 7.3.5 [#52](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/52) ([@dependabot](https://github.com/dependabot))

#### Contributors to this release

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2021-06-04&to=2021-09-26&type=c))

[@consideRatio](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2021-06-04..2021-09-26&type=Issues) | [@manics](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Amanics+updated%3A2021-06-04..2021-09-26&type=Issues) | [@minrk](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Aminrk+updated%3A2021-06-04..2021-09-26&type=Issues)

## v1

### v1.2.0 - 2021-06-04

([full changelog](https://github.com/jupyterhub/action-major-minor-tag-calculator/compare/v1.1.1...v1.2.0))

#### Enhancements made

- Add branchRegex for validating/excluding branch names [#89](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/89) ([@manics](https://github.com/manics))

#### Maintenance and upkeep improvements

- Used named parameters for calculateTags [#94](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/94) ([@manics](https://github.com/manics))

#### Other merged PRs

- Bump jest from 26.6.3 to 27.0.3 [#92](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/92) ([@dependabot](https://github.com/dependabot))
- Bump ws from 7.4.0 to 7.4.6 [#90](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/90) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.26.0 to 7.27.0 [#88](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/88) ([@dependabot](https://github.com/dependabot))
- Explicitly use Ubuntu 20.04 and NodeJS 14 [#86](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/86) ([@manics](https://github.com/manics))
- Bump @actions/github from 4.0.0 to 5.0.0 [#85](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/85) ([@dependabot](https://github.com/dependabot))
- Bump hosted-git-info from 2.8.8 to 2.8.9 [#84](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/84) ([@dependabot](https://github.com/dependabot))
- Bump lodash from 4.17.20 to 4.17.21 [#83](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/83) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.25.0 to 7.26.0 [#82](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/82) ([@dependabot](https://github.com/dependabot))
- Bump prettier from 2.2.1 to 2.3.0 [#81](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/81) ([@dependabot](https://github.com/dependabot))
- Bump stefanzweifel/git-auto-commit-action from be7095c202abcf573b09f20541e0ee2f6a3a9d9b to 4.11.0 [#80](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/80) ([@dependabot](https://github.com/dependabot))
- Bump eslint from 7.24.0 to 7.25.0 [#77](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/77) ([@dependabot](https://github.com/dependabot))
- Bump eslint-plugin-jest from 24.3.5 to 24.3.6 [#76](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/76) ([@dependabot](https://github.com/dependabot))
- Set permissions.contents=write in workflows [#75](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/75) ([@manics](https://github.com/manics))

#### Contributors to this release

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2021-04-19&to=2021-06-04&type=c))

[@consideRatio](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2021-04-19..2021-06-04&type=Issues) | [@dependabot](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Adependabot+updated%3A2021-04-19..2021-06-04&type=Issues) | [@manics](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Amanics+updated%3A2021-04-19..2021-06-04&type=Issues)

### v1.1.1 - 2021-04-19

#### Bugs fixed

- exclude invalid versions from existing tags [#73](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/73) ([@minrk](https://github.com/minrk))

#### Documentation improvements

- Documentation tweaks to action.yml / README.md pre-publishing [#68](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/68) ([@consideRatio](https://github.com/consideRatio))

#### Contributors to this release

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2021-04-15&to=2021-04-19&type=c))

[@consideRatio](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2021-04-15..2021-04-19&type=Issues) | [@minrk](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Aminrk+updated%3A2021-04-15..2021-04-19&type=Issues)

### v1.1.0 - 2021-04-15

([full changelog](https://github.com/jupyterhub/action-major-minor-tag-calculator/compare/v1.0.0...81e90594b90bef0bc68479d0ab3aae33a940526e))

#### New features added

- If no github ref is found optionally return a default tag [#66](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/66) ([@manics](https://github.com/manics))

#### Bugs fixed

- Pre-release handling [#64](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/64) ([@jburel](https://github.com/jburel))
- Handle empty ref [#38](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/38) ([@manics](https://github.com/manics))

#### Maintenance and upkeep improvements

- Update License from boilerplate entry to JupyterHub [#63](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/63) ([@consideRatio](https://github.com/consideRatio))

#### Documentation improvements

- Update README to assume a less introduced reader [#65](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/65) ([@consideRatio](https://github.com/consideRatio))

#### Continuous integration improvements

- ci: add automation to update release branches on GitHub releases [#62](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/62) ([@consideRatio](https://github.com/consideRatio))

#### Contributors to this release

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2021-02-10&to=2021-04-15&type=c))

[@consideRatio](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2021-02-10..2021-04-15&type=Issues) | [@dependabot](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Adependabot+updated%3A2021-02-10..2021-04-15&type=Issues) | [@jburel](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Ajburel+updated%3A2021-02-10..2021-04-15&type=Issues) | [@manics](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Amanics+updated%3A2021-02-10..2021-04-15&type=Issues)
