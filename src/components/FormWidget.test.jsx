/* eslint-disable no-undef */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormWidget from "./FormWidget";

describe("FormWidget", () => {
  it("handles form submission and logs data", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<FormWidget />);

    const nameInput = screen.getByLabelText("Name"); // This will now work
    const emailInput = screen.getByLabelText("Email"); // This will now work
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john.doe@example.com");

    await userEvent.click(submitButton);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john.doe@example.com",
    });

    consoleSpy.mockRestore();
  });

  it("displays validation errors for required fields", async () => {
    render(<FormWidget />);

    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await userEvent.click(submitButton);
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("clears validation error for a field when it's filled", async () => {
    render(<FormWidget />);
    const nameInput = screen.getByLabelText("Name");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    await userEvent.type(nameInput, "Jane Doe");

    await waitFor(() => {
      expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });
});
