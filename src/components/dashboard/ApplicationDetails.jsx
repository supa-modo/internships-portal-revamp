import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaFilePdf,
  FaBriefcase,
  FaGraduationCap,
  FaShieldAlt,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { LuMail } from "react-icons/lu";
import { HiMiniDevicePhoneMobile, HiHomeModern } from "react-icons/hi2";
import NotificationModal from "../common/NotificationModal";
import { axiosInstance } from "../../services/api";
import { formatDate } from "../../utils/dateFormatter";

const ApplicationDetails = ({
  application,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("confirm");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [internshipData, setInternshipData] = useState({
    internshipDepartment: "",
    supervisor: "",
    internshipStartDate: "",
    internshipEndDate: "",
    status: "pending",
  });

  // Define status-related constants
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    archived: "bg-red-100 text-red-800",
    "under-review": "bg-blue-100 text-blue-800",
  };

  const statuses = ["pending", "approved", "archived", "under-review"];

  // Add departments and supervisors state
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  // Fetch departments and supervisors
  useEffect(() => {
    const fetchDepartmentsAndSupervisors = async () => {
      try {
        const [deptResponse, supResponse] = await Promise.all([
          axiosInstance.get("/internship-applications/departments"),
          axiosInstance.get("/internship-applications/supervisors"),
        ]);
        setDepartments(deptResponse.data);
        setSupervisors(supResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDepartmentsAndSupervisors();
  }, []);

  // Update internshipData when application changes
  useEffect(() => {
    if (application) {
      setInternshipData({
        internshipDepartment: application.internshipDepartment || "",
        supervisor: application.supervisor || "",
        internshipStartDate: application.internshipStartDate || "",
        internshipEndDate: application.internshipEndDate || "",
        status: application.status || "pending",
      });
    }
  }, [application]);

  const handleSave = async () => {
    setNotificationType("confirm");
    setNotificationTitle("Confirm Changes");
    setNotificationMessage("Are you sure you want to save these changes?");
    setIsNotificationOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    setIsNotificationOpen(false);

    try {
      await axiosInstance.patch(
        `/internship-applications/${application.id}`,
        internshipData
      );

      onEdit && onEdit({ ...application, ...internshipData });

      setNotificationType("success");
      setNotificationTitle("Success");
      setNotificationMessage("Changes saved successfully.");
      setIsEditing(false);
    } catch (error) {
      setNotificationType("error");
      setNotificationTitle("Error");
      setNotificationMessage(
        error.response?.data?.message || "Failed to save changes."
      );
    } finally {
      setIsSaving(false);
      setIsNotificationOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/internship-applications/delete/${application.id}`);
      onClose();
      // You might want to trigger a refresh of the applications list here
    } catch (error) {
      console.error("Error deleting application:", error);
      setNotificationType("error");
      setNotificationTitle("Error");
      setNotificationMessage("Failed to delete application. Please try again.");
      setIsNotificationOpen(true);
    }
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
    if (notificationType === "success") {
      onClose && onClose();
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.patch(`/internship-applications/${application.id}`, {
        status: newStatus,
      });
      setInternshipData((prev) => ({ ...prev, status: newStatus }));
      onEdit && onEdit({ ...application, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      setNotificationType("error");
      setNotificationTitle("Error");
      setNotificationMessage("Failed to update status");
      setIsNotificationOpen(true);
    }
  };

  const sections = [
    {
      title: "Education Details",
      icon: <FaGraduationCap className="w-6 h-6 text-blue-600" />,
      content: [
        { label: "Institution", value: application?.institutionName },
        { label: "Course", value: application?.courseProgram },
        { label: "Current Year", value: application?.currentYear },
        { label: "Academic Award", value: application?.academicQualification },
      ],
      editable: false,
      bgColor: "bg-blue-50",
    },
    {
      title: "Internship Details",
      icon: <FaBriefcase className="w-6 h-6 text-purple-600" />,
      content: [
        {
          label: "Department",
          value: internshipData.internshipDepartment,
          key: "internshipDepartment",
          type: "select",
          options: departments,
        },
        {
          label: "Supervisor",
          value: internshipData.supervisor,
          key: "supervisor",
          type: "select",
          options: supervisors,
        },
        {
          label: "Start Date",
          value: formatDate(internshipData.internshipStartDate),
          key: "internshipStartDate",
          type: "date",
        },
        {
          label: "End Date",
          value: formatDate(internshipData.internshipEndDate),
          key: "internshipEndDate",
          type: "date",
        },
      ],
      editable: true,
      bgColor: "bg-purple-50",
    },
    {
      title: "Insurance & Emergency",
      icon: <FaShieldAlt className="w-6 h-6 text-red-600" />,
      content: [
        { label: "Insurance Company", value: application.insuranceCompany },
        { label: "Policy Number", value: application.insurancePolicyNumber },
        { label: "Expiry Date", value: formatDate(application.policyExpirationDate) },
        { label: "Emergency Contact", value: application.emergencyContactPerson },
        { label: "Emergency Phone", value: application.emergencyContactPhone },
        { label: "Emergency Email", value: application.emergencyContactEmail },
      ],
      editable: false,
      bgColor: "bg-red-50",
      gridColumns: "grid-cols-3", // Added for 3-column layout
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="relative max-h-screen overflow-y-auto w-full max-w-7xl bg-white overflow-hidden rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-primary-700 to-primary-600">
            <div className="flex items-center gap-4 pl-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Internship Application Details -{" "}
                  <span className="text-amber-400">
                    {application?.firstName} {application?.surname}
                  </span>
                </h2>
                <div className="flex items-baseline gap-4">
                  <span
                    className={`inline-flex items-center px-5 py-1 text-xs font-medium rounded-lg border mt-1 ${
                      statusColors[application.status]
                    }`}
                  >
                    {internshipData.status
                      ? internshipData.status.charAt(0).toUpperCase() +
                        internshipData.status.slice(1)
                      : "Pending"}
                  </span>
                  <span className="text-sm  text-amber-200">
                    Submitted on:{" "}
                    <span className="font-semibold ml-2 text-amber-100">
                      {formatDate(application.createdAt)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose className="w-6 h-6 text-white hover:text-red-500" />
            </button>
          </div>

          {/* Content */}
          <div className="py-4 px-6">
            <div className="flex gap-6">
              {/* Left Side - Personal Info */}
              <div className="w-[350px] border border-gray-200/50 bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl shadow-md p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaUser className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-500">
                    {`${application.firstName} ${application.surname}`}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ID/Passport: {application.idPassportNumber}
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      icon: <LuMail size={20} />,
                      label: "Email",
                      value: application.email,
                    },
                    {
                      icon: <HiMiniDevicePhoneMobile size={22} />,
                      label: "Phone",
                      value: application.phoneNumber,
                    },
                    {
                      icon: <HiHomeModern size={20} />,
                      label: "Nationality",
                      value: application.nationality,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div className="text-gray-400">{item.icon}</div>
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="font-medium text-gray-600">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Documents Section */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Uploaded Documents
                  </h3>
                  <div className="space-y-1">
                    <a
                      href={""}
                      className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaFilePdf />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        ID - {application.identificationDocument}
                      </span>
                    </a>
                    <a
                      href={""}
                      className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaFilePdf />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        Academic - {application.academicDocuments}
                      </span>
                    </a>
                    <a
                      href={""}
                      className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FaFilePdf />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        Insurance - {application.insuranceDocument}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="flex-1 grid grid-cols-1 gap-4">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${section.bgColor}`}
                  >
                    <div className="flex items-center gap-3 p-4 border-b border-gray-200/50">
                      {section.icon}
                      <h3 className="font-semibold text-gray-800">
                        {section.title}
                      </h3>
                    </div>
                    <div className="py-5 px-6 bg-white/80">
                      <div
                        className={`grid ${
                          section.gridColumns || "grid-cols-2"
                        } gap-3`}
                      >
                        {section.content.map((item, i) => (
                          <div key={i} className="space-y-2">
                            <label className="text-sm font-semibold text-gray-500">
                              {item.label}
                            </label>
                            {isEditing && section.editable ? (
                              item.type === "select" ? (
                                <select
                                  value={internshipData[item.key]}
                                  onChange={(e) =>
                                    setInternshipData({
                                      ...internshipData,
                                      [item.key]: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                                >
                                  {item.options.map((option) => (
                                    <option key={option.id} value={option.name}>
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={item.type || "text"}
                                  value={internshipData[item.key]}
                                  onChange={(e) =>
                                    setInternshipData({
                                      ...internshipData,
                                      [item.key]: e.target.value,
                                    })
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                                />
                              )
                            ) : (
                              <p className="font-bold font-nunito-sans text-gray-800">
                                {item.value || "-"}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                Application Status:
              </span>
              <select
                value={application.status}
                className="px-4 py-1 font-semibold text-[15px] text-gray-600 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
              >
                Delete Application
              </button>
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                  >
                    Cancel Changes
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`px-6 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors ${
                      isSaving ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Edit Internship Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={handleNotificationClose}
        onConfirm={handleConfirmSave}
        title={notificationTitle}
        message={notificationMessage}
        type={notificationType}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </>
  );
};

export default ApplicationDetails;
