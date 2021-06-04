# v1.2.0

([full changelog](https://github.com/jupyterhub/action-major-minor-tag-calculator/compare/v1.1.1...v1.2.0))

## Enhancements made

- Add branchRegex for validating/excluding branch names [#89](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/89) ([@manics](https://github.com/manics))

## Maintenance and upkeep improvements

- Used named parameters for calculateTags [#94](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/94) ([@manics](https://github.com/manics))

## Other merged PRs

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

## Contributors to this release

([GitHub contributors page for this release](https://github.com/jupyterhub/action-major-minor-tag-calculator/graphs/contributors?from=2021-04-19&to=2021-06-04&type=c))

[@consideRatio](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3AconsideRatio+updated%3A2021-04-19..2021-06-04&type=Issues) | [@dependabot](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Adependabot+updated%3A2021-04-19..2021-06-04&type=Issues) | [@manics](https://github.com/search?q=repo%3Ajupyterhub%2Faction-major-minor-tag-calculator+involves%3Amanics+updated%3A2021-04-19..2021-06-04&type=Issues)

### v1.1.1

## Bugs fixed

- exclude invalid versions from existing tags [#73](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/73) ([@minrk](https://github.com/minrk))

## Documentation improvements

- Documentation tweaks to action.yml / README.md pre-publishing [#68](https://github.com/jupyterhub/action-major-minor-tag-calculator/pull/68) ([@consideRatio](https://github.com/consideRatio))

## Contributors to this release

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
