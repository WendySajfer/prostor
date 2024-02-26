// /** @type {import("eslint").Linter.Config} */
// const config = {
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     project: true,
//   },
//   plugins: ["@typescript-eslint"],
//   extends: [
//     "next/core-web-vitals",
//     "plugin:@typescript-eslint/recommended-type-checked",
//     "plugin:@typescript-eslint/stylistic-type-checked",
//   ],
//   rules: {
//     // These opinionated rules are enabled in stylistic-type-checked above.
//     // Feel free to reconfigure them to your own preference.
//     "@typescript-eslint/array-type": "off",
//     "@typescript-eslint/consistent-type-definitions": "off",

//     "@typescript-eslint/consistent-type-imports": [
//       "warn",
//       {
//         prefer: "type-imports",
//         fixStyle: "inline-type-imports",
//       },
//     ],
//     "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
//     "@typescript-eslint/require-await": "off",
//     "@typescript-eslint/no-misused-promises": [
//       "error",
//       {
//         checksVoidReturn: { attributes: false },
//       },
//     ],
//   },
// };
/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint', 'perfectionist'],
  rules: {
    // Feel free to reconfigure them to your own preference.
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    // These opinionated rules are enabled in stylistic-type-checked above.
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    'perfectionist/sort-imports': [
      'error',
      {
        groups: [
          'type',
          'react',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'side-effect',
          'style',
          'object',
          'unknown',
        ],
        order: 'asc',
        type: 'natural',
      },
    ],
    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
  },
}

module.exports = config
