// Type-check prettier config:
/** @type {import("prettier").Config} */
const conf = {
  semi: false,
  singleQuote: true,
  printWidth: 40,

  // TODO: explicitly specify all prettier config options here
  // This means no matter how prettier runs on this project,
  // the settings will be correct.

  // Avoid even more merge conflicts: https://prettier.io/blog/2020/03/21/2.0.0.html#change-default-value-for-trailingcomma-to-es5-6963httpsgithubcomprettierprettierpull6963-by-fiskerhttpsgithubcomfisker
  trailingComma: 'all',
}

module.exports = conf
