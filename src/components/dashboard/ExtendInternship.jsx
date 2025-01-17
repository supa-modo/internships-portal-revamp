import React, { useState, useEffect } from "react";
import DataTable from "../common/DataTable";
import ExtensionModal from "../common/ExtendInternshipModal";
import { TbArrowMoveRight } from "react-icons/tb";
import { axiosInstance } from "../../services/api";
import { formatDate } from "../../utils/dateFormatter";
import ApplicationDetails from "../dashboard/ApplicationDetails";

const ExtendInternship = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      // Only fetch approved applications
      const response = await axiosInstance.get("/internship-applications", {
        params: {
          status: "approved",
        },
      });
      setInternships(response.data);
    } catch (error) {
      console.error("Error fetching internships:", error);
    }
  };

  const handleRowClick = (internship, event) => {
    if (
      event.target.closest("button") || // Check if the click is on a button
      event.target.closest("td:last-child") // Check if the click is in the last column
    ) {
      return;
    }
    setSelectedInternship(internship);
    setShowApplicationDetails(true);
  };

  const handleExtend = (internship) => {
    setSelectedInternship(internship);
    setShowExtensionModal(true);
  };

  const columns = [
    {
      header: "#",
      accessor: "index", // Use a custom accessor
      render: (row, index) => (
        <span>{index + 1}</span> // Display the row index + 1 (since index starts at 0)
      ),
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
    { header: "Department", accessor: "internshipDepartment" },
    { header: "Phone Number", accessor: "phoneNumber" },
    { header: "Nationality", accessor: "nationality" },
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
      header: "Action",
      accessor: "action",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleExtend(row);
          }}
          className="px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          {isExtending && row.id === selectedInternship?.id ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Extending...</span>
            </>
          ) : (
            <>
              <TbArrowMoveRight className="w-5 h-5" />
              <span>Extend</span>
            </>
          )}
        </button>
      ),
    },
  ];

  const handleExtensionSubmit = async ({ newEndDate, requestDate }) => {
    try {
      await axios.patch(
        `/api/internship-applications/${selectedInternship.id}/extend`,
        {
          newEndDate,
          requestDate,
        }
      );

      fetchInternships(); // Refresh the list
      setShowExtensionModal(false);
    } catch (error) {
      console.error("Error extending internship:", error);
    }
  };

  return (
    <>
      <DataTable
  title="Extend Internship Periods"
  columns={columns}
  data={internships}
  searchPlaceholder="Search approved internships..."
  onRowClick={(item, event) => handleRowClick(item, event)} 
/>

      {/* Application Details Modal */}
      {selectedInternship && showApplicationDetails && (
        <ApplicationDetails
          application={selectedInternship}
          isOpen={showApplicationDetails}
          onClose={() => {
            setShowApplicationDetails(false);
            setSelectedInternship(null);
          }}
        />
      )}

      {/* Extension Modal */}
      {selectedInternship && showExtensionModal && (
        <ExtensionModal
          isOpen={showExtensionModal}
          onClose={() => {
            setShowExtensionModal(false);
            setSelectedInternship(null);
          }}
          internship={selectedInternship} // Pass the entire internship object
          onSubmit={handleExtensionSubmit}
        />
      )}
    </>
  );
};

export default ExtendInternship;
