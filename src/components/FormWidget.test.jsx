/* eslint-disable no-undef */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormWidget from "./FormWidget";

describe("FormWidget", () => {
  it("renders the form and handles submit", async () => {
    render(<FormWidget />);

    // Check if the form fields are rendered
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Simulate user typing in the form
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "johndoe@example.com" } });

    // Simulate form submission
    fireEvent.click(submitButton);

    // Wait for the submit handler to complete (if necessary)
    await waitFor(() => {
      expect(nameInput).toHaveValue("John Doe");
      expect(emailInput).toHaveValue("johndoe@example.com");
    });
  });

  it("displays validation errors when fields are empty", async () => {
    render(<FormWidget />);

    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Click submit without filling in the form
    fireEvent.click(submitButton);

    // Check that error messages are shown
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
