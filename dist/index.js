module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(104);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 104:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);
const ciEnv = __webpack_require__(149);

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
    Object.keys(envKeys).forEach((key) => {
      const envKey = envKeys[key];
      const value = ciEnv[key];

      if (!process.env[envKey] && value) {
        core.debug(`${envKey} = '${value}'`);
        core.exportVariable(envKey, value);
      }
    });
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run();


/***/ }),

/***/ 149:
/***/ (function(module, __unusedexports, __webpack_require__) {

let drone = __webpack_require__(561)
// platform denotes code hosting provider i.e github, gitlab, bitbucket etc.
// Had to introduce this variable as there are cases when CI is run on the same platform where code is hosted as those cases need to be handled differently.
// Default value is github
let platform = 'github';
let repo, sha, event, commit_message, pull_request_number, branch, ci, jobUrl, buildUrl

if (process.env.TRAVIS) {
  // Reference: https://docs.travis-ci.com/user/environment-variables

  repo = process.env.TRAVIS_REPO_SLUG
  sha = process.env.TRAVIS_PULL_REQUEST_SHA || process.env.TRAVIS_COMMIT
  event = process.env.TRAVIS_EVENT_TYPE
  commit_message = process.env.TRAVIS_COMMIT_MESSAGE
  pull_request_number = process.env.TRAVIS_PULL_REQUEST
  jobUrl = `https://travis-ci.org/${repo}/jobs/${process.env.TRAVIS_JOB_ID}`
  buildUrl = `https://travis-ci.org/${repo}/builds/${process.env.TRAVIS_JOB_ID}`

  branch =
    process.env.TRAVIS_EVENT_TYPE === 'push'
      ? process.env.TRAVIS_BRANCH
      : process.env.TRAVIS_PULL_REQUEST_BRANCH

  ci = 'travis'
} else if (process.env.CIRCLECI) {
  // Reference: https://circleci.com/docs/1.0/environment-variables

  repo = process.env.CIRCLE_PROJECT_USERNAME + '/' + process.env.CIRCLE_PROJECT_REPONAME

  sha = process.env.CIRCLE_SHA1
  event = 'push'
  commit_message = '' // circle does not expose commit message
  if (process.env.CI_PULL_REQUEST) {
    pull_request_number = process.env.CI_PULL_REQUEST.split('/').pop() // take number from returns url
    event = 'pull_request'
  } else pull_request_number = ''
  branch = process.env.CIRCLE_BRANCH
  ci = 'circle'
} else if (process.env.WERCKER) {
  // Reference: https://devcenter.wercker.com/docs/environment-variables/available-env-vars

  repo = process.env.WERCKER_GIT_OWNER + '/' + process.env.WERCKER_GIT_REPOSITORY

  sha = process.env.WERCKER_GIT_COMMIT
  event = 'push'
  commit_message = '' // wercker does not expose commit message
  pull_request_number = '' // wercker does not expose pull request number
  branch = process.env.WERCKER_GIT_BRANCH
  ci = 'wercker'
} else if (process.env.DRONE) {
  // Reference: http://readme.drone.io/usage/environment-reference

  repo = process.env.DRONE_REPO || process.env.CI_REPO || drone.getLegacyRepo(process.env)
  sha = process.env.DRONE_COMMIT || process.env.CI_COMMIT
  // DRONE_BUILD_EVENT available in drone > v0.5
  // DRONE_EVENT, CI_EVENT available in drone < v0.5
  // no EVENT available in drone < v0.4
  event = process.env.DRONE_BUILD_EVENT || process.env.DRONE_EVENT || process.env.CI_EVENT || 'push'
  commit_message = '' // drone does not expose commit message
  pull_request_number = process.env.DRONE_PULL_REQUEST
  branch = process.env.DRONE_BRANCH || process.env.CI_BRANCH
  ci = 'drone'
} else if (process.env.GITLAB_CI){
  // Reference: https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
  // except buildUrl we get all the other variables for gitlab CI
  repo = process.env.CI_PROJECT_PATH
  branch = process.env.CI_COMMIT_REF_NAME
  commit_message = process.env.CI_COMMIT_MESSAGE
  pull_request_number = (process.env.CI_MERGE_REQUEST_ID || '') // no pull request numnber in case the CI is run for the branch without a pull request
  sha=process.env.CI_COMMIT_SHA
  event = process.env.CI_PIPELINE_SOURCE
  jobUrl = process.env.CI_JOB_URL
  platform = 'gitlab'
  ci = 'gitlab'
} else if (process.env.CI_NAME === 'codeship') {
  // Reference: https://documentation.codeship.com/basic/builds-and-configuration/set-environment-variables/#default-environment-variables

  repo = process.env.CI_REPO_NAME
  branch = process.env.CI_BRANCH
  commit_message = process.env.CI_COMMIT_MESSAGE || process.env.CI_MESSAGE

  event = 'push'
  pull_request_number = process.env.CI_PR_NUMBER
  sha=process.env.CI_COMMIT_ID,
  buildUrl=process.env.CI_BUILD_URL

  ci = 'codeship'
} else if (process.env.GITHUB_ACTION) {
  // GitHub Actions
  // Reference: https://developer.github.com/actions/creating-github-actions/accessing-the-runtime-environment/
  
  // for pull_request event, GITHUB_REF is of the form refs/pull/<pull_request_number>/merge
  // for push event, GITHUB_REF is of the form refs/heads/<branch>
  
  const pull_request_numberORbranch=process.env.GITHUB_REF.split('/')[2];

  repo = process.env.GITHUB_REPOSITORY
  sha = process.env.GITHUB_SHA
  event = process.env.GITHUB_EVENT_NAME
  commit_message = ''
  pull_request_number = event==='pull_request'? pull_request_numberORbranch:''
  // GITHUB_HEAD_REF for pull requests. For commits, GITHUB_REF is of the form refs/heads/master, for example
  branch = event ==='pull_request'? process.env.GITHUB_HEAD_REF : pull_request_numberORbranch
  ci = 'github_actions'
} else if (process.env.NETLIFY) {
  // Reference: https://www.netlify.com/docs/continuous-deployment/#environment-variables
  repo = process.env.REPOSITORY_URL.split('@github.com/').pop()
  event = process.env.PULL_REQUEST?'pull_request':'push'
  pull_request_number = process.env.PULL_REQUEST?process.env.REVIEW_ID:''
  sha = process.env.COMMIT_REF
  branch = process.env.HEAD
  ci = 'netlify'
} else if (process.env.NOW_GITHUB_ORG) {
  // Reference: https://zeit.co/docs/v2/advanced/now-for-github/
  repo = process.env.NOW_GITHUB_ORG + '/' + process.env.NOW_GITHUB_REPO
  event = 'push'
  pull_request_number = ''
  sha = process.env.NOW_GITHUB_COMMIT_SHA
  branch = process.env.NOW_GITHUB_COMMIT_REF
  ci = 'now'
} else if (process.env.CI) {
  // Generic variables for docker images, custom CI builds, etc.

  repo = process.env.CI_REPO_OWNER + '/' + process.env.CI_REPO_NAME

  sha = process.env.CI_COMMIT_SHA
  event = process.env.CI_EVENT || 'push'
  commit_message = process.env.CI_COMMIT_MESSAGE
  pull_request_number = process.env.CI_MERGE_REQUEST_ID
  branch = process.env.CI_BRANCH
  ci = 'custom'
}

module.exports = { repo, sha, event, commit_message, branch, pull_request_number, ci, platform, jobUrl, buildUrl }


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return (s || '')
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable
 */
function exportVariable(name, val) {
    process.env[name] = val;
    command_1.issueCommand('set-env', { name }, val);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store
 */
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message
 */
function error(message) {
    command_1.issue('error', message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message
 */
function warning(message) {
    command_1.issue('warning', message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store
 */
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 561:
/***/ (function(module) {

/**
 * Parses a git URL, extracting the org and repo name.
 * 
 * Older versions of drone (< v4.0) do not export `DRONE_REPO` or `CI_REPO`.
 * They do export `DRONE_REMOTE` and / or `CI_REMOTE` with the git URL.
 * 
 * e.g., `DRONE_REMOTE=git://github.com/siddharthkp/ci-env.git`
 * 
 * @param {Object} env object in shape of `process.env`
 * @param {String} env.DRONE_REMOTE git URL of remote repository
 * @param {String} env.CI_REMOTE git URL of remote repository
 * @returns {String} org/repo (without .git extension)
 */
function getLegacyRepo(env) {
  // default to process.env if no argument provided
  if (!env) { env = process.env }

  // bail if neither variable exists
  let remote = env.DRONE_REMOTE || env.CI_REMOTE
  if (!remote) { return '' }

  // parse out the org and repo name from the git URL
  let parts = remote.split('/').slice(-2)
  let org = parts[0]
  let reponame = parts[1].replace(/\.git$/, '')
  let repo = '' + org + '/' + reponame
  return repo
}

module.exports.getLegacyRepo = getLegacyRepo;

/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ })

/******/ });