import boundaries from 'eslint-plugin-boundaries';
import prettier from 'eslint-plugin-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      boundaries,
      prettier,
    },

    settings: {
      'boundaries/include': ['src/**/*', 'app/**/*', 'di/**/*'],

      'boundaries/elements': [
        {
          mode: 'full',
          type: 'web',
          pattern: ['app/**/*'],
        },
        {
          mode: 'full',
          type: 'controllers',
          pattern: ['src/interface-adapters/controllers/**/*'],
        },
        {
          mode: 'full',
          type: 'use-cases',
          pattern: ['src/application/use-cases/**/*'],
        },
        {
          mode: 'full',
          type: 'service-interfaces',
          pattern: ['src/application/services/**/*'],
        },
        {
          mode: 'full',
          type: 'repository-interfaces',
          pattern: ['src/application/repositories/**/*'],
        },
        {
          mode: 'full',
          type: 'entities',
          pattern: ['src/entities/**/*'],
        },
        {
          mode: 'full',
          type: 'infrastructure',
          pattern: ['src/infrastructure/**/*'],
        },
        {
          mode: 'full',
          type: 'di',
          pattern: ['di/**/*'],
        },
      ],
    },

    rules: {
      'prettier/prettier': 'error',
      'boundaries/no-unknown': 'error',
      'boundaries/no-unknown-files': 'error',

      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',

          rules: [
            {
              from: 'web',
              allow: ['web', 'entities', 'di'],
            },
            {
              from: 'controllers',
              allow: [
                'entities',
                'service-interfaces',
                'repository-interfaces',
                'use-cases',
              ],
            },
            {
              from: 'infrastructure',
              allow: [
                'service-interfaces',
                'repository-interfaces',
                'entities',
              ],
            },
            {
              from: 'use-cases',
              allow: [
                'entities',
                'service-interfaces',
                'repository-interfaces',
              ],
            },
            {
              from: 'service-interfaces',
              allow: ['entities'],
            },
            {
              from: 'repository-interfaces',
              allow: ['entities'],
            },
            {
              from: 'entities',
              allow: ['entities'],
            },
            {
              from: 'di',

              allow: [
                'di',
                'controllers',
                'service-interfaces',
                'repository-interfaces',
                'use-cases',
                'infrastructure',
              ],
            },
          ],
        },
      ],
    },
  },
];
