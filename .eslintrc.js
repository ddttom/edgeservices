module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always'],

    'space-before-function-paren': ['error', 'never'],
    'implicit-arrow-linebreak': 'off',
    // 'function-paren-newline': ['error', 'never'],
    'function-paren-newline': ['error', 'multiline'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      functions: 'always-multiline',
    }],
    indent: ['error', 2],
  },
};
