const core = require('@actions/core');
const ciEnv = require('ci-env');

async function run() {
  const envKeys = {
    repo: 'REPO',
    sha: 'SHA',
    event: 'EVENT',
    commit_message: 'COMMIT_MESSAGE',
    branch: 'BRANCH_NAME',
    pull_request_number: 'PULL_REQUEST_NUMBER',
    ci: 'CI',
    platform: 'PLATFORM',
    jobUrl: 'JOB_URL',
    buildUrl: 'BUILD_URL',
  };

  try {
    Object.keys.envKeys.forEach((key) => {
      const envKey = envKeys[key];
      const value = ciEnv[key];

      core.debug(`${envKey} = '${value}'`)
      core.exportVariable(envKey, value);
    });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();
