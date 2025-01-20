import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Letters from "./Letters";
import axiosInstance from "../../services/api";

jest.mock("../../services/api");

describe("Letters Component", () => {
  const mockLetters = [
    {
      id: 1,
      applicantName: "John Doe",
      department: "ICT",
      letterType: "Acceptance",
      createdAt: "2024-01-01",
    },
  ];

  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({ data: mockLetters });
  });

  it("fetches and displays letters", async () => {
    render(<Letters />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("handles file upload", async () => {
    render(<Letters />);

    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    const uploadButton = screen.getByText("Upload New Letter");

    await userEvent.click(uploadButton);

    const fileInput = screen.getByLabelText(/upload file/i);
    await userEvent.upload(fileInput, file);

    expect(fileInput.files[0]).toBe(file);
  });

  it("handles letter deletion", async () => {
    axiosInstance.delete.mockResolvedValueOnce({ status: 200 });
    render(<Letters />);

    await waitFor(() => {
      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);
    });

    // Confirm deletion
    const confirmButton = screen.getByText("Confirm");
    await userEvent.click(confirmButton);

    expect(axiosInstance.delete).toHaveBeenCalledWith("/signed-letters/1");
  });

  it("handles letter download", async () => {
    const mockBlob = new Blob(["dummy content"], { type: "application/pdf" });
    axiosInstance.get.mockResolvedValueOnce({ data: mockBlob });

    render(<Letters />);

    const downloadButton = screen.getByRole("button", { name: /download/i });
    await userEvent.click(downloadButton);

    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/signed-letters/1/download",
      { responseType: "blob" }
    );
  });
});
