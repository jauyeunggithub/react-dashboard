export default {
  testEnvironment: "jest-environment-jsdom",
  moduleFileExtensions: ["js", "jsx", "mjs"],
  setupFilesAfterEnv: ["@testing-library/jest-dom", "./jest.setup.mjs"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@testing-library|react|react-dom|some-other-esm-package)/",
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
};
