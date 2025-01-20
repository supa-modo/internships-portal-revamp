import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HRAdminDashboard from "./HRAdminDashboard";
import axiosInstance from "../services/api";

jest.mock("../services/api");

describe("HRAdminDashboard Component", () => {
  const mockApplications = [
    {
      id: 1,
      firstName: "John",
      surname: "Doe",
      status: "pending",
      internshipDepartment: "IT",
      nationality: "Kenyan",
      internshipStartDate: "2024-01-01",
      internshipEndDate: "2024-06-30",
      phoneNumber: "+254712345678",
      createdAt: "2023-12-01",
    },
    {
      id: 2,
      firstName: "Jane",
      surname: "Smith",
      status: "approved",
      internshipDepartment: "HR",
      nationality: "Ugandan",
      internshipStartDate: "2024-02-01",
      internshipEndDate: "2024-07-31",
      phoneNumber: "+256712345678",
      createdAt: "2023-12-15",
    },
  ];

  beforeEach(() => {
    axiosInstance.get.mockImplementation((url) => {
      if (url.includes("users/me")) {
        return Promise.resolve({ data: { role: "admin" } });
      }
      if (url.includes("internship-applications")) {
        return Promise.resolve({ data: mockApplications });
      }
      return Promise.resolve({ data: [] });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("loads and displays applications correctly", async () => {
    renderWithRouter(<HRAdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("handles section navigation correctly", async () => {
    renderWithRouter(<HRAdminDashboard />);

    const sections = ["Pending", "Approved", "Under Review", "Reports"];
    for (const section of sections) {
      const sectionButton = screen.getByText(section);
      await userEvent.click(sectionButton);
      expect(axiosInstance.get).toHaveBeenCalledWith(
        "/internship-applications/",
        expect.any(Object)
      );
    }
  });

  it("handles application approval correctly", async () => {
    renderWithRouter(<HRAdminDashboard />);

    const underReviewSection = screen.getByText("Under Review");
    await userEvent.click(underReviewSection);

    const approveButton = screen.getByText("Approve");
    await userEvent.click(approveButton);

    expect(screen.getByText("Approval Confirmation")).toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error("API Error"));
    renderWithRouter(<HRAdminDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText("Error fetching applications")
      ).toBeInTheDocument();
    });
  });

  it("restricts access based on user role", async () => {
    axiosInstance.get.mockImplementationOnce((url) => {
      if (url.includes("users/me")) {
        return Promise.resolve({ data: { role: "user" } });
      }
      return Promise.resolve({ data: mockApplications });
    });

    renderWithRouter(<HRAdminDashboard />);

    const superAdminSection = screen.getByText("Super Admin");
    await userEvent.click(superAdminSection);

    expect(screen.getByText("Access Denied")).toBeInTheDocument();
  });

  it("handles search functionality correctly", async () => {
    renderWithRouter(<HRAdminDashboard />);

    const searchInput = screen.getByPlaceholderText(
      "Search internship applications..."
    );
    await userEvent.type(searchInput, "John");

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("shows application details on row click", async () => {
    renderWithRouter(<HRAdminDashboard />);

    await waitFor(() => {
      const applicationRow = screen.getByText("John Doe").closest("tr");
      fireEvent.click(applicationRow);
    });

    expect(screen.getByText("Application Details")).toBeInTheDocument();
  });
});
