import tseslint from 'typescript-eslint';
import viteConfig from '@museum-manager/eslint-config/eslint-config-vite';

export default tseslint.config([
  viteConfig,
  {
    ignores: ['dist/*'],
  },
]);
