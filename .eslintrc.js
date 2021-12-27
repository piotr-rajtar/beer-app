module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        endOfLine: 'auto',
      },
    ],
    curly: 'error',
    'no-case-declarations': 'off',
    'no-prototype-builtins': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used' }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'any',
          normal: 'always',
          component: 'always',
        },
      },
    ],
  },
};
