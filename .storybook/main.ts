import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const configDirectory = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  viteFinal: async (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: {
        "@": resolve(configDirectory, "../src")
      }
    }
  })
};
export default config;
