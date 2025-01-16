import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaRegUser,
  FaBuildingColumns,
  FaDownload,
  FaTrash,
} from "react-icons/fa6";
import { HiCalendar } from "react-icons/hi2";
import NotificationModal from "../common/NotificationModal"; // Ensure this path is correct
import DataTable from "../common/DataTable";
import { LuHardDriveUpload } from "react-icons/lu";

const SignedLetters = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    applicantName: "",
    department: "",
    letterType: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate success or error randomly
    const isSuccess = Math.random() > 0.5; // Randomly choose success or error
    if (isSuccess) {
      setNotificationType("success");
      setNotificationMessage("Signed document uploaded successfully.");
    } else {
      setNotificationType("error");
      setNotificationMessage(
        "Failed to upload signed document. Please try again."
      );
    }

    setIsSubmitting(false);
    setNotificationOpen(true); // Open the notification modal
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the notification modal
    setShowUploadModal(false); // Close the upload modal
  };

  const tableConfig = {
    title: "Signed Internship Letters",
    columns: [
      { header: "#", accessor: "id" },
      { header: "Applicant Name", accessor: "applicantName" },
      { header: "Department", accessor: "department" },
      { header: "Supervisor", accessor: "supervisor" },
      { header: "Letter Type", accessor: "letterType" },
      { header: "Date Uploaded", accessor: "dateUploaded" },
      {
        header: "Actions",
        accessor: "actions",
        render: (row) => (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDownload(row.id)}
              className="px-4 py-2 flex items-center space-x-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Download"
            >
              <FaDownload className="w-4 h-4" />
              <span className="font-semibold">Download</span>
            </button>
            <button
              onClick={() => handleDelete(row.id)}
              className="px-4 py-2 flex items-center space-x-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
              <span className="font-semibold">Delete</span>
            </button>
          </div>
        ),
      },
    ],
    data: [
      {
        id: 1,
        applicantName: "Eddy Odhiambo",
        department: "Human Resource",
        letterType: "Acceptance Letter",
        dateUploaded: "11/1/2024",
      },
      {
        id: 2,
        applicantName: "Test Upload Two",
        department: "International Relations",
        letterType: "Extension Letter",
        dateUploaded: "11/1/2024",
      },
    ],
  };

  const handleDownload = (id) => {
    console.log("Download letter:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete letter:", id);
  };

  return (
    <div className="p-6">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          <div className="relative w-full max-w-3xl transform transition-all duration-300 scale-100">
            <div className="w-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] overflow-hidden">
              {/* Header */}
              <div className="px-8 py-4 bg-gradient-to-r from-primary-100 to-primary-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                      Upload Signed Document
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload a scanned copy of signed internship acceptance /
                      extension letter
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
                  {/* Form Inputs */}
                  <div className="space-y-5 font-nunito-sans">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Applicant Name
                      </label>
                      <input
                        type="text"
                        value={uploadForm.applicantName}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            applicantName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                        placeholder="Enter applicant name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Department
                      </label>
                      <input
                        type="text"
                        value={uploadForm.department}
                        onChange={(e) =>
                          setUploadForm({
                            ...uploadForm,
                            department: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                        placeholder="Enter department"
                        required
                      />
                    </div>

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
                        <option value="Extension Letter">
                          Extension Letter
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">
                        Upload File
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-200">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <LuHardDriveUpload className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              PDF, DOC, or DOCX (MAX. 10MB)
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) =>
                              setUploadForm({
                                ...uploadForm,
                                file: e.target.files[0],
                              })
                            }
                            accept=".pdf,.doc,.docx"
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-8 py-2.5 text-sm font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-9 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
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
