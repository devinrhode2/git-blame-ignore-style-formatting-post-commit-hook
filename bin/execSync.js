const childProcess = require('child_process')

const execSync = (
  /** @type {string} */
  cmd,
) => {
  return childProcess.execSync(cmd, {
    encoding: 'utf-8',
  })
}

module.exports = { execSync }
