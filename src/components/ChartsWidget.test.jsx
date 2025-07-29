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

    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
    expect(screen.getByText("Chart Widget")).toBeInTheDocument();

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
      { id: 60, userId: 600, title: "Test Post F" },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockApiData));

    render(<ChartsWidget />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/posts"
      );

      expect(screen.getByTestId("chart-labels")).toHaveTextContent(
        "10,20,30,40,50"
      );
      expect(screen.getByTestId("chart-data")).toHaveTextContent(
        "100,200,300,400,500"
      );
    });
  });

  it("handles API errors gracefully by not rendering the chart", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockRejectOnce(new Error("Failed to fetch data"));

    render(<ChartsWidget />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
    expect(screen.queryByText(/Error/i)).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching chart data:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
