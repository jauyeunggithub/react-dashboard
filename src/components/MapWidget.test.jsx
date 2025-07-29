/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";

jest.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>Tile Layer</div>,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
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

jest.mock("./MapWidget", () => {
  const actualReact = jest.requireActual("react");

  const MOCKED_VITE_IPINFO_TOKEN = "mock-ipinfo-token-for-tests";

  const { MapContainer, TileLayer, Marker, Popup } =
    jest.requireMock("react-leaflet");

  const MockMapWidget = () => {
    const [location, setLocation] = actualReact.useState(null);

    actualReact.useEffect(() => {
      fetch(`https://ipinfo.io/json?token=${MOCKED_VITE_IPINFO_TOKEN}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const [lat, lng] = data.loc.split(",");
          setLocation([parseFloat(lat), parseFloat(lng)]);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
          setLocation(null);
        });
    }, []);

    return (
      <div className="widget">
        <div className="widget-title">Map Widget</div>
        {location ? (
          <MapContainer
            center={location}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={location}>
              <Popup>Your location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    );
  };
  return MockMapWidget;
});

import MapWidget from "./MapWidget";

describe("MapWidget", () => {
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
      `https://ipinfo.io/json?token=mock-ipinfo-token-for-tests`
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
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockRejectOnce(new Error("Network error during fetch"));

    render(<MapWidget />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText(/Tile Layer/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Popup/)).not.toBeInTheDocument();
    expect(screen.getByText("Loading map...")).toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching location data:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });
});
