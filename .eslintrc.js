module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        "no-plusplus": ["off"],
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        indent: ["error", 4],
        "no-param-reassign": ["off"],
        "no-use-before-define": ["off"],
        "no-new" : ["off"],
        "no-labels": ["off"],
    },
};
