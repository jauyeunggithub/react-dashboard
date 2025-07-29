(async () => {
  try {
    const fetchMockModule = await import("jest-fetch-mock");

    const fetchMock = fetchMockModule.default || fetchMockModule;
    if (typeof fetchMock.enableMocks === "function") {
      fetchMock.enableMocks();
    } else {
      console.warn(
        "jest-fetch-mock.enableMocks() not found. Ensure it's correctly imported."
      );
    }

    if (
      typeof global.beforeEach === "function" &&
      typeof fetchMock.resetMocks === "function"
    ) {
      global.beforeEach(() => {
        fetchMock.resetMocks();
      });
    }
  } catch (error) {
    console.error("Error loading jest-fetch-mock in jest.setup.mjs:", error);
  }
})();
