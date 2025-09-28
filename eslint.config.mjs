import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import next from '@next/eslint-plugin-next';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['**/.next/**', '**/dist/**', '**/build/**', '**/node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } }
    },
    plugins: {
      '@typescript-eslint': ts,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      'next': next
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules
    }
  },
  { rules: { ...prettier.rules } }
];
