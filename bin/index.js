const fs = require('fs')
const {
  containsGitBlameIgnoreFlag,
} = require('./containsGitBlameIgnoreFlag')
const {
  execSync,
} = require('./execSync')

// Grab last commit message
const lastCommitMsg = execSync(
  'git log -1 --pretty=%B HEAD',
)

const { isStyleCommit, reasonMessage } =
  containsGitBlameIgnoreFlag(
    lastCommitMsg,
  )

if (isStyleCommit) {
  // Possible improvement:
  // - Read `git config blame.ignoreRevsFile`
  // - Don't hard-code to `.git-blame-ignore-revs`
  // - However, github has already hard-coded to `.git-blame-ignore-revs`,
  //   See: https://github.blog/changelog/2022-03-24-ignore-commits-in-the-blame-view-beta/
  // (Apologies Jamie buildsghost, wish github would have chose the much nicer `.gitblameignore` file name)
  if (
    !fs.existsSync(
      '.git-blame-ignore-revs',
    )
  ) {
    // If not, run, set it up.
    execSync(
      'touch .git-blame-ignore-revs',
    )
    fs.appendFileSync(
      '.git-blame-ignore-revs',
      [
        '# Since version 2.23 (August 2019), git-blame has a feature',
        '# to ignore or bypass certain commits.',
        '#',
        '# This file contains a list of commits that are not likely what you',
        '# are looking for in a blame, such as mass reformatting or renaming.',
        '#',
        "# These settings only apply once you've run an install once.",
        '',
        '',
      ].join('\n'),
    )
    const setupGitBlameIgnoreRevsCmd = [
      'git config --local blame.ignoreRevsFile .git-blame-ignore-revs || ',
      "echo 'not a git repo, skipping git blame config'",
    ].join('')
    execSync(
      `npm pkg set scripts.preinstall="${setupGitBlameIgnoreRevsCmd}"; git add package.json`,
    )
    // console.warn("Don't forget to create a process to run `git blame --ignore-revs-file .git-blame-ignore-revs`, likely in a pre-install hook.");
    console.log(
      'Created empty .git-blame-ignore-revs file, and preinstall script to configure git to use it.',
    )
  }

  // Append a comment above this commit sha??
  const shortCommitMsg = execSync(
    'git log -1 --pretty=format:%s',
  )

  const lastCommitSha = execSync(
    'git rev-parse --verify HEAD',
  )

  console.log(
    'Adding .git-blame-ignore-revs entry for last commit. Reason:',
    reasonMessage,
  )

  fs.appendFileSync(
    '.git-blame-ignore-revs',
    `# ${shortCommitMsg}\n`, // May be like "Sort imports" or "style: Sort Imports".
  )
  fs.appendFileSync(
    '.git-blame-ignore-revs',
    `${lastCommitSha}\n`,
  )

  execSync(
    [
      'git add .git-blame-ignore-revs && ',
      'git commit -m "chore(git-blame): Ignore previous style change" --no-verify',
    ].join(''),
  )
}
