module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'prettier',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  rules: {
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-restricted-syntax': 0,
    'no-unused-expressions': ['error', { allowTernary: true }],
    'linebreak-style': ['error', 'windows'],
    'no-bitwise': 0,
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
};