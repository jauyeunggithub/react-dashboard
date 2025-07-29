import fetchMock from "./jest-fetch-mock-bridge.cjs";

if (typeof global.import === "undefined") {
  global.import = {};
}
if (typeof global.import.meta === "undefined") {
  global.import.meta = {};
}

global.import.meta.env = {
  VITE_IPINFO_TOKEN: "mock-ipinfo-token-for-tests",
};

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
