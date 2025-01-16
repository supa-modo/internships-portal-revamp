import React, { useState } from "react";
import Header from "../components/common/Header";
import DataTable from "../components/common/DataTable";
import SideNavbar from "../components/dashboard/SideNavBar";
import Reports from "../components/dashboard/Reports";
import Letters from "../components/dashboard/Letters";
import Policy from "../components/dashboard/Policy";
import ExtendInternship from "../components/dashboard/ExtendInternship";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("all");
  const [activeFilter, setActiveFilter] = useState(null); // Track active filter
  const [isApproving, setIsApproving] = useState(false); // Track approval loading state
  const [showApprovalModal, setShowApprovalModal] = useState(false); // Track approval modal visibility
  const [selectedApplication, setSelectedApplication] = useState(null); // Track selected application for approval

  // Sample data and configurations for the DataTable
  const tableConfig = {
    columns: [
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
      {
        header: "Action",
        accessor: "action",
        render: (row) =>
          activeSection === "under-review" ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
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
          ) : null,
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
        status: "pending",
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
    ],
  };

  // Handle menu item clicks
  const handleMenuClick = (section) => {
    setActiveSection(section);
    setActiveFilter(section === "all" ? null : section); // Set active filter
  };

  // Handle approval of an application
  const handleApprove = async (application) => {
    setSelectedApplication(application);
    setIsApproving(true);

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsApproving(false);
    setShowApprovalModal(true); // Show approval modal
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowApprovalModal(false)}
          />
          <div className="relative w-full max-w-4xl transform transition-all duration-300 scale-100">
            <div className="w-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] overflow-hidden">
              {/* Header */}
              <div className="px-8 py-4 bg-gradient-to-r from-primary-100 to-primary-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                      Application Approved
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Preview the approved application
                    </p>
                  </div>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                  >
                    <IoClose className="w-6 h-6 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex p-6">
                {/* Document Preview (Gray Placeholder) */}
                <div className="w-1/2 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Document Preview</p>
                </div>

                {/* Application Details */}
                <div className="w-1/2 pl-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedApplication?.applicantName}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Department:</span>{" "}
                      {selectedApplication?.department}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Start Date:</span>{" "}
                      {selectedApplication?.startDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">End Date:</span>{" "}
                      {selectedApplication?.endDate}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="text-green-600">Approved</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
