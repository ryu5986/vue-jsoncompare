/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:vue/vue3-recommended',
        '@vue/eslint-config-typescript',
        '@vue/eslint-config-prettier/skip-formatting',
        'plugin:vuetify/base'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    root: true
}