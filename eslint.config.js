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
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: ['const', 'let'], next: '*' },
                { blankLine: 'any',    prev: ['const', 'let'], next: ['const', 'let'] },
                // require a blank line before any `if` statement
                { blankLine: 'always', prev: '*', next: 'if' }
            ],
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
                'error', 2, {
                    'attribute': 1,
                    'closeBracket': 0,
                    // don't align attributes vertically; require fixed indent relative to the tag
                    'alignAttributesVertically': false
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
            'indent': ['error', 2, {
                SwitchCase: 1
            }],
            // Require object literals to be multiline (forces call args like fn({ ... }) to be on next lines)
            'object-curly-newline': ['error', {
                ObjectExpression: { minProperties: 1 },
                ObjectPattern: { minProperties: 1 },
                // Do not force multi-line for import/export declarations at the top of files
                ImportDeclaration: 'never',
                ExportDeclaration: 'never'
            }],
            'object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
        },
    }
];