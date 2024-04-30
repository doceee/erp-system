module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier',
    'eslint:recommended',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: true },
    ],
    'vue/html-indent': ['error', 4, { baseIndent: 1 }],
    'vue/script-indent': ['error', 4, { baseIndent: 0, switchCase: 1 }],
    'vue/max-attributes-per-line': ['off'],
    'vue/html-self-closing': ['off'],
    'vue/no-v-html': ['off'],
    'vue/order-in-components': 2,
  },
  globals: {
    $: true,
    require: true,
    process: true,
    module: true,
  },
}
