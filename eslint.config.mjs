import nextConfig from 'eslint-config-next/core-web-vitals';
import storybook from 'eslint-plugin-storybook';

const config = [
  ...nextConfig,
  ...storybook.configs['flat/recommended'],
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'coverage/**',
      'storybook-static/**',
      'src/stories/**',
      '**/*.stories.*',
    ],
  },
  {
    // Floating UI requires callback refs to be attached in JSX during render.
    files: ['src/app/components/FloatingTooltip.tsx'],
    rules: {
      'react-hooks/refs': 'off',
    },
  },
];

export default config;
