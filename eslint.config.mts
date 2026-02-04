import * as eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as unusedImports from 'eslint-plugin-unused-imports';
import * as simpleImportSort from 'eslint-plugin-simple-import-sort';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    // 1. BLOC D'IGNORANCE GLOBALE
    // On exclut les répertoires de build et les fichiers de configuration racine
    // pour éviter les conflits avec le scope du tsconfig (src/)
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'coverage/**',
            'eslint.config.mts',
            'jest.config.ts'
        ]
    },

    // 2. CONFIGURATIONS DE BASE
    // On active les recommandations d'ESLint et de TypeScript-ESLint
    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    // 3. CONFIGURATION DES FICHIERS SOURCE
    {
        files: ['**/*.ts'],
        plugins: {
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
            '@stylistic': stylistic,
        },
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: process.cwd(),
            },
        },
        rules: {
            // --- Suppression automatique des imports inutilisés ---
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    'vars': 'all',
                    'varsIgnorePattern': '^_',
                    'args': 'after-used',
                    'argsIgnorePattern': '^_'
                }
            ],

            // --- Tri automatique des imports (ESM Ready) ---
            // Force un ordre propre : imports node, internes, puis relatifs
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            // --- Style & Formatage (@stylistic) ---
            // Remplace les anciennes règles dépréciées d'ESLint
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/member-delimiter-style': ['error', {
                multiline: { delimiter: 'semi', requireLast: true },
                singleline: { delimiter: 'semi', requireLast: false }
            }],

            // --- Rigueur TypeScript ---
            '@typescript-eslint/no-explicit-any': 'error', // Interdiction du "any"
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports' }
            ], // Force l'usage de 'import type'

            // --- Qualité de code ---
            'no-console': 'error', // On ne laisse rien traîner en prod
            'no-debugger': 'error'
        },
    }
);