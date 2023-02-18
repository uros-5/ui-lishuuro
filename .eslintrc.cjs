/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules : {
    "vue/no-use-v-if-with-v-for": ["error", {
        "allowUsingIterationVar": false
      }],
    "no-case-declarations": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "vue/require-v-for-key": "off"
  }
};
