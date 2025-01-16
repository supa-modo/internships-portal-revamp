// components/dashboard/ApprovalModal.js
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import NotificationModal from "./NotificationModal"; // Import the NotificationModal

const ApprovalModal = ({ application, onClose }) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false); // Track email sending state
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    type: "success", // 'success' or 'error'
    message: "",
  });

  // Simulate sending an email
  const handleSendEmail = async () => {
    setIsSendingEmail(true);

    try {
      // Simulate an API call to send the email
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // On success
      setNotificationModal({
        isOpen: true,
        type: "success",
        message:
          "The document and approval message have been sent successfully!",
      });
    } catch (error) {
      // On error
      setNotificationModal({
        isOpen: true,
        type: "error",
        message: "Failed to send the email. Please try again.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Close the notification modal
  const handleNotificationClose = () => {
    setNotificationModal({ isOpen: false, type: "success", message: "" });
    onClose(); // Close the ApprovalModal as well
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-4xl h-[80vh] transform transition-all duration-300 scale-100">
          <div className="w-full h-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-8 py-4 bg-gradient-to-r from-primary-200 to-primary-100 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                    Application Approved
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Preview the approved application and email the applicant
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
              {/* Document Preview (Gray Placeholder) */}
              <div className="w-1/2 bg-gray-200 rounded-lg m-4 flex items-center justify-center">
                <p className="text-gray-500">Document Preview</p>
              </div>

              {/* Application Details */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <h2 className="text-2xl font-extrabold text-amber-700 mb-4">
                  Internship Application Details
                </h2>
                <h3 className="text-xl font-semibold text-gray-600">
                  {application?.applicantName}
                </h3>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Department:</span>{" "}
                    {application?.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Supervisor:</span>{" "}
                    Supervisor Placeholder Name
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Start Date:</span>{" "}
                    {application?.startDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">End Date:</span>{" "}
                    {application?.endDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="text-green-700 font-semibold">
                      Approved
                    </span>
                  </p>
                </div>

                {/* Email Notification Text */}
                <div className="mt-6 py-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    The previewed document will be sent to the applicant's
                    provided email address with a message informing them of the
                    application approval and further instructions.
                  </p>
                  <p className="text-sm text-gray-600 mt-3">
                    Click the button below to confirm and finish the approval
                    process.
                  </p>
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="px-8 py-2.5 text-sm font-semibold text-white bg-green-700 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    "Finish Approval"
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
