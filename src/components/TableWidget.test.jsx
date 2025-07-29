/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TableWidget from "./TableWidget";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: jest.fn(),
}));

describe("TableWidget", () => {
  it("renders table with user data", async () => {
    const mockData = [
      {
        id: 1,
        name: "Leanne Graham",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031",
      },
      {
        id: 2,
        name: "Ervin Howell",
        email: "Shanna@melissa.tv",
        phone: "010-692-6593",
      },
    ];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    );

    render(<TableWidget />);

    // Wait for the data to be displayed
    await waitFor(() =>
      expect(screen.getByText(/Leanne Graham/)).toBeInTheDocument()
    );
    expect(screen.getByText(/Sincere@april.biz/)).toBeInTheDocument();
    expect(screen.getByText(/1-770-736-8031/)).toBeInTheDocument();
  });
});
