import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import SuperAdmin from "./SuperAdmin";
import axiosInstance from "../../services/api";

jest.mock("../../services/api");

describe("SuperAdmin Component", () => {
  const mockUsers = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "user",
      createdAt: "2023-01-01",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      role: "admin",
      createdAt: "2023-02-01",
    },
  ];

  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockUsers });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders user list correctly", async () => {
    await act(async () => {
      render(<SuperAdmin />);
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("handles user search", async () => {
    await act(async () => {
      render(<SuperAdmin />);
    });

    const searchInput = screen.getByPlaceholderText("Search users...");
    await userEvent.type(searchInput, "John");

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("handles role filter", async () => {
    await act(async () => {
      render(<SuperAdmin />);
    });

    const adminFilter = screen.getByText("Admin");
    await userEvent.click(adminFilter);

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles user deletion", async () => {
    axiosInstance.delete.mockResolvedValueOnce({
      data: { message: "User deleted successfully" },
    });
    render(<SuperAdmin />);

    await waitFor(() => {
      const deleteButton = screen.getAllByRole("button", {
        name: /delete/i,
      })[0];
      fireEvent.click(deleteButton);
    });

    const confirmButton = screen.getByText("Confirm");
    await userEvent.click(confirmButton);

    expect(axiosInstance.delete).toHaveBeenCalledWith("/system-users/users/1");
  });

  it("handles password reset", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: { message: "Password reset successful" },
    });
    render(<SuperAdmin />);

    await waitFor(() => {
      const resetButton = screen.getAllByRole("button", {
        name: /reset password/i,
      })[0];
      fireEvent.click(resetButton);
    });

    expect(screen.getByText("Reset Password Confirmation")).toBeInTheDocument();
  });

  it("handles email update", async () => {
    axiosInstance.put.mockResolvedValueOnce({
      data: { message: "Email updated successfully" },
    });
    render(<SuperAdmin />);

    await waitFor(() => {
      const updateEmailButton = screen.getAllByRole("button", {
        name: /update email/i,
      })[0];
      fireEvent.click(updateEmailButton);
    });

    const emailInput = screen.getByPlaceholderText("Enter new email");
    await userEvent.type(emailInput, "newemail@example.com");

    const confirmButton = screen.getByText("Confirm");
    await userEvent.click(confirmButton);

    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/system-users/users/1/email",
      {
        email: "newemail@example.com",
      }
    );
  });

  it("handles API errors gracefully", async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error("Failed to fetch users"));
    render(<SuperAdmin />);

    await waitFor(() => {
      expect(screen.getByText("Error fetching users")).toBeInTheDocument();
    });
  });

  it("handles adding new user", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      data: { message: "User created successfully" },
    });

    render(<SuperAdmin />);

    const addUserButton = screen.getByText("Add New User");
    await userEvent.click(addUserButton);

    await userEvent.type(screen.getByPlaceholderText("First Name"), "New");
    await userEvent.type(screen.getByPlaceholderText("Last Name"), "User");
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "new@example.com"
    );
    await userEvent.selectOptions(screen.getByLabelText("Role"), "user");

    const submitButton = screen.getByText("Create User");
    await userEvent.click(submitButton);

    expect(axiosInstance.post).toHaveBeenCalledWith("/system-users/users", {
      firstName: "New",
      lastName: "User",
      email: "new@example.com",
      role: "user",
    });
  });
});
