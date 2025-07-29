// jest.config.js
// Use export default because your package.json has "type": "module"
export default {
  // Use jsdom for a browser-like environment (needed for React components)
  testEnvironment: "jest-environment-jsdom",

  // Tell Jest which file extensions to look for
  moduleFileExtensions: ["js", "jsx", "mjs"], // Exclude 'ts'/'tsx' if you're not using TypeScript

  // Setup files to run before each test environment (e.g., for global mocks, @testing-library/jest-dom matchers)
  setupFilesAfterEnv: [
    "@testing-library/jest-dom", // Provides custom matchers like .toBeInTheDocument()
    "./jest.setup.mjs", // Your custom setup file for things like fetchMock
  ],

  // This tells Jest to use babel-jest to transform your JS/JSX files
  transform: {
    // Apply babel-jest transformation to .js and .jsx files
    "^.+\\.(js|jsx)$": "babel-jest",
  },

  // CRITICAL: Configure Jest to transform ES Modules within node_modules.
  // By default, Jest ignores node_modules for transformation. However, many modern packages
  // are published as ES Modules. If Jest's ESM loader struggles with them, you need Babel to
  // transpile them into CommonJS before Jest executes them.
  // Add package names (or parts of their paths) that cause "Cannot use import statement..." errors.
  // Common culprits include: 'd3-array', 'd3-scale', 'nanoid', 'react-router-dom', 'lodash-es',
  // or sometimes even parts of React itself like 'react' or 'react-dom' if issues persist.
  transformIgnorePatterns: [
    // This pattern ignores most node_modules, but EXPLICITLY INCLUDES paths that contain 'esm'
    // or specific package names that are known to be ESM and cause issues.
    "/node_modules/(?!.*esm/|@testing-library|react-leaflet|react-dom|react|some-other-problematic-esm-package)/",
    // Example for react-leaflet if it's ESM:
    // "/node_modules/(?!react-leaflet|@react-leaflet)/"
    // The previous transformIgnorePatterns you had: ['/node_modules/(?!your-esm-dependency)/']
    // You'll need to update 'your-esm-dependency' to actual problematic packages.
    // A common catch-all for ESM in node_modules is `/node_modules/(?!(.*)/esm/|other-package-name)/`
    // For your case, just explicitly listing might be sufficient:
    // "/node_modules/(?!@testing-library/react|react|react-dom|react-leaflet)/"
  ],

  // Optional: If you use path aliases in Vite (e.g., `import '@/components/MyComponent'`)
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  // },
};
