const containsGitBlameIgnoreFlag = (
  /** @type {string} */
  commitMsg,
) => {
  const globalFlag = '#GIT_BLAME_IGNORE'
  if (commitMsg.includes(globalFlag)) {
    return {
      isStyleCommit: true,
      reasonMessage: `Contains "${globalFlag}"`,
    }
  }

  const prefixes = [
    'style',
    'formatting',
    'format',
    'fmt',
  ]

  for (const prefix of prefixes) {
    if (
      commitMsg.startsWith(
        `${prefix}: `,
      )
    ) {
      return {
        isStyleCommit: true,
        reasonMessage: `Starts with "${prefix}:"`,
      }
    }
  }

  const regexPrefixes = [
    /style\(a-zA-Z\-\_0-9\)\:\ /g,
    /formatting\(a-zA-Z\-\_0-9\)\:\ /g,
    /format\(a-zA-Z\-\_0-9\)\:\ /g,
    /fmt\(a-zA-Z\-\_0-9\)\:\ /g,
  ]

  for (const regexPrefix of regexPrefixes) {
    if (regexPrefix.test(commitMsg)) {
      return {
        isStyleCommit: true,
        reasonMessage: `Starts with "${regexPrefix}"`,
      }
    }
  }

  return {
    isStyleCommit: false,
    reasonMessage: 'No match',
  }
}

module.exports = {
  containsGitBlameIgnoreFlag,
}
