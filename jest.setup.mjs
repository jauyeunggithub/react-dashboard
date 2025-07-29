// jest.setup.mjs

// Import the CommonJS wrapper. Node.js can import .cjs files from .mjs files.
// This import is synchronous because it's importing a CJS module.
import fetchMock from "./jest-fetch-mock-bridge.cjs";

// Now, define your beforeEach hook synchronously,
// as fetchMock is available immediately.
if (
  typeof global.beforeEach === "function" &&
  typeof fetchMock.resetMocks === "function"
) {
  global.beforeEach(() => {
    fetchMock.resetMocks();
  });
} else {
  console.warn(
    "global.beforeEach or fetchMock.resetMocks not available, beforeEach hook not set."
  );
}

// No more async IIFE needed for fetchMock setup within this file!
