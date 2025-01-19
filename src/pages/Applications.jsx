import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
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
import axiosInstance from "../services/api";

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [notificationType, setNotificationType] = useState("success");
  const [notificationTitle, setNotificationTitle] = useState("Success");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Form Data State
  // const [formData, setFormData] = useState({
  //   surname: "",
  //   firstName: "",
  //   otherNames: "",
  //   email: "",
  //   phoneNumber: "",
  //   nationality: "",
  //   idPassportNumber: "",
  //   address: "",
  //   identificationDocument: null,
  //   institutionName: "",
  //   courseProgram: "",
  //   currentYear: "",
  //   yearOfGraduation: "",
  //   academicQualification: "",
  //   academicDocuments: null,
  //   insurancePolicyNumber: "",
  //   insuranceCompany: "",
  //   policyExpirationDate: "",
  //   insuranceDocument: null,
  //   emergencyContactPerson: "",
  //   emergencyContactPhone: "",
  //   emergencyContactEmail: "",
  //   internshipDepartment: "",
  //   internshipStartDate: "",
  //   internshipEndDate: "",
  //   declaration: false,
  // });

  // Form Data State with dummy data
  const [formData, setFormData] = useState({
    surname: "Doe",
    firstName: "John",
    otherNames: "Smith",
    email: "john.doe@example.com",
    phoneNumber: "+254712345678",
    nationality: "Kenyan",
    idPassportNumber: "AB123456",
    address: "123 Main St, Nairobi",
    identificationDocument: null,
    institutionName: "University of Nairobi",
    courseProgram: "Computer Science",
    currentYear: "4",
    yearOfGraduation: "2024",
    academicQualification: "Bachelors",
    academicDocuments: null,
    insurancePolicyNumber: "INS123456",
    insuranceCompany: "Jubilee Insurance",
    policyExpirationDate: "2024-12-31",
    insuranceDocument: null,
    emergencyContactPerson: "Jane Doe",
    emergencyContactPhone: "+254787654321",
    emergencyContactEmail: "jane.doe@example.com",
    internshipDepartment: "ICT",
    internshipStartDate: "2024-06-01",
    internshipEndDate: "2024-09-01",
    declaration: true,
  });

  // Error State
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification State
  const [notification, setNotification] = useState({
    isOpen: false,
    type: "",
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
      return "This field is required";
    }

    // Handle file inputs separately
    if (value instanceof File) {
      return validateFile(value);
    }

    // Handle string inputs
    if (typeof value === "string") {
      switch (name) {
        case "email":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ""
            : "Invalid email address";
        case "phoneNumber":
        case "emergencyContactPhone":
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

    return ""; // Return empty string if validation passes
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
    let stepValid = true;
    const stepFields = {
      1: [
        "surname",
        "firstName",
        "email",
        "phoneNumber",
        "nationality",
        "idPassportNumber",
        "address",
      ],
      2: [
        "institutionName",
        "courseProgram",
        "currentYear",
        "yearOfGraduation",
        "academicQualification",
      ],
      3: ["insurancePolicyNumber", "insuranceCompany", "policyExpirationDate"],
      4: [
        "emergencyContactPerson",
        "emergencyContactPhone",
        "emergencyContactEmail",
      ],
      5: [
        "internshipDepartment",
        "internshipStartDate",
        "internshipEndDate",
        "declaration",
      ],
    };

    // Get fields for current step
    const fieldsToValidate = stepFields[currentStep];

    // Validate each field for the current step
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        stepValid = false;
        setErrors((prev) => ({
          ...prev,
          [field]: error,
        }));
      }
    });

    return stepValid;
  };

  // Navigation between steps
  const handleNext = (e) => {
    e?.preventDefault();

    // Clear previous errors
    setErrors({});

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

    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setNotification({
        isOpen: true,
        type: "error",
        title: "Validation Error",
        message: "Please fill all required fields correctly",
      });
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();

    // Append all non-file fields
    Object.keys(formData).forEach((key) => {
      if (
        key !== "identificationDocument" &&
        key !== "academicDocuments" &&
        key !== "insuranceDocument"
      ) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Append file fields if they exist
    if (formData.identificationDocument) {
      formDataToSend.append(
        "identificationDocument",
        formData.identificationDocument
      );
    }
    if (formData.academicDocuments) {
      formDataToSend.append("academicDocuments", formData.academicDocuments);
    }
    if (formData.insuranceDocument) {
      formDataToSend.append("insuranceDocument", formData.insuranceDocument);
    }

    try {
      const response = await axiosInstance.post(
        "/internship-applications/apply-internship",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setNotification({
        isOpen: true,
        type: "success",
        title: "Success",
        message: "Your internship application has been submitted successfully!",
      });

      // Reset form after successful submission
      setFormData({
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
        declaration: false,
      });

      // Wait for user to acknowledge success before redirecting
      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setNotification({
        isOpen: true,
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message ||
          "Failed to submit your internship application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-screen-2xl mx-auto border-x border-b border-primary-700 pb-20 mb-20 rounded-x-xl rounded-b-xl">
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
          <div className="bg-white rounded-xl border border-gray-300 shadow-lg px-4 sm:px-6 py-6">
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
      </div>

      <Footer />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default ApplicationForm;
