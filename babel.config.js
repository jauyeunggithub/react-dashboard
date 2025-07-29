// babel.config.js
// Use export default because your package.json has "type": "module"
export default {
  // These presets apply to your general application code (e.g., for Vite builds)
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { esmodules: true }, // Target modern environments that support ES Modules
        modules: false, // CRUCIAL: Keep ES Modules as is for your app's main build/development
        // This prevents Babel from transforming `import` to `require` for Vite.
      },
    ],
    "@babel/preset-react", // For React JSX syntax
  ],
  // This 'env' configuration applies specifically when NODE_ENV is 'test' (which Jest sets)
  env: {
    test: {
      // For the Jest environment, we often need to explicitly transform ES Modules to CommonJS.
      // While Jest can run ESM with --experimental-vm-modules, sometimes its internal loaders
      // work better with CJS for transformed files, especially for dependencies.
      presets: [
        [
          "@babel/preset-env",
          {
            targets: { node: "current" }, // Target the current Node.js version for Jest
            modules: "commonjs", // CRUCIAL: Transform ES Modules to CommonJS for Jest tests
            // This resolves "Cannot use import statement outside a module" in tests.
          },
        ],
        "@babel/preset-react", // Still need for JSX in tests
      ],
      // This plugin handles Vite's `import.meta.env` syntax
      plugins: [
        [
          "babel-plugin-transform-vite-meta-env",
          {
            env: {
              VITE_IPINFO_TOKEN: "mock-ipinfo-token-for-jest",
              VITE_API_BASE_URL: "mock-api-base-url-for-jest",
              // Add all other VITE_ variables your components/code might use
            },
          },
        ],
      ],
    },
  },
};
