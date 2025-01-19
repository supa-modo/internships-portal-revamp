import React, { useState, useEffect, useRef } from "react";
import DataTable from "../common/DataTable";
import { LuHardDriveUpload } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { FaDownload, FaTrash } from "react-icons/fa";
import NotificationModal from "../common/NotificationModal";
import { formatDate } from "../../utils/dateFormatter";
import axiosInstance from "../../services/api";
import { motion } from "framer-motion";

const SignedLetters = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [letters, setLetters] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    applicantName: "",
    department: "",
    letterType: "",
    file: null,
    internshipApplicationId: null,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    fetchLetters();
  }, []);

  useEffect(() => {
    if (showUploadModal) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showUploadModal]);

  const fetchLetters = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axiosInstance.get("/signed-letters");
      setLetters(response.data);
    } catch (error) {
      console.error("Error fetching letters:", error);
      if (error.response?.status === 401) {
        setNotificationType("error");
        setNotificationMessage("Please log in again to continue.");
        setNotificationOpen(true);
      }
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axiosInstance.get(
        `/signed-letters/${id}/download`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `signed-letter-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setNotificationType("error");
      setNotificationMessage("Failed to download selected letter");
      setNotificationOpen(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/signed-letters/${id}`);
      fetchLetters();
      setNotificationType("success");
      setNotificationMessage("Letter deleted successfully");
      setNotificationOpen(true);
    } catch (error) {
      setNotificationType("error");
      setNotificationMessage("Failed to delete selected letter");
      setNotificationOpen(true);
    }
  };

  const searchApplicants = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 1) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axiosInstance.get(
        "/internship-applications/search",
        {
          params: {
            query: searchTerm,
            status: "approved",
          },
        }
      );

      if (response.data.length === 0) {
        setSuggestions([]);
      } else {
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error searching applicants:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplicantSearch = (value) => {
    setUploadForm((prev) => ({ ...prev, applicantName: value }));

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      searchApplicants(value);
    }, 300);
  };

  const handleSuggestionClick = (application) => {
    setUploadForm((prev) => ({
      ...prev,
      applicantName: `${application.firstName} ${application.surname}`,
      department: application.internshipDepartment,
      internshipApplicationId: application.id,
    }));
    setSuggestions([]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("type", uploadForm.letterType.toLowerCase());
      formData.append("department", uploadForm.department);
      formData.append(
        "internshipApplicationId",
        uploadForm.internshipApplicationId
      );

      await axiosInstance.post("/signed-letters", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNotificationType("success");
      setNotificationMessage("Signed document uploaded successfully.");
      fetchLetters();
      setShowUploadModal(false);
      setUploadForm({
        applicantName: "",
        department: "",
        letterType: "",
        file: null,
        internshipApplicationId: null,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setNotificationType("error");
      setNotificationMessage(
        error.response?.data?.message ||
          "Failed to upload signed document. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setNotificationOpen(true);
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
    setShowUploadModal(false);
  };

  const handleRefresh = async () => {
    try {
      await fetchLetters();
      setNotificationType("success");
      setNotificationMessage("Signed letters data refreshed successfully");
      setNotificationOpen(true);
    } catch (error) {
      setNotificationType("error");
      setNotificationMessage("Failed to refresh data");
      setNotificationOpen(true);
    }
  };

  const tableConfig = {
    title: "Signed Internship Letters",
    columns: [
      {
        header: "#",
        accessor: "index",
        render: (row, index) => <span>{index + 1}</span>,
      },
      {
        header: "Letter Type",
        accessor: "type",
        render: (row) => {
          if (!row.type) return "N/A";
          return row.type.charAt(0).toUpperCase() + row.type.slice(1);
        },
      },
      {
        header: "Department",
        accessor: "department",
        render: (row) => row.department || "N/A",
      },
      {
        header: "Date Issued",
        accessor: "issuedDate",
        render: (row) => formatDate(row.issuedDate),
      },
      {
        header: "Signed By",
        accessor: "signedBy",
        render: (row) => {
          if (row.signer) {
            return `${row.signer.firstName} ${row.signer.lastName}`;
          }
          return "N/A";
        },
      },
      {
        header: "Applicant",
        accessor: "internshipApplication",
        render: (row) => {
          if (row.internshipApplication) {
            return `${row.internshipApplication.firstName} ${row.internshipApplication.surname}`;
          }
          return "N/A";
        },
      },
      {
        header: "Actions",
        accessor: "actions",
        render: (row) => (
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDownload(row.id)}
              className="px-4 py-2 flex items-center space-x-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Download"
            >
              <FaDownload className="w-4 h-4" />
              <span className="font-semibold">Download</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(row.id)}
              className="px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
              <span className="font-semibold">Delete</span>
            </motion.button>
          </div>
        ),
      },
    ],
    data: letters,
    onRefresh: handleRefresh,
  };

  return (
    <div className="py-6">
      <DataTable
        {...tableConfig}
        headerButtons={
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <LuHardDriveUpload className="w-5 h-5" />
            Upload New Signed Document
          </button>
        }
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative w-full max-w-2xl transform transition-all duration-300 scale-100">
            <div className="w-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] overflow-hidden">
              {/* Header */}
              <div className="px-8 py-4 bg-gradient-to-r from-primary-100 to-primary-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                      Upload Signed Document
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload a signed document for an approved intern
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                  >
                    <IoClose className="w-6 h-6 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit}>
                <div className="px-8 py-4 space-y-6">
                  {/* Applicant Name with Suggestions */}
                  <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Applicant Name
                    </label>
                    <input
                      type="text"
                      value={uploadForm.applicantName}
                      onChange={(e) => handleApplicantSearch(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
                      required
                    />

                    {/* Suggestions Dropdown */}
                    {isSearching && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="px-4 py-2 text-gray-600">
                          Searching...
                        </div>
                      </div>
                    )}

                    {suggestions.length === 0 &&
                      !isSearching &&
                      uploadForm.applicantName.trim().length > 1 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          <div className="px-4 py-2 text-gray-600">
                            Applicant not found, try again.
                          </div>
                        </div>
                      )}

                    {suggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((application) => (
                          <div
                            key={application.id}
                            onClick={() => handleSuggestionClick(application)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="font-medium">
                              {application.firstName} {application.surname}
                            </div>
                            <div className="text-sm text-gray-600">
                              {application.internshipDepartment}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Department - Disabled */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={uploadForm.department}
                      className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50"
                      disabled
                    />
                  </div>

                  {/* Letter Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Letter Type
                    </label>
                    <select
                      value={uploadForm.letterType}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          letterType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                      required
                    >
                      <option value="">Select letter type</option>
                      <option value="Acceptance Letter">
                        Acceptance Letter
                      </option>
                      <option value="Extension Letter">Extension Letter</option>
                    </select>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Upload File
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-[5.5rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-200">
                        {uploadForm.file ? (
                          <div className="flex items-center justify-between w-full px-4 py-2">
                            <div className="flex items-center gap-4 px-4">
                              <LuHardDriveUpload className="w-6 h-6 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {uploadForm.file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadForm({ ...uploadForm, file: null });
                              }}
                              className="p-1 text-gray-500 hover:text-red-500"
                            >
                              <IoClose className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <LuHardDriveUpload className="w-10 h-10 text-gray-400" />
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold text-primary-600">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF, DOC, or DOCX (MAX. 10MB)
                              </p>
                            </div>
                          </div>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setUploadForm({
                                ...uploadForm,
                                file: e.target.files[0],
                              });
                            }
                          }}
                          accept=".pdf,.doc,.docx"
                          required
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-8 py-2.5 text-sm font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-9 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      "Upload Document"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationOpen}
        onClose={handleNotificationClose}
        title={notificationType === "success" ? "Success" : "Error"}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
};

export default SignedLetters;
