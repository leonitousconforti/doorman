module.exports = {
    root: true,
    env: {
        es2020: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:promise/recommended",
        "plugin:unicorn/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "prettier", "promise", "unicorn"],
    overrides: [],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
    ignorePatterns: ["build/", "src/proto/generated/"],
};
