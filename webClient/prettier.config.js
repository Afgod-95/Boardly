/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  jsxSingleQuote: false,
  jsxBracketSameLine: false,

  endOfLine: "lf",

  plugins: ["prettier-plugin-tailwindcss"],
};
