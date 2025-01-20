import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import Header from "./Header";

jest.mock("../../context/AuthContext", () => ({
  ...jest.requireActual("../../context/AuthContext"),
  useAuth: () => ({
    user: { role: "admin" },
    logout: jest.fn(),
  }),
}));

describe("Header Component", () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it("renders logo and navigation links", () => {
    renderHeader();
    expect(screen.getByAltText("EAC Logo")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("toggles mobile menu when hamburger button is clicked", () => {
    renderHeader();
    const menuButton = screen.getByRole("button", { name: /menu/i });

    fireEvent.click(menuButton);
    expect(screen.getByText("Admin Login")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(screen.queryByText("Admin Login")).not.toBeInTheDocument();
  });

  it("displays social media links", () => {
    renderHeader();
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks.length).toBeGreaterThan(0);
    expect(screen.getByTitle("Facebook")).toBeInTheDocument();
    expect(screen.getByTitle("Twitter")).toBeInTheDocument();
  });

  it("handles user logout", async () => {
    renderHeader();
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    // Verify logout function was called
    expect(useAuth().logout).toHaveBeenCalled();
  });
});
