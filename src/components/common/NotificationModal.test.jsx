import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationModal from "./NotificationModal";

describe("NotificationModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: "Test Title",
    message: "Test Message",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders different types of notifications correctly", () => {
    const types = ["confirm", "success", "error", "info"];

    types.forEach((type) => {
      const { unmount } = render(
        <NotificationModal {...defaultProps} type={type} />
      );
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Test Message")).toBeInTheDocument();
      unmount();
    });
  });

  it("handles confirmation type with both buttons", () => {
    render(<NotificationModal {...defaultProps} type="confirm" />);

    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("closes on backdrop click", () => {
    render(<NotificationModal {...defaultProps} />);

    const backdrop = screen.getByRole("presentation");
    fireEvent.click(backdrop);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("closes on X button click", () => {
    render(<NotificationModal {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    render(<NotificationModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });
});
