module.exports = {
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'no-console': 0,
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        mjs: 'never',
      },
    ],
  },
  settings: {
    'import/external-module-folders': [],
    'import/resolver': {
      node: { extensions: ['.js', '.mjs'] },
    },
  },
}
