import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { HiCalendar } from "react-icons/hi2";
import { FaRegUser } from "react-icons/fa6";
import { FaBuildingColumns } from "react-icons/fa6";
import NotificationModal from "../common/NotificationModal";
import { axiosInstance } from "../../services/authService";
import { formatDate } from "../../utils/dateFormatter";

const ExtensionModal = ({ isOpen, onClose, internship, onSubmit }) => {
  const [newEndDate, setNewEndDate] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationType, setNotificationType] = useState("success");
  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axiosInstance.patch(
        `/internship-applications/${internship.id}/extend`,
        {
          newEndDate,
          requestDate,
        }
      );

      setNotificationType("success");
      setNotificationMessage(
        "Internship extension request processed successfully."
      );
      onSubmit?.({ newEndDate, requestDate });
    } catch (error) {
      setNotificationType("error");
      setNotificationMessage(
        "Failed to process internship extension request. Please try again."
      );
      console.error("Error extending internship:", error);
    } finally {
      setIsSubmitting(false);
      setNotificationOpen(true);
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false); // Close the notification modal
    onClose(); // Close the ExtensionModal
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-2xl transform transition-all duration-300 scale-100">
          <div className="w-full bg-white rounded-2xl shadow-[0_0_50px_-12px_rgb(0,0,0,0.25)] overflow-hidden">
            {/* Header */}
            <div className="px-8 py-4 bg-gradient-to-r from-primary-100 to-primary-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-primary-700 bg-clip-text text-transparent">
                    Extend Internship Period
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Extend the selected intern's internship duration
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

            <form onSubmit={handleSubmit}>
              <div className="px-8 py-4 space-y-6">
                {/* Intern Info Card */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl px-6 py-4">
                  <div className="flex gap-5">
                    <div className="bg-primary-500/10 h-fit rounded-lg p-3">
                      <FaRegUser size={60} className="text-primary-700" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-primary-700 text-lg">
                        {`${internship.firstName} ${internship.surname}`}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-primary-700 flex items-center gap-2">
                          <FaBuildingColumns className="w-4 h-4" />
                          <span>
                            Department: {internship.internshipDepartment}
                          </span>
                        </p>
                        <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
                          <HiCalendar className="w-4 h-4" />
                          <span>
                            {formatDate(internship.internshipStartDate)}{" "}
                            <span className="text-gray-500 px-1">to</span>{" "}
                            {formatDate(internship.internshipEndDate)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Inputs */}
                <div className="space-y-5 font-nunito-sans ">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      New Internship End Date
                    </label>
                    <div className="relative group">
                      <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="date"
                        required
                        value={newEndDate}
                        onChange={(e) => setNewEndDate(e.target.value)}
                        min={
                          internship
                            ? formatDate(internship.internshipEndDate)
                            : "Loading..."
                        }
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">
                      Extension Request Letter Date
                    </label>
                    <div className="relative group">
                      <HiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="date"
                        required
                        value={requestDate}
                        onChange={(e) => setRequestDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:outline-none focus:ring-primary-600 focus:border-transparent transition-shadow hover:border-gray-300 bg-gray-50/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 text-sm font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-9 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg "
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Extend Internship"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notificationOpen}
        onClose={handleNotificationClose}
        title={notificationType === "success" ? "Success" : "Error"}
        message={notificationMessage}
        type={notificationType}
      />
    </>
  );
};

export default ExtensionModal;
