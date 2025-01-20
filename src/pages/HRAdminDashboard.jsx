import React, { useState, useEffect, useRef } from "react";
import Header from "../components/common/Header";
import DataTable from "../components/common/DataTable";
import SideNavbar from "../components/dashboard/SideNavBar";
import Reports from "../components/dashboard/Reports";
import Letters from "../components/dashboard/Letters";
import Policy from "../components/dashboard/Policy";
import ExtendInternship from "../components/dashboard/ExtendInternship";
import { FaCheck } from "react-icons/fa6";
import ApprovalModal from "../components/common/Approval";
import ApplicationDetails from "../components/dashboard/ApplicationDetails";
import axiosInstance from "../services/api";
import Footer from "../components/common/Footer";
import NotificationModal from "../components/common/NotificationModal";
import SuperAdmin from "../components/dashboard/SuperAdmin";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("all");
  const [isApproving, setIsApproving] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const dataTableRef = useRef(null);

  useEffect(() => {
    fetchApplications();
    const fetchUserRole = async () => {
      try {
        const response = await axiosInstance.get("/system-users/users/me");
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get("/internship-applications/", {
        params: {
          status: ["extend", "letters", "super-admin"].includes(activeSection)
            ? "approved"
            : "reports".includes(activeSection)
            ? "all"
            : activeSection !== "all"
            ? activeSection
            : undefined,
        },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const getColumns = () => {
    const baseColumns = [
      {
        header: "#",
        accessor: "index",
        render: (row, index) => <span>{index + 1}</span>,
      },
      {
        header: "Applicant Name",
        accessor: "name",
        render: (row) => (
          <span className="font-semibold text-[15px]">
            {`${row.firstName} ${row.surname}`}
          </span>
        ),
      },
      {
        header: "Department",
        accessor: "internshipDepartment",
      },
      {
        header: "Nationality",
        accessor: "nationality",
      },
      {
        header: "Start Date",
        accessor: "internshipStartDate",
        isDate: true,
      },
      {
        header: "End Date",
        accessor: "internshipEndDate",
        isDate: true,
      },
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
    ];

    if (activeSection === "under-review") {
      baseColumns.splice(3, 0, {
        header: "Supervisor",
        accessor: "supervisor",
        render: (row) => <span>{row.internshipSupervisor || "N/A"}</span>,
      });

      baseColumns.splice(
        baseColumns.findIndex((col) => col.accessor === "phoneNumber"),
        1
      );
      // baseColumns.splice(
      //   baseColumns.findIndex((col) => col.accessor === "createdAt"),
      //   1
      // );

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
    } else {
      baseColumns.splice(3, 0, {
        header: "Phone Number",
        accessor: "phoneNumber",
      });
      baseColumns.push({
        header: "Application Date",
        accessor: "createdAt",
        isDate: true,
      });
    }

    return baseColumns;
  };

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
  };

  const handleMenuClick = async (section) => {
    setActiveSection(section);

    // Reset DataTable state
    if (dataTableRef.current) {
      dataTableRef.current.resetFilters();
    }

    // Fetch new data for the section
    try {
      const response = await axiosInstance.get("/internship-applications/", {
        params: {
          status: ["extend", "letters", "super-admin"].includes(section)
            ? "approved"
            : "reports".includes(section)
            ? "all"
            : section !== "all"
            ? section
            : undefined,
        },
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleApprove = async (application) => {
    setSelectedApplication(application);
    setIsApproving(true);
    setShowApprovalModal(true);
  };

  const handleRowClick = (application, event) => {
    if (
      activeSection === "under-review" &&
      (event.target.closest("button") || event.target.closest("td:last-child"))
    ) {
      handleApprove(application);
      return;
    }

    setSelectedApplication(application);
  };

  const handleRefresh = async () => {
    try {
      await fetchApplications();
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  const handleSuperAdminAccess = () => {
    if (userRole !== "admin") {
      return false;
    }
    return true;
  };

  const handleAccessDeniedClose = () => {
    setShowAccessDenied(false);
    navigate("/");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "reports":
        return <Reports />;
      case "policy":
        return <Policy />;
      case "letters":
        return <Letters />;
      case "extend":
        return <ExtendInternship applications={applications} />;
      case "super-admin":
        if (!handleSuperAdminAccess()) {
          setTimeout(() => {
            setShowAccessDenied(true);
          }, 0);
          return null;
        }
        return <SuperAdmin />;
      case "all":
      case "under-review":
      case "pending":
      case "approved":
      case "archived":
        return (
          <>
            <DataTable
              ref={dataTableRef}
              title={`${
                activeSection.charAt(0).toUpperCase() + activeSection.slice(1)
              } Internship Applications`}
              columns={tableConfig.columns}
              data={applications}
              filters={tableConfig.filters}
              searchPlaceholder="Search internship applications..."
              onRowClick={handleRowClick}
              onRefresh={fetchApplications}
              activeSection={activeSection}
            />
            {selectedApplication && (
              <ApplicationDetails
                application={selectedApplication}
                isOpen={!!selectedApplication}
                onClose={() => setSelectedApplication(null)}
              />
            )}
          </>
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
    <div className="min-h-screen bg-gray-100 ">
      <Header />
      <div className="px-10 py-4 mb-14">
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
      {showApprovalModal && (
        <ApprovalModal
          application={selectedApplication}
          onClose={() => setShowApprovalModal(false)}
          type="approval"
        />
      )}
      <Footer />
      <NotificationModal
        isOpen={showAccessDenied}
        onClose={handleAccessDeniedClose}
        type="error"
        title="Access Denied"
        message="You do not have permission to access this section. Please contact your system administrator for access."
      />
    </div>
  );
};

export default DashboardLayout;
