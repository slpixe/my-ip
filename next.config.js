/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { useTypeScriptCli: false },
  reactStrictMode: true,
  // Exclude Storybook files from the build
  outputFileTracingExcludes: {
    '*': ['./src/stories/**/*'],
  },
};

module.exports = nextConfig;