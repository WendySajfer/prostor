/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  arrowParens: "always",
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 80,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
};

export default config;
