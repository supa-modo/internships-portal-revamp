import React, { useState } from "react";
import DataTable from "../common/DataTable";
import ExtensionModal from "../common/ExtendInternshipModal";
import { TbArrowMoveRight } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";

const ExtendInternship = () => {
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const columns = [
    { header: "#", accessor: "id" },
    {
      header: "Applicant Name",
      accessor: "applicantName",
      render: (row) => (
        <span className="font-semibold text-[15px]">{row.applicantName}</span>
      ),
    },
    { header: "Department", accessor: "department" },
    { header: "Phone Number", accessor: "phone" },
    { header: "Nationality", accessor: "nationality" },
    { header: "Internship Start Date", accessor: "startDate" },
    { header: "Internship End Date", accessor: "endDate" },
    { header: "Application Date", accessor: "applicationDate" },
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

  const handleExtensionSubmit = ({ newEndDate, requestDate }) => {
    // Handle the extension submission here
    console.log("Extension submitted:", {
      internship: selectedInternship,
      newEndDate,
      requestDate,
    });
  };

  const sampleData = [
    {
      id: 1,
      applicantName: "John Doe",
      department: "Human Resource",
      phone: "+254712345678",
      nationality: "Kenyan",
      startDate: "2023-09-01",
      endDate: "2023-12-31",
      applicationDate: "2023-08-15",
    },
    {
      id: 2,
      applicantName: "Jane Smith",
      department: "Finance",
      phone: "+254723456789",
      nationality: "Ugandan",
      startDate: "2023-10-01",
      endDate: "2024-01-31",
      applicationDate: "2023-09-10",
    },
    {
      id: 3,
      applicantName: "Alice Johnson",
      department: "IT",
      phone: "+254734567890",
      nationality: "Tanzanian",
      startDate: "2023-11-01",
      endDate: "2024-02-28",
      applicationDate: "2023-10-05",
    },
    {
      id: 4,
      applicantName: "Bob Brown",
      department: "Procurement",
      phone: "+254745678901",
      nationality: "Rwandan",
      startDate: "2023-12-01",
      endDate: "2024-03-31",
      applicationDate: "2023-11-20",
    },
    {
      id: 5,
      applicantName: "Charlie Davis",
      department: "Human Resource",
      phone: "+254756789012",
      nationality: "Kenyan",
      startDate: "2024-01-01",
      endDate: "2024-04-30",
      applicationDate: "2023-12-15",
    },
  ];

  return (
    <>
      <DataTable
        title="Extend Internship Periods"
        columns={columns}
        data={sampleData} // Pass the sample data here
        searchPlaceholder="Search internships..."
        onRowClick={(row) => {
          // Handle row click to show application details
          console.log("Row clicked:", row);
        }}
      />

      <ExtensionModal
        isOpen={showExtensionModal}
        onClose={() => setShowExtensionModal(false)}
        internship={selectedInternship}
        onSubmit={handleExtensionSubmit}
      />
    </>
  );
};

export default ExtendInternship;
