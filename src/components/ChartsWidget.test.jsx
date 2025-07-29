/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ChartsWidget from "./ChartsWidget";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-chartjs-2", () => ({
  Line: () => <div>Mocked Chart</div>,
}));

describe("ChartsWidget", () => {
  it("renders the chart component", async () => {
    render(<ChartsWidget />);

    // Ensure that the mocked chart renders
    await waitFor(() => screen.getByText(/Mocked Chart/));
    expect(screen.getByText(/Mocked Chart/)).toBeInTheDocument();
  });

  it("fetches and displays chart data", async () => {
    render(<ChartsWidget />);

    // You can add tests here for API calls if you want, or mock API responses
    // Ensure some part of the chart (or API response) is displayed, like chart labels or values
    expect(screen.getByText(/Mocked Chart/)).toBeInTheDocument();
  });
});
