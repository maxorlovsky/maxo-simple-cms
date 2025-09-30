const js = require('@eslint/js');
const pluginVue = require('eslint-plugin-vue');
const ts = require('typescript-eslint');
const tsParser = require('@typescript-eslint/parser');
const vueEslintParser = require('vue-eslint-parser');

module.exports = [
    {
        ignores: [
            'eslint.config.js',
            '**/*.d.ts',
            '**/*{.,-}min.js',
            '**/public/*',
        ]
    },
    js.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    ...pluginVue.configs['flat/strongly-recommended'],
    ...pluginVue.configs['flat/recommended'],
    ...ts.configs.recommended,
    {
        languageOptions: {
            parser: vueEslintParser,
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 2023,
                parser: tsParser
            },
        },
        rules: {
            '@typescript-eslint/explicit-member-accessibility': 'off',
            '@typescript-eslint/array-type': 'off',
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-extra-semi': 'off',
            'no-console': [
                'error',
                {
                    allow: ['warn', 'error', 'info']
                }
            ],
            'no-duplicate-imports': 'error',
            'no-else-return': 'error',
            'no-eval': 'error',
            'no-implicit-globals': 'error',
            'no-implied-eval': 'error',
            'no-var': 'error',
            'newline-before-return': 'error',
            'no-trailing-spaces': ['error', {
                skipBlankLines: false,
                ignoreComments: false
            }],
            'vue/html-indent': [
                'error', 4, {
                    'attribute': 1,
                    'closeBracket': 0,
                    'alignAttributesVertically': true,
                    'ignores': ['VAttribute']
                }
            ],
            'vue/multiline-html-element-content-newline': 'off',
            'vue/component-definition-name-casing': ['error', 'kebab-case'],
            'vue/first-attribute-linebreak': [
                'error', {
                    'singleline': 'beside',
                    'multiline': 'beside'
                }
            ],
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'off',
            'indent': ['error', 4, {
                SwitchCase: 1
            }],
        },
    }
];