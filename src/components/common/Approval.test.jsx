import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApprovalModal from "./Approval";
import axiosInstance from "../../services/api";
import {
  generateAcceptanceLetter,
  generateExtensionLetter,
} from "../../utils/generateLetters";

jest.mock("../../services/api");
jest.mock("../../utils/generateLetters");

describe("ApprovalModal Component", () => {
  const mockApplication = {
    id: 1,
    firstName: "John",
    surname: "Doe",
    internshipDepartment: "ICT",
    internshipStartDate: "2024-01-01",
    internshipEndDate: "2024-06-30",
    newEndDate: "2024-12-31",
    requestDate: "2024-06-01",
    onDataChange: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    generateAcceptanceLetter.mockReturnValue("mock-acceptance-letter");
    generateExtensionLetter.mockReturnValue("mock-extension-letter");
  });

  it("renders approval modal with correct content", () => {
    render(
      <ApprovalModal
        application={mockApplication}
        onClose={jest.fn()}
        type="approval"
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("ICT")).toBeInTheDocument();
    expect(screen.getByText("Approving")).toBeInTheDocument();
  });

  it("handles approval submission successfully", async () => {
    axiosInstance.patch.mockResolvedValueOnce({ data: { success: true } });

    render(
      <ApprovalModal
        application={mockApplication}
        onClose={jest.fn()}
        type="approval"
      />
    );

    await userEvent.click(screen.getByText("Finish Approval Processing"));

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        "/internship-applications/1/approve",
        { status: "approved" }
      );
    });

    expect(mockApplication.onDataChange).toHaveBeenCalled();
  });

  it("handles extension submission successfully", async () => {
    axiosInstance.patch.mockResolvedValueOnce({ data: { success: true } });

    render(
      <ApprovalModal
        application={mockApplication}
        onClose={jest.fn()}
        type="extension"
      />
    );

    await userEvent.click(screen.getByText("Finish Extension Processing"));

    await waitFor(() => {
      expect(axiosInstance.patch).toHaveBeenCalledWith(
        "/internship-applications/1/extend",
        {
          newEndDate: "2024-12-31",
          requestDate: "2024-06-01",
        }
      );
    });
  });

  it("handles submission errors gracefully", async () => {
    axiosInstance.patch.mockRejectedValueOnce(new Error("API Error"));

    render(
      <ApprovalModal
        application={mockApplication}
        onClose={jest.fn()}
        type="approval"
      />
    );

    await userEvent.click(screen.getByText("Finish Approval Processing"));

    await waitFor(() => {
      expect(
        screen.getByText("Failed to process the request")
      ).toBeInTheDocument();
    });
  });
});
