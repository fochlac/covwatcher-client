# covwatcher-client

[![codecov](https://codecov.io/gh/fochlac/covwatcher-client/branch/master/graph/badge.svg)](https://codecov.io/gh/fochlac/covwatcher-client) [![CircleCI](https://circleci.com/gh/fochlac/covwatcher-client.svg?style=svg)](https://circleci.com/gh/fochlac/covwatcher-client) [![npm](https://img.shields.io/npm/v/covwatcher-client.svg?style=svg)](https://www.npmjs.com/package/covwatcher-client)

Client module for [Covwatcher](https://github.com/fochlac/covwatcher)

-   [Installation](#installation)
-   [Documentation](#documentation)
-   [Changelog](#changelog)
-   [License](#license)

## Installation

Install the client in your target repo

```
npm install covwatcher-client
```

## Documentation

The client is available as executeable `covwatcher` and can upload reports via commandline parameters or environment variables:

| shorthand | long version | description                                           |    environment variable | required |
| :-------: | :----------: | :---------------------------------------------------- | ----------------------: | :------: |
|    -n     |    --name    | name of the branch or if this is a pullrequest its id |  COVWATCHER_BRANCH_NAME |    \*    |
|    -t     |   --target   | branchtype, can be "branch" or "pullrequest"          |  COVWATCHER_BRANCH_TYPE |    \*    |
|    -y     |    --type    | repository type, can be "users" or "project"          |    COVWATCHER_REPO_TYPE |    \*    |
|    -p     |  --project   | name of the project or user the repository is part of | COVWATCHER_REPO_PROJECT |    \*    |
|    -r     |    --repo    | name of the repository                                |         COVWATCHER_REPO |    \*    |
|    -s     |   --server   | full url to the server running covwatcher             |       COVWATCHER_SERVER |    \*    |
|    -d     | --directory  | full path to the coverage report                      |       COVWATCHER_REPORT |          |
|    -a     |    --task    | wether to create a task if the diff coverage is low   |                         |          |
|    -l     |    --lcov    | full url to the server hosting the lcov report        |                         |          |
|    -b     |    --bail    | whether to return nonnull status on failure           |                         |          |
|    -h     |    --help    | usage information                                     |                         |          |

The command `covwatcher -n "master" -t "branch" -y "users" -p "Fochlac" -r "covwatcher" -s "http://covwatcher.fochlac.com"` will start a search for the closest coverage file and upload it to the specified server. The search will start from the location of this package, so it should always be installed in the specific repository you want searched or you should provide the full path to the report via the `-d` option.

## Changelog

## License

[ISC License](License.md)
