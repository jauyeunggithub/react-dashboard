export default {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest", // Use Babel to transform JS/JSX files
  },
  setupFilesAfterEnv: [
    "@testing-library/jest-dom", // Ensure it's only '@testing-library/jest-dom'
  ],
};
