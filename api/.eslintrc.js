module.exports = {
    extends: [
      // By extending from a plugin config, we can get recommended rules without having to add them manually.
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:import/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:@typescript-eslint/recommended',
      // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
      // Make sure it's always the last config, so it gets the chance to override other configs.
      'eslint-config-prettier',
    ],
    settings: {
      react: {
        // Tells eslint-plugin-react to automatically detect the version of React to use.
        version: 'detect',
      },
      // Tells eslint how to resolve imports
      'import/resolver': {
        node: {
          paths: ['src'],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // Add your own rules here to override ones from the extended configs.
        'max-len': ['error', { code: 80 }],
        "no-console": "warn",
        "no-debugger": "error",
        "indent": ["error", 2],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "eqeqeq": "error",
        "curly": "error",
        "no-eval": "error",
        "no-implied-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-fallthrough": "error",
        "no-floating-decimal": "error",
        "no-global-assign": "error",
        "no-implicit-globals": "error",
        "no-undef": "error",
        "no-unused-vars": "warn",
        "no-use-before-define": "error",
        "camelcase": "warn",
        "comma-dangle": ["error", "never"],
        "eol-last": ["error", "always"],
        "func-call-spacing": ["error", "never"],
        "keyword-spacing": ["error", { "before": true, "after": true }],
        "linebreak-style": ["error", "unix"],
        "no-trailing-spaces": "error",
        "arrow-body-style": ["error", "as-needed"],
        "arrow-spacing": ["error", { "before": true, "after": true }],
        "no-var": "error",
        "prefer-const": "error",
        "template-curly-spacing": ["error", "never"]
    },
  };
  