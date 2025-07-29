/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MapWidget from "./MapWidget";
import fetchMock from "jest-fetch-mock";

jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>Tile Layer</div>,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: () => <div>Popup</div>,
}));

jest.mock("leaflet", () => ({
  ...jest.requireActual("leaflet"),
  Icon: {
    Default: {
      mergeOptions: jest.fn((options) => ({
        ...options,
        iconUrl: "mock-icon.png",
        iconRetinaUrl: "mock-icon-2x.png",
        shadowUrl: "mock-shadow.png",
      })),
    },
  },
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

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders map with marker after fetching location data", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ loc: "34.0522,-118.2437" }));

    render(<MapWidget />);

    expect(screen.getByText("Loading map...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Tile Layer/)).toBeInTheDocument();
      expect(screen.getByText(/Your location/)).toBeInTheDocument();
    });

    expect(screen.queryByText("Loading map...")).not.toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://ipinfo.io/json?token=${global.import.meta.env.VITE_IPINFO_TOKEN}`
    );
  });

  it('renders "Loading map..." initially if data is not yet available', () => {
    fetchMock.mockResponseOnce(() => new Promise(() => {}));

    render(<MapWidget />);

    expect(screen.getByText("Loading map...")).toBeInTheDocument();
    expect(screen.queryByText(/Tile Layer/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Popup/)).not.toBeInTheDocument();
  });

  it("handles fetch errors gracefully", async () => {
    fetchMock.mockRejectOnce(new Error("Network error during fetch"));

    render(<MapWidget />);

    expect(screen.getByText("Loading map...")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/Tile Layer/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Popup/)).not.toBeInTheDocument();
      },
      { timeout: 100 }
    );

    expect(screen.getByText("Loading map...")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
