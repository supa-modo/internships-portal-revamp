import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ExtendInternship from "./ExtendInternship";
import axiosInstance from "../../services/api";

// Mock the axios instance
jest.mock("../../services/api");

// Mock child components
jest.mock("../common/DataTable", () => {
  return function MockDataTable({ onRowClick, data }) {
    return (
      <div data-testid="mock-datatable">
        {data.map((item, index) => (
          <div
            key={index}
            data-testid="table-row"
            onClick={(e) => onRowClick(item, e)}
          >
            {item.firstName} {item.surname}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("../common/ExtendInternshipModal", () => {
  return function MockExtensionModal({ onSubmit }) {
    return (
      <div data-testid="mock-extension-modal">
        <button onClick={() => onSubmit("2024-12-31", "2024-06-01")}>
          Submit Extension
        </button>
      </div>
    );
  };
});

const mockInternships = [
  {
    id: 1,
    firstName: "John",
    surname: "Doe",
    internshipDepartment: "ICT",
    internshipSupervisor: "Jane Smith",
    internshipStartDate: "2024-01-01",
    internshipEndDate: "2024-06-30",
  },
];

describe("ExtendInternship Component", () => {
  beforeEach(() => {
    // Clear mock calls between tests
    axiosInstance.get.mockClear();
    axiosInstance.post.mockClear();
  });

  it("fetches and displays internships on mount", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockInternships });

    render(
      <BrowserRouter>
        <ExtendInternship />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/internship-applications",
        {
          params: { status: "approved" },
        }
      );
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("handles row click to show application details", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockInternships });

    render(
      <BrowserRouter>
        <ExtendInternship />
      </BrowserRouter>
    );

    await waitFor(() => {
      const row = screen.getByTestId("table-row");
      fireEvent.click(row);
    });

    // Verify application details modal is shown
    expect(screen.getByTestId("mock-datatable")).toBeInTheDocument();
  });

  it("handles extension submission successfully", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockInternships });
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

    render(
      <BrowserRouter>
        <ExtendInternship />
      </BrowserRouter>
    );

    // Click extend button to show modal
    await waitFor(() => {
      const row = screen.getByTestId("table-row");
      fireEvent.click(row);
    });

    // Submit extension
    const submitButton = screen.getByText("Submit Extension");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/api/internship-applications/1/extend",
        {
          newEndDate: "2024-12-31",
          requestDate: "2024-06-01",
        }
      );
    });
  });

  it("handles API errors gracefully", async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error("API Error"));

    render(
      <BrowserRouter>
        <ExtendInternship />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching internships:",
        expect.any(Error)
      );
    });
  });

  it("refreshes data when refresh button is clicked", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockInternships });

    render(
      <BrowserRouter>
        <ExtendInternship />
      </BrowserRouter>
    );

    // Initial fetch
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledTimes(1);
    });

    // Trigger refresh
    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    fireEvent.click(refreshButton);

    // Verify second fetch
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalledTimes(2);
    });
  });
});
