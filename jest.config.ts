import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    // 1. Utilisation du preset ESM pour supporter les modules modernes
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],

    // 2. Traitement des fichiers .ts comme des modules ESM
    extensionsToTreatAsEsm: ['.ts'],

    // 3. Mapping des extensions .js (requises par TS) vers les fichiers .ts (lus par Jest)
    moduleNameMapper: {
        '^(\\.\\.?\\/.+)\\.js$': '$1',
    },

    // 4. Configuration fine du transformateur ts-jest
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                // Fixe le warning TS151002 et optimise la transpilation isolée
                isolatedModules: true,
            },
        ],
    },
};

export default config;