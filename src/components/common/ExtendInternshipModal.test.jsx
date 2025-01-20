import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExtensionModal from "./ExtendInternshipModal";

// Mock the generateExtensionLetter utility
jest.mock("../../utils/generateLetters", () => ({
  generateExtensionLetter: jest.fn().mockReturnValue("mock-letter-pdf"),
}));

describe("ExtensionModal Component", () => {
  const mockInternship = {
    id: 1,
    firstName: "John",
    surname: "Doe",
    internshipDepartment: "ICT",
    internshipSupervisor: "Jane Smith",
    internshipStartDate: "2024-01-01",
    internshipEndDate: "2024-06-30",
  };

  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    internship: mockInternship,
    onSubmit: jest.fn(),
    onDataChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with internship details", () => {
    render(<ExtensionModal {...mockProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("ICT")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    render(<ExtensionModal {...mockProps} />);

    // Fill in the form
    const newEndDateInput = screen.getByLabelText(/new end date/i);
    const requestDateInput = screen.getByLabelText(/request letter date/i);

    await userEvent.type(newEndDateInput, "2024-12-31");
    await userEvent.type(requestDateInput, "2024-06-01");

    // Submit form
    const submitButton = screen.getByText("Extend Internship");
    await userEvent.click(submitButton);

    expect(mockProps.onSubmit).toHaveBeenCalledWith({
      newEndDate: "2024-12-31",
      requestDate: "2024-06-01",
    });
  });

  it("validates required fields", async () => {
    render(<ExtensionModal {...mockProps} />);

    // Submit without filling required fields
    const submitButton = screen.getByText("Extend Internship");
    await userEvent.click(submitButton);

    expect(screen.getByText("New end date is required")).toBeInTheDocument();
    expect(screen.getByText("Request date is required")).toBeInTheDocument();
  });

  it("closes modal when cancel button is clicked", () => {
    render(<ExtensionModal {...mockProps} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockProps.onClose).toHaveBeenCalled();
  });
});
