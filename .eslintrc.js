module.exports = {
  parser: "@typescript-eslint/parser",
  root: true,
  plugins: [
    "@typescript-eslint",
    "jest",
    "prettier"
  ],
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    "plugin:@typescript-eslint/recommended",
    'prettier/@typescript-eslint',
    "standard",
    "plugin:jest/all",
    'prettier',
    'prettier/@typescript-eslint',
    "prettier/@typescript-eslint",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    jest: "readonly"
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  rules: {
    'jest/no-disabled-tests': 'off',
    "space-before-function-paren": ["error",
      {
        "anonymous": "always",
        "named": "never"
      }
    ]
  }
};
