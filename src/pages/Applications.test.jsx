import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Applications from "./Applications";
import axiosInstance from "../services/api";

jest.mock("../services/api");

describe("Applications Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderApplications = () => {
    return render(
      <BrowserRouter>
        <Applications />
      </BrowserRouter>
    );
  };

  it("renders all form sections and progress indicator", () => {
    renderApplications();

    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Academic Information")).toBeInTheDocument();
    expect(screen.getByText("Insurance Information")).toBeInTheDocument();
    expect(screen.getByText("Emergency Contact")).toBeInTheDocument();
    expect(screen.getByText("Internship Details")).toBeInTheDocument();
  });

  it("handles form navigation between steps", async () => {
    renderApplications();

    // Fill personal info and move to next step
    await userEvent.type(screen.getByLabelText(/First Name/i), "John");
    await userEvent.type(screen.getByLabelText(/Surname/i), "Doe");
    await userEvent.click(screen.getByText("Next"));

    // Verify we're on academic info step
    expect(screen.getByText("Academic Information")).toBeInTheDocument();

    // Go back to previous step
    await userEvent.click(screen.getByText("Previous"));
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  it("validates required fields before proceeding", async () => {
    renderApplications();

    // Try to proceed without filling required fields
    await userEvent.click(screen.getByText("Next"));

    // Check for validation messages
    expect(screen.getByText("First Name is required")).toBeInTheDocument();
    expect(screen.getByText("Surname is required")).toBeInTheDocument();
  });

  it("handles file uploads correctly", async () => {
    renderApplications();

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    const fileInput = screen.getByLabelText(/Upload Identification Document/i);

    await userEvent.upload(fileInput, file);
    expect(fileInput.files[0]).toBe(file);
  });

  it("submits form successfully", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { id: 1 } });
    renderApplications();

    // Fill all required fields
    // Personal Info
    await userEvent.type(screen.getByLabelText(/First Name/i), "John");
    await userEvent.type(screen.getByLabelText(/Surname/i), "Doe");
    await userEvent.click(screen.getByText("Next"));

    // Complete all steps...
    // Submit form
    await userEvent.click(screen.getByText("Submit Application"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/internship-applications",
        expect.any(FormData)
      );
    });
  });

  it("handles submission errors gracefully", async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error("Submission failed"));
    renderApplications();

    // Fill form and submit
    // ... fill form steps
    await userEvent.click(screen.getByText("Submit Application"));

    await waitFor(() => {
      expect(
        screen.getByText("Error submitting application")
      ).toBeInTheDocument();
    });
  });
});
