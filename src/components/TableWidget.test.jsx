/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TableWidget from "./TableWidget";
import fetchMock from "jest-fetch-mock";

describe("TableWidget", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders table with user data after fetching", async () => {
    const mockData = [
      {
        id: 1,
        name: "Leanne Graham",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
      },
      {
        id: 2,
        name: "Ervin Howell",
        email: "Shanna@melissa.tv",
        phone: "010-692-6593 x09125",
      },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 });

    render(<TableWidget />);

    expect(screen.getByText("Table Widget")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Leanne Graham/)).toBeInTheDocument();
      expect(screen.getByText(/Sincere@april.biz/)).toBeInTheDocument();
      expect(screen.getByText(/1-770-736-8031 x56442/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Ervin Howell/)).toBeInTheDocument();
    expect(screen.getByText(/Shanna@melissa.tv/)).toBeInTheDocument();
    expect(screen.getByText(/010-692-6593 x09125/)).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users"
    );
  });

  it("renders nothing or a loading state initially and handles empty data", async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]), { status: 200 });

    render(<TableWidget />);

    expect(screen.getByText("Table Widget")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/ID/)).toBeInTheDocument();
      expect(screen.queryByText(/Leanne Graham/)).not.toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("handles fetch errors gracefully", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchMock.mockRejectOnce(new Error("Network error!"));

    render(<TableWidget />);

    await waitFor(() => {
      expect(screen.queryByText(/Leanne Graham/)).not.toBeInTheDocument();
      expect(screen.queryByText(/ID/)).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching table data:",
      expect.any(Error)
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users"
    );

    consoleErrorSpy.mockRestore();
  });
});
