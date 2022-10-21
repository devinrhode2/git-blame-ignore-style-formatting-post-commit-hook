# Automatically git-blame-ignore style tweaks

[![.github/workflows/github-actions.yml](https://github.com/devinrhode2/git-blame-ignore-style-formatting-post-commit-hook/actions/workflows/github-actions.yml/badge.svg)](https://github.com/devinrhode2/git-blame-ignore-style-formatting-post-commit-hook/actions/workflows/github-actions.yml)

## A post-commit hook to add an entry to .git-blame-ignore-revs for pure formatting commits

Now you can upgrade to prettier v2 without ruining git blame!

PRs with changes to `.git-blame-ignore-revs` cannot squash+merge,
otherwise you'll have to add more entries to `.git-blame-ignore-revs` in a follow up PR/commit.

### What does it do, how does it work?

When you make a commit like this:

```
style(homepage): Sort imports
```

This post-commit hook will automatically add another commit like so:

```
chore(git-blame): Ignore previous style change
```

<sub>Commit message may be customized in a future version to be: `chore(git-blame): Ignore "Sort imports"`</sub>

You do NOT need to use commitlint or commitizen to use this hook.
It simply looks for commit messages starting with `style: foo`.
(And probably also `style(foo): bar`, but that may come in a future version)

## Setup

```
npm install git-blame-ignore-style-formatting-post-commit-hook --save-dev
```

```
yarn add git-blame-ignore-style-formatting-post-commit-hook --dev
```

If you are using husky (recommended), create hook like so:

```sh
mkdir .husky
mv .husky/post-commit .husky/old-post-commit;
rm .husky/post-commit
npx husky add .husky/post-commit 'GIT_ROOT="$(git rev-parse --show-toplevel)"';
npx husky add .husky/post-commit '$GIT_ROOT/node_modules/.bin/git-blame-ignore-style-formatting-post-commit-hook';
npx husky add .husky/post-commit '# Directly invoking module is faster than `yarn run git-blame-ignore-style-formatting-post-commit-hook`';
npx husky add .husky/post-commit "# (which makes sense, because it's skipping yarn\!)";
```

If not using husky, you can use this shell script as a starting point:

```sh
HOOKS_PATH=".git-hooks"
git config core.hooksPath $HOOKS_PATH
mkdir $HOOKS_PATH;
mv $HOOKS_PATH/post-commit $HOOKS_PATH/old-post-commit;
rm $HOOKS_PATH/post-commit
touch $HOOKS_PATH/post-commit;
chmod +x $HOOKS_PATH/post-commit;
echo '#!/usr/bin/env sh' >> $HOOKS_PATH/post-commit;
echo 'GIT_ROOT="$(git rev-parse --show-toplevel)"' >> $HOOKS_PATH/post-commit;
echo '' >> $HOOKS_PATH/post-commit;
echo '$GIT_ROOT/node_modules/.bin/git-blame-ignore-style-formatting-post-commit-hook' >> $HOOKS_PATH/post-commit;
echo '# Directly invoking module is faster than `yarn run git-blame-ignore-style-formatting-post-commit-hook`' >> $HOOKS_PATH/post-commit;
echo "# (which makes sense, because it's skipping yarn\!)" >> $HOOKS_PATH/post-commit;
```

If you don't already have a `.git-blame-ignore-revs`, one will be created for you before this script attempts to write to it:

```
Created empty .git-blame-ignore-revs file, and preinstall script to configure git to use it.
```

When you make a `style: ` commit, it will now show something like this after you commit:

```
Adding .git-blame-ignore-revs entry for last commit. Reason: Starts with "style:"
```

When/if you are rebasing, and need to refresh the sha, you can simply `reword` your `style: ` commits to re-run the `post-commit` hook

```diff
-pick 7713c93 style: cleanup comments
-pick c2d2cf6 chore(git-blame): Ignore previous style change
+reword 7713c93 style: cleanup comments
+drop c2d2cf6 chore(git-blame): Ignore previous style change
```
