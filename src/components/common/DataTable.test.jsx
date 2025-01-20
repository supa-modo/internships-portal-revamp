import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DataTable from "./DataTable";

describe("DataTable Component", () => {
  const mockData = [
    {
      id: 1,
      name: "John Doe",
      department: "IT",
      status: "pending",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      department: "HR",
      status: "approved",
      email: "jane@example.com",
    },
    { id: 3, name: "", department: null, status: "pending", email: undefined },
  ];

  const mockColumns = [
    {
      header: "#",
      accessor: "index",
      render: (row, index) => <span>{index + 1}</span>,
    },
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Status", accessor: "status" },
    { header: "Email", accessor: "email" },
  ];

  const mockFilters = {
    status: ["pending", "approved", "rejected"],
    department: ["IT", "HR", "Finance"],
  };

  it("renders table with correct data", () => {
    render(
      <DataTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
      />
    );

    expect(screen.getByText("Test Table")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles search functionality", async () => {
    render(
      <DataTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    await userEvent.type(searchInput, "John");

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("handles filter selection", async () => {
    render(
      <DataTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
      />
    );

    const filterButton = screen.getByText("pending");
    await userEvent.click(filterButton);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("handles sorting", async () => {
    render(
      <DataTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
      />
    );

    const nameHeader = screen.getByText("Name");
    await userEvent.click(nameHeader);

    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Jane Smith");
    expect(rows[2]).toHaveTextContent("John Doe");
  });

  it("renders empty state when no data is provided", () => {
    render(
      <DataTable
        title="Empty Table"
        columns={mockColumns}
        data={[]}
        filters={mockFilters}
      />
    );
    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("handles pagination with different page sizes", async () => {
    const largeDataSet = Array.from({ length: 55 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      department: "IT",
      status: "pending",
    }));

    render(
      <DataTable
        title="Large Dataset"
        columns={mockColumns}
        data={largeDataSet}
        filters={mockFilters}
      />
    );

    const pageSizeSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(pageSizeSelect, "50");
    expect(
      screen.getByText("Showing 1 to 50 of 55 entries")
    ).toBeInTheDocument();
  });

  it("handles multiple active filters simultaneously", async () => {
    render(
      <DataTable
        title="Multi-Filter Test"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
      />
    );

    const itFilter = screen.getByText("IT");
    await userEvent.click(itFilter);

    const pendingFilter = screen.getByText("pending");
    await userEvent.click(pendingFilter);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
  });

  it("handles sorting with null/undefined values", async () => {
    render(
      <DataTable
        title="Sort Test"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
      />
    );

    const departmentHeader = screen.getByText("Department");
    await userEvent.click(departmentHeader);

    const rows = screen.getAllByRole("row");
    expect(rows[rows.length - 1]).toHaveTextContent("");
  });

  it("handles search with special characters and partial matches", async () => {
    const dataWithSpecialChars = [
      ...mockData,
      {
        id: 4,
        name: "John (Dev)",
        department: "IT&Systems",
        status: "pending",
      },
      { id: 5, name: "Jane & Co.", department: "HR", status: "approved" },
    ];

    render(
      <DataTable
        title="Search Test"
        columns={mockColumns}
        data={dataWithSpecialChars}
        filters={mockFilters}
      />
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    await userEvent.type(searchInput, "(Dev)");
    expect(screen.getByText("John (Dev)")).toBeInTheDocument();
    expect(screen.queryByText("Jane & Co.")).not.toBeInTheDocument();
  });

  it("handles row click events correctly", async () => {
    const mockRowClick = jest.fn();
    render(
      <DataTable
        title="Click Test"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRowClick={mockRowClick}
      />
    );

    const firstRow = screen.getByText("John Doe").closest("tr");
    await userEvent.click(firstRow);
    expect(mockRowClick).toHaveBeenCalledWith(mockData[0], expect.any(Object));
  });

  it("handles refresh button click", async () => {
    const mockRefresh = jest.fn();
    render(
      <DataTable
        title="Refresh Test"
        columns={mockColumns}
        data={mockData}
        filters={mockFilters}
        onRefresh={mockRefresh}
      />
    );

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    await userEvent.click(refreshButton);
    expect(mockRefresh).toHaveBeenCalled();
  });
});
