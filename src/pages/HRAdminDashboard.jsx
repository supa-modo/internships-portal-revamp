import React, { useState } from "react";
import Header from "../components/common/Header";
import DataTable from "../components/common/DataTable";
import SideNavbar from "../components/dashboard/SideNavBar";
import Reports from "../components/dashboard/Reports";
import Letters from "../components/dashboard/Letters";
import Policy from "../components/dashboard/Policy";


const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("all");

  // Sample data and configurations for the DataTable
  const tableConfig = {
    columns: [
      { header: "#", accessor: "id" },
      { header: "Applicant Name", accessor: "name" },
      { header: "Department", accessor: "department" },
      { header: "Phone Number", accessor: "phone" },
      { header: "Nationality", accessor: "nationality" },
      { header: "Start Date", accessor: "startDate" },
      { header: "End Date", accessor: "endDate" },
      { header: "Status", accessor: "status" },
      { header: "Application Date", accessor: "applicationDate" },
      {
        header: "Action",
        accessor: "action",
        render: () => (
          <button className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
            View
          </button>
        ),
      },
    ],
    filters: [
      {
        key: "status",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
          { label: "Archived", value: "archived" },
        ],
      },
    ],
    data: [
      {
        id: 1,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 2,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 3,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 4,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 5,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 6,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 7,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 8,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 9,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 10,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 11,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 12,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 13,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 14,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 15,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 16,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 17,
        name: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      // Add more sample data as needed
    ],
  };

  // Function to render the appropriate content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "reports":
        return <Reports />;
      case "policy":
        return <Policy />;
      case "letters":
        return <Letters />;
      case "all":
      case "under-review":
      case "pending":
      case "approved":
      case "archived":
        return (
          <DataTable
            title={`${
              activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
            } Internship Applications`}
            columns={tableConfig.columns}
            data={tableConfig.data}
            filters={tableConfig.filters}
            searchPlaceholder="Search internship applications..."
            onRowClick={(item) => console.log("Clicked:", item)}
          />
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            <p className="text-gray-600 mt-4">Content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="px-10 py-4">
        <div className=" mx-auto">
          <h1 className="text-2xl text-center font-bold text-gray-600 mb-3">
            Human Resource Administration Interface - Internship Applications
          </h1>

          <div className="flex gap-6">
            <SideNavbar
              activeItem={activeSection}
              onMenuClick={(section) => setActiveSection(section)}
            />
            <div className="flex-1 min-h-[calc(100vh-12rem)] rounded-2xl shadow-lg bg-white">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
