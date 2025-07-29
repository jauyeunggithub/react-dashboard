/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ChartsWidget from "./ChartsWidget";

// Import fetchMock to explicitly use its methods in the test file
import fetchMock from "jest-fetch-mock";

// Mock the react-chartjs-2 components more comprehensively
jest.mock("react-chartjs-2", () => ({
  Line: ({ data }) => (
    <div data-testid="line-chart">
      Mocked Line Chart
      {data && data.labels && (
        <div data-testid="chart-labels">{data.labels.join(",")}</div>
      )}
      {data && data.datasets && data.datasets[0] && (
        <div data-testid="chart-data">{data.datasets[0].data.join(",")}</div>
      )}
    </div>
  ),
  // Add mocks for other chart types if ChartsWidget can render them (e.g., Bar, Doughnut)
  // Bar: ({ data }) => <div data-testid="bar-chart">Mocked Bar Chart</div>,
  // Doughnut: ({ data }) => <div data-testid="doughnut-chart">Mocked Doughnut Chart</div>,
}));

describe("ChartsWidget", () => {
  // Reset fetch mocks before each test to ensure a clean state
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders the chart component", async () => {
    // Mock a successful API response for the component's fetch call
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
        { id: 3, title: "Post 3" },
        { id: 4, title: "Post 4" },
        { id: 5, title: "Post 5" },
      ])
    );

    render(<ChartsWidget />);

    // Ensure that the mocked chart renders after data is fetched
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
    // You might also want to assert on an initial loading state if your component has one
    // expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("fetches and displays chart data", async () => {
    const mockApiData = [
      { id: 10, title: "Test Post A" },
      { id: 20, title: "Test Post B" },
      { id: 30, title: "Test Post C" },
      { id: 40, title: "Test Post D" },
      { id: 50, title: "Test Post E" },
    ];

    // Mock the specific API response for this test case
    fetchMock.mockResponseOnce(JSON.stringify(mockApiData));

    render(<ChartsWidget />);

    // Wait for the asynchronous fetch operation to complete and for the UI to update
    await waitFor(() => {
      // Verify that fetch was called with the correct URL
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/posts"
      );

      // Verify that the chart's labels and data reflect the mocked API response
      // This assumes your ChartsWidget extracts `id` for labels and `id` for data (or similar)
      expect(screen.getByTestId("chart-labels")).toHaveTextContent(
        "10,20,30,40,50"
      );
      expect(screen.getByTestId("chart-data")).toHaveTextContent(
        "10,20,30,40,50"
      );
    });
  });

  it("handles API errors gracefully", async () => {
    // Mock an API error response
    fetchMock.mockRejectOnce(new Error("Failed to fetch data"));

    render(<ChartsWidget />);

    // Wait for the component to process the error
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      // Assuming your component displays an error message on fetch failure
      expect(screen.getByText(/Error loading chart data/i)).toBeInTheDocument();
    });
    // Ensure the chart itself is not rendered if there's an error
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });
});
