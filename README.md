# Use CI Env on GitHub actions

Convenience action getting various CI related environment variables.

## Usage
```
name: build
on: push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - run: npm ci
    - uses: dtothefp/actions-ci-env@master
    # Use branch name for whatever purpose
    - run: echo ${BRANCH_NAME}
```
