import baseConfig from './tailwind.config.js';

export default {
  ...baseConfig,
  content: [
    './blog/**/*.html',
    './blog/**/*.md',
    './src/**/*.{js,ts,jsx,tsx}',
    './scripts/generate-blog.tsx',
  ],
  theme: {
    ...baseConfig.theme,
  },
  plugins: [...(baseConfig.plugins || [])],
};
