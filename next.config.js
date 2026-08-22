/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude Storybook files from the build
  outputFileTracingExcludes: {
    '*': ['./src/stories/**/*'],
  },
};

module.exports = nextConfig;