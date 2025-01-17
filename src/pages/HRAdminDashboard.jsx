import React, { useState } from "react";
import Header from "../components/common/Header";
import DataTable from "../components/common/DataTable";
import SideNavbar from "../components/dashboard/SideNavBar";
import Reports from "../components/dashboard/Reports";
import Letters from "../components/dashboard/Letters";
import Policy from "../components/dashboard/Policy";
import ExtendInternship from "../components/dashboard/ExtendInternship";
import { FaCheck } from "react-icons/fa6";
import ApprovalModal from "../components/common/Approval";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("all");
  const [activeFilter, setActiveFilter] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Function to generate columns based on activeSection
  const getColumns = () => {
    const baseColumns = [
      { header: "#", accessor: "id" },
      {
        header: "Applicant Name",
        accessor: "name",
        render: (row) => (
          <span className="font-semibold text-[15px]">{row.applicantName}</span>
        ),
      },
      { header: "Department", accessor: "department" },
      { header: "Phone Number", accessor: "phone" },
      { header: "Nationality", accessor: "nationality" },
      { header: "Start Date", accessor: "startDate" },
      { header: "End Date", accessor: "endDate" },
      {
        header: "Status",
        accessor: "status",
        render: (row) => (
          <span
            className={`px-3 border pb-1.5 pt-1 rounded-lg text-xs ${
              row.status === "pending" ? "bg-yellow-200 text-yellow-800" : ""
            }
              ${
                row.status === "under-review" ? "bg-blue-200 text-blue-800" : ""
              }
              ${row.status === "approved" ? "bg-green-200 text-green-800" : ""}
              ${row.status === "archived" ? "bg-red-200 text-red-600" : ""}`}
          >
            {row.status}
          </span>
        ),
      },
      { header: "Application Date", accessor: "applicationDate" },
    ];

    if (activeSection === "under-review") {
      baseColumns.push({
        header: "Action",
        accessor: "action",
        render: (row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(row);
            }}
            className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            {isApproving && row.id === selectedApplication?.id ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Approving...</span>
              </>
            ) : (
              <>
                <FaCheck className="w-4 h-4" />
                <span>Approve</span>
              </>
            )}
          </button>
        ),
      });
    }

    return baseColumns;
  };

  // Sample data and configurations for the DataTable
  const tableConfig = {
    columns: getColumns(),
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
        applicantName: "John Doe",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "archived",
        applicationDate: "2024-01-01",
      },
      {
        id: 2,
        applicantName: "Johnson Emily D",
        department: "Procurement",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "under-review",
        applicationDate: "2024-01-01",
      },
      {
        id: 3,
        applicantName: "Jane Smith",
        department: "Marketing",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 4,
        applicantName: "Jane Doe",
        department: "Finance",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 5,
        applicantName: "Jane Jane",
        department: "Human Resources",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 6,
        applicantName: "John Brown",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "under-review",
        applicationDate: "2024-01-01",
      },
      {
        id: 7,
        applicantName: "Lilian Joseph",
        department: "International Relations",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "approved",
        applicationDate: "2024-01-01",
      },
      {
        id: 8,
        applicantName: "Lisa Williams",
        department: "Finance",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "archived",
        applicationDate: "2024-01-01",
      },
      {
        id: 9,
        applicantName: "John Doe",
        department: "Operations",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "approved",
        applicationDate: "2024-01-01",
      },
      {
        id: 10,
        applicantName: "Jane Smith",
        department: "Marketing",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 11,
        applicantName: "Jane Doe",
        department: "Finance",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "pending",
        applicationDate: "2024-01-01",
      },
      {
        id: 12,
        applicantName: "Jane Jane",
        department: "Human Resources",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "under-review",
        applicationDate: "2024-01-01",
      },
      {
        id: 13,
        applicantName: "John Brown",
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
        applicantName: "John Brown",
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
        applicantName: "John Brown",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "under-review",
        applicationDate: "2024-01-01",
      },
      {
        id: 16,
        applicantName: "John Brown",
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
        applicantName: "John Brown",
        department: "IT",
        phone: "1234567890",
        nationality: "Kenya",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "under-review",
        applicationDate: "2024-01-01",
      },
    ],
  };

  // Handle menu item clicks
  const handleMenuClick = (section) => {
    setActiveSection(section);
    setActiveFilter(section === "all" ? null : section);
  };

  // Handle approval of an application
  const handleApprove = async (application) => {
    setSelectedApplication(application);
    setIsApproving(true);

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsApproving(false);
    setShowApprovalModal(true);
  };

  // Filter data based on active filter
  const filteredData = tableConfig.data.filter((item) =>
    activeFilter ? item.status === activeFilter : true
  );

  // Function to render the appropriate content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "reports":
        return <Reports />;
      case "policy":
        return <Policy />;
      case "letters":
        return <Letters />;
      case "extend":
        return <ExtendInternship />;
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
            data={filteredData}
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
        <div className="mx-auto">
          <h1 className="text-2xl text-center font-bold text-gray-600 mb-3">
            Human Resource Administration Interface - Internship Applications
          </h1>

          <div className="flex gap-6">
            <SideNavbar
              activeItem={activeSection}
              onMenuClick={handleMenuClick}
            />
            <div className="flex-1 min-h-[calc(100vh-12rem)] rounded-2xl shadow-lg bg-white">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <ApprovalModal
          application={selectedApplication}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
