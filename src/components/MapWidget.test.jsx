/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import MapWidget from "./MapWidget";

jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>Tile Layer</div>,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: () => <div>Popup</div>,
}));

describe("MapWidget", () => {
  let originalImportMetaEnv;

  beforeAll(() => {
    originalImportMetaEnv = global.import?.meta?.env;

    if (!global.import) {
      global.import = {};
    }
    if (!global.import.meta) {
      global.import.meta = {};
    }

    global.import.meta.env = {
      VITE_IPINFO_TOKEN: "mock-ipinfo-token-for-tests",
    };
  });

  afterAll(() => {
    global.import.meta.env = originalImportMetaEnv;
  });

  it("renders map with marker", async () => {
    render(<MapWidget />);

    expect(screen.getByText(/Tile Layer/)).toBeInTheDocument();
    expect(screen.getByText(/Popup/)).toBeInTheDocument();
  });
});
