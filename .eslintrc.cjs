module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended'],
  plugins: ['vue'],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  parser: 'vue-eslint-parser',
  rules: {
    quotes: [2, 'single'],
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/quotes': [
      'warn',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'lines-between-class-members': ['warn', 'always'],
    'arrow-body-style': ['warn', 'as-needed'],
    'no-unneeded-ternary': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-prototype-builtins': 'warn',
    'getter-return': 'off',
    'no-undef': 'off',
    'no-control-regex': 'warn',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    'sort-vars': 'off',
    'one-var': 'off',
    'no-eval': 'warn',
    'vue/html-indent': 2,
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
    'vue/v-slot-style': ['error', {
      "atComponent": "shorthand",
      "default": "shorthand",
      "named": "shorthand",
    }],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'below',
      },
    ],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-fallthrough': 'off',
    semi: ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        named: 'never',
        anonymous: 'always',
        asyncArrow: 'always',
      },
    ],
    'no-unreachable': 'error',
    'space-in-parens': ['error', 'never'],
    curly: 'error',
    'keyword-spacing': 'error',
    'vue/no-mutating-props': 'warn',
    'vue/component-definition-name-casing': 'off',
    'vue/no-unused-components': 'warn',
    'vue/require-prop-types': 'error',
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    'import/extensions': ['.js', '.vue', '.ts', '.jsx', '.tsx'],
    'import/resolver': 'webpack',
  }
};
