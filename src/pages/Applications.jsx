import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaUpload,
  FaArrowLeft,
  FaExclamationCircle,
  FaSpinner,
  FaUser,
  FaGraduationCap,
  FaShieldAlt,
  FaPhone,
  FaBriefcase,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Header from "../components/common/Header";
import PersonalInfoSection from "../components/forms/PersonalInfoSection";
import InternshipDetailsSection from "../components/forms/InternshipDetailsSection";
import AcademicInfoSection from "../components/forms/AcademicInfoSection";
import InsuranceInfoSection from "../components/forms/InsuranceInfoSection";
import EmergencyContactSection from "../components/forms/EmergencyContactSection";
import StepProgressIndicator from "../components/common/StepIndicator";
import NotificationModal from "../components/common/NotificationModal";
import Footer from "../components/common/Footer";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form Data State
  const [formData, setFormData] = useState({
    surname: "",
    firstName: "",
    otherNames: "",
    email: "",
    phoneNumber: "",
    nationality: "",
    idPassportNumber: "",
    address: "",
    identificationDocument: null,
    institutionName: "",
    courseProgram: "",
    currentYear: "",
    yearOfGraduation: "",
    academicQualification: "",
    academicDocuments: null,
    insurancePolicyNumber: "",
    insuranceCompany: "",
    policyExpirationDate: "",
    insuranceDocument: null,
    emergencyContactPerson: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    internshipDepartment: "",
    internshipStartDate: "",
    internshipEndDate: "",
  });

  // Error State
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification State
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "success", // or 'error'
    title: "",
    message: "",
  });

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  // Progress calculation
  const progress = (currentStep / totalSteps) * 100;

  // Validation Rules
  const validateField = (name, value) => {
    // Handle undefined or null values
    if (value === undefined || value === null) {
      return "This field is required"; // Return an error message
    }

    // Handle file inputs separately
    if (value instanceof File) {
      return validateFile(value); // Validate the file
    }

    // Handle string inputs
    if (typeof value === "string") {
      switch (name) {
        case "email":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ""
            : "Invalid email address";
        case "phoneNumber":
          return /^\+?[\d\s-]{10,}$/.test(value) ? "" : "Invalid phone number";
        case "idPassportNumber":
          return value.length >= 5
            ? ""
            : "ID/Passport number must be at least 5 characters";
        case "policyExpirationDate":
          return new Date(value) > new Date()
            ? ""
            : "Expiration date must be in the future";
        case "internshipStartDate":
          return new Date(value) >= new Date()
            ? ""
            : "Start date must be in the future";
        case "internshipEndDate":
          return new Date(value) > new Date(formData.internshipStartDate)
            ? ""
            : "End date must be after start date";
        default:
          return value.trim() ? "" : "This field is required";
      }
    }

    // Handle other types (e.g., numbers, dates)
    return value ? "" : "This field is required";
  };

  // File Validation
  const validateFile = (file, type) => {
    if (!file) return "File is required"; // Handle undefined or null files
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return "File size must be less than 10MB";
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) return "Invalid file type";
    return "";
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files?.[0]; // Use optional chaining to handle undefined
      setFormData((prev) => ({ ...prev, [name]: file }));
      const fileError = validateFile(file);
      setErrors((prev) => ({ ...prev, [name]: fileError }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Step validation before proceeding
  const canProceedToNextStep = () => {
    const stepFields = {
      1: [
        "surname",
        "firstName",
        "email",
        "phoneNumber",
        "nationality",
        "idPassportNumber",
        "address",
        "identificationDocument",
      ],
      2: [
        "institutionName",
        "courseProgram",
        "currentYear",
        "yearOfGraduation",
        "academicQualification",
        "academicDocuments",
      ],
      3: [
        "insurancePolicyNumber",
        "insuranceCompany",
        "policyExpirationDate",
        "insuranceDocument",
      ],
      4: [
        "emergencyContactPerson",
        "emergencyContactPhone",
        "emergencyContactEmail",
      ],
      5: ["internshipDepartment", "internshipStartDate", "internshipEndDate"],
    };

    const currentFields = stepFields[currentStep];
    return !currentFields.some((field) => {
      const value = formData[field];
      return validateField(field, value) !== "";
    });
  };

  // Navigation between steps
  const handleNext = () => {
    if (canProceedToNextStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      toast.error(
        "Please fill all required fields correctly before proceeding"
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof File) {
          submitData.append(key, formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/applications", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) throw new Error("Submission failed");

      setNotification({
        isOpen: true,
        type: "success",
        title: "Success",
        message: "Application submitted successfully!",
      });
    } catch (error) {
      setNotification({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to submit application. Please check your internet connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
        <motion.div
          className="h-full bg-primary-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-3 text-gray-500">
          Internship Application Form
        </h2>
        <p className="text-sm sm:text-base text-center text-gray-600 mb-6">
          Kindly fill in the sections in all the steps below to apply for an
          internship.
        </p>
        {/* Step Indicators */}
        <StepProgressIndicator currentStep={currentStep} totalSteps={5} />

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg px-4 sm:px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Render different form sections based on currentStep */}
            {currentStep === 1 && (
              <PersonalInfoSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <AcademicInfoSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {currentStep === 3 && (
              <InsuranceInfoSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {currentStep === 4 && (
              <EmergencyContactSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {currentStep === 5 && (
              <InternshipDetailsSection
                formData={formData}
                handleChange={handleChange}
                errors={errors}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-7 sm:px-9 py-2 text-sm sm:text-base text-gray-600 bg-gray-200 rounded-md font-semibold  hover:text-gray-800"
                >
                  Previous
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-8 text-sm sm:text-base sm:px-10 py-2 bg-primary-600 text-white rounded-md font-semibold hover:bg-primary-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-9 py-2 bg-green-600 font-semibold text-white rounded-md hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default ApplicationForm;
