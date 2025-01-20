// components/dashboard/ApprovalModal.js
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import NotificationModal from "./NotificationModal";
import {
  generateAcceptanceLetter,
  generateExtensionLetter,
} from "../../utils/generateLetters";
import { formatDate } from "../../utils/dateFormatter";
import axiosInstance from "../../services/api";

const ApprovalModal = ({ application, onClose, type = "approval" }) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });
  const [letterPreview, setLetterPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateLetter = async () => {
      try {
        setIsLoading(true);
        let letterData;

        if (type === "approval") {
          letterData = await generateAcceptanceLetter(application);
        } else if (type === "extension") {
          letterData = await generateExtensionLetter(
            application,
            application.internshipEndDate,
            application.newEndDate,
            application.requestDate
          );
        }

        setLetterPreview(letterData);
      } catch (error) {
        console.error("Error generating letter:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (application) {
      generateLetter();
    }
  }, [application, type]);

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const endpoint =
        type === "approval"
          ? `/internship-applications/${application.id}/approve`
          : `/internship-applications/${application.id}/extend`;

      const payload =
        type === "approval"
          ? { status: "approved" }
          : {
              newEndDate: application.newEndDate,
              requestDate: application.requestDate,
            };

      await axiosInstance.patch(endpoint, payload);

      // Trigger refetch through callback
      if (application.onDataChange) {
        application.onDataChange();
      }

      setNotificationModal({
        isOpen: true,
        type: "success",
        message: `The ${
          type === "approval" ? "acceptance" : "extension"
        } has been processed successfully!`,
      });
    } catch (error) {
      setNotificationModal({
        isOpen: true,
        type: "error",
        message: "Failed to process the request. Please try again.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleNotificationClose = () => {
    setNotificationModal({ isOpen: false, type: "success", message: "" });
    onClose();
    // This will trigger the parent ExtendInternshipModal to close
    if (application.onClose) {
      application.onClose();
    }
    // Refresh the data
    if (application.onDataChange) {
      application.onDataChange();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="relative w-full max-w-[58rem] h-[85vh] bg-white rounded-xl shadow-2xl">
          <div className="w-full h-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-8 py-4 bg-gradient-to-r from-primary-200 to-primary-100 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                    {type === "approval"
                      ? "Application Approved"
                      : "Internship Extension"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Preview the{" "}
                    {type === "approval" ? "acceptance" : "extension"} letter
                    and email the applicant
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                >
                  <IoClose className="w-6 h-6 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Document Preview */}
              <div className="w-[56%] p-4 flex flex-col">
                <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </div>
                  ) : letterPreview ? (
                    <iframe
                      src={letterPreview}
                      className="w-full h-full"
                      title="Letter Preview"
                    />
                  ) : (
                    <div className="text-center text-sm text-gray-500">
                      Error generating letter preview !!
                    </div>
                  )}
                </div>
              </div>

              {/* Application Details */}
              <div className="w-[42%] py-6 px-3 overflow-y-auto">
                <h2 className="text-[1.45rem] font-extrabold text-amber-700 mb-4">
                  {type === "approval"
                    ? "Internship Approval Details"
                    : "Internship Extension Details"}
                </h2>
                <h3 className="text-xl font-bold font-nunito-sans text-gray-600">
                  {`${application?.firstName} ${application?.surname}`}
                </h3>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Department:</span>{" "}
                    {application?.internshipDepartment}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Supervisor:</span>{" "}
                    {application?.internshipSupervisor}
                  </p>
                  {type === "approval" && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Current Start Date</span>{" "}
                      {formatDate(application?.internshipStartDate)}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">
                      {type === "approval" ? "End Date" : "Current End Date"}:
                    </span>{" "}
                    {formatDate(application?.internshipEndDate)}
                  </p>
                  {type === "extension" && (
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">New End Date:</span>{" "}
                      {formatDate(application?.newEndDate)}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="text-green-700 font-semibold">
                      {type === "approval"
                        ? "Approving"
                        : "Processing Extension"}
                    </span>
                  </p>
                </div>

                {/* Email Notification Text */}
                <div className="mt-6 py-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    The previewed document will be sent to the applicant's email
                    address with a message informing them of the{" "}
                    {type === "approval"
                      ? "application approval"
                      : "internship extension"}
                    and further instructions.
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    Click the button below to confirm and finish the process.
                  </p>
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="py-2.5 mt-4 w-full text-center text-sm font-semibold text-white bg-green-700 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span className="font-nunito-sans">
                      {type === "approval"
                        ? "Finish Approval Processing"
                        : "Finish Extension Processing"}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationModal.isOpen}
        onClose={handleNotificationClose}
        type={notificationModal.type}
        title={notificationModal.type === "success" ? "Success" : "Error"}
        message={notificationModal.message}
        confirmText="OK"
      />
    </>
  );
};

export default ApprovalModal;
