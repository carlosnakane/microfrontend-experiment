"use strict";

module.exports = {
  extends: [
    "airbnb",
    "prettier",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:jest/recommended",
    "prettier/react",
    "prettier/@typescript-eslint"
  ],
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "jest",
    "unicorn",
    "react-hooks"
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true
  },
  rules: {
    "react/jsx-wrap-multilines": 0,
    "react/prop-types": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-one-expression-per-line": 0,
    "generator-star-spacing": 0,
    "function-paren-newline": 0,
    "import/no-unresolved": [2, { ignore: ["^@/", "^umi/"] }],
    "import/no-extraneous-dependencies": [
      2,
      {
        optionalDependencies: true,
        devDependencies: ["**/tests/**.js", "/mock/**/**.js", "**/**.test.js", '**/_mock.{ts,js}']
      }
    ],
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "linebreak-style": 0,
    "no-prototype-builtins": "off",
    "import/prefer-default-export": "off",
    "import/no-default-export": [0, "camel-case"],
    "react/destructuring-assignment": "off",
    "react/jsx-filename-extension": "off",
    "no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true }
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      { allowTypedFunctionExpressions: true }
    ],
    "@typescript-eslint/no-use-before-define": [
      "error",
      { functions: false, classes: true, variables: true, typedefs: true }
    ],
    "unicorn/prevent-abbreviations": "off",
    "@typescript-eslint/explicit-member-accessibility": 0,
    "import/no-cycle": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Conflict with prettier
    "arrow-body-style": ["error", "as-needed"],
    "object-curly-newline": 0,
    "implicit-arrow-linebreak": 0,
    "operator-linebreak": 0
  }
};