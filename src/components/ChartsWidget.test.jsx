/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ChartsWidget from "./ChartsWidget";

import fetchMock from "jest-fetch-mock";

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
}));

describe("ChartsWidget", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders the chart component after data is fetched", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { id: 1, userId: 100, title: "Post 1" },
        { id: 2, userId: 101, title: "Post 2" },
        { id: 3, userId: 102, title: "Post 3" },
        { id: 4, userId: 103, title: "Post 4" },
        { id: 5, userId: 104, title: "Post 5" },
      ])
    );

    render(<ChartsWidget />);

    // Initially, the chart should not be in the document
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
    expect(screen.getByText("Chart Widget")).toBeInTheDocument(); // Widget title should be there

    // Wait for the chart to be rendered after data is fetched
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });

  it("fetches and displays correct chart data", async () => {
    const mockApiData = [
      { id: 10, userId: 100, title: "Test Post A" },
      { id: 20, userId: 200, title: "Test Post B" },
      { id: 30, userId: 300, title: "Test Post C" },
      { id: 40, userId: 400, title: "Test Post D" },
      { id: 50, userId: 500, title: "Test Post E" },
      { id: 60, userId: 600, title: "Test Post F" }, // More data than needed to test slice(0, 5)
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

      // Verify that the chart's labels and data reflect the mocked API response,
      // specifically testing the slice(0, 5) and mapping id to labels, userId to data.
      expect(screen.getByTestId("chart-labels")).toHaveTextContent(
        "10,20,30,40,50" // IDs of the first 5 posts
      );
      expect(screen.getByTestId("chart-data")).toHaveTextContent(
        "100,200,300,400,500" // User IDs of the first 5 posts
      );
    });
  });

  it("handles API errors gracefully by not rendering the chart", async () => {
    // Mock an API error response
    fetchMock.mockRejectOnce(new Error("Failed to fetch data"));

    render(<ChartsWidget />);

    // The component does not display an error message or a loading indicator.
    // It simply won't render the chart if `chartData` remains null.
    // We wait for the fetch to complete its cycle (and fail).
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Assert that the chart component is NOT rendered
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
    // Assert that no error message is displayed (since the component doesn't have one)
    expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();
  });
});
