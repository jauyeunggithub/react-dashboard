const fetchMock = require("jest-fetch-mock");

if (typeof fetchMock.enableMocks === "function") {
  fetchMock.enableMocks();
} else {
  console.warn(
    "jest-fetch-mock.enableMocks() not found in jest-fetch-mock-bridge.cjs."
  );
}

module.exports = fetchMock;
