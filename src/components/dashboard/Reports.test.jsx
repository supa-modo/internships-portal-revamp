import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Reports from "./Reports";
import axiosInstance from "../../services/api";
import {
  generateFullReportPDF,
  generateReportPDF,
} from "../../utils/generateReportPDF";

jest.mock("../../services/api");
jest.mock("../../utils/generateReportPDF");

describe("Reports Component", () => {
  const mockReports = [
    {
      id: 1,
      firstName: "John",
      surname: "Doe",
      department: "ICT",
      status: "approved",
      nationality: "Kenyan",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
    },
  ];

  const mockStats = {
    total: 10,
    approved: 5,
    underReview: 3,
    pending: 2,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    axiosInstance.get.mockImplementation((url) => {
      if (url.includes("stats")) {
        return Promise.resolve({ data: mockStats });
      }
      return Promise.resolve({ data: mockReports });
    });
  });

  it("fetches and displays reports and statistics", async () => {
    render(<Reports />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Total: 10")).toBeInTheDocument();
    });
  });

  it("handles filter changes", async () => {
    render(<Reports />);

    // Open filters
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));

    // Select department filter
    const departmentSelect = screen.getByLabelText(/department/i);
    await userEvent.selectOptions(departmentSelect, "ICT");

    // Apply filters
    await userEvent.click(screen.getByText("Apply Filters"));

    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/internship-applications",
      expect.objectContaining({
        params: expect.objectContaining({ department: "ICT" }),
      })
    );
  });

  it("generates PDF reports", async () => {
    render(<Reports />);

    await waitFor(() => {
      const downloadButton = screen.getByText("Download Full Report");
      fireEvent.click(downloadButton);
    });

    expect(generateFullReportPDF).toHaveBeenCalledWith(mockReports);
  });

  it("handles search functionality", async () => {
    render(<Reports />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, "John");

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("handles pagination", async () => {
    render(<Reports />);

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    await userEvent.click(nextPageButton);

    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/internship-applications",
      expect.objectContaining({
        params: expect.objectContaining({ page: 2 }),
      })
    );
  });
});
