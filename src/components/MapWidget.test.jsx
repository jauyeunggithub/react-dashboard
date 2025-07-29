/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import MapWidget from "./MapWidget";
import "@testing-library/jest-dom/extend-expect";

// Mock react-leaflet components
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>Tile Layer</div>,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: () => <div>Popup</div>,
}));

describe("MapWidget", () => {
  it("renders map with marker", async () => {
    render(<MapWidget />);

    // Ensure map-related elements are rendered
    expect(screen.getByText(/Tile Layer/)).toBeInTheDocument();
    expect(screen.getByText(/Popup/)).toBeInTheDocument();
  });
});
