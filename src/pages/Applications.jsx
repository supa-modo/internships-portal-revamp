import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import {
  FaUpload,
  FaArrowLeft,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

const ApplicationForm = () => {
  const navigate = useNavigate();

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

  // Validation Rules
  const validateField = (name, value) => {
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
  };

  // File Validation
  const validateFile = (file, type) => {
    if (!file) return "File is required";
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
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      const fileError = validateFile(file);
      setErrors((prev) => ({ ...prev, [name]: fileError }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value instanceof File) {
        newErrors[key] = validateFile(value);
      } else {
        newErrors[key] = validateField(key, value);
      }
    });

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      setSubmitError("Please correct all errors before submitting.");
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    try {
      // Add your submission logic here
      console.log("Form submitted successfully", formData);
      setIsSubmitting(false);
      // Navigate to success page or show success message
    } catch (error) {
      setSubmitError(
        "An error occurred while submitting the form. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // Custom Error Banner Component
  const ErrorBanner = ({ message }) => {
    if (!message) return null;

    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex items-center">
          <FaExclamationCircle className="text-red-400 mr-2" />
          <p className="text-red-700">{message}</p>
        </div>
      </div>
    );
  };

  const FormSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const FileUpload = ({ label, name, onChange, accept, error }) => (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      >
        <div className="space-y-1 text-center">
          <FaUpload
            className={`mx-auto h-12 w-12 ${
              error ? "text-red-400" : "text-gray-400"
            }`}
          />
          <div className="flex text-sm text-gray-600">
            <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-700 hover:text-primary-800">
              <span>Upload a file</span>
              <input
                type="file"
                name={name}
                className="sr-only"
                onChange={onChange}
                accept={accept}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">PDF up to 10MB</p>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  const Input = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    required = false,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-700 hover:text-primary-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Policy
        </button>

        <ErrorBanner message={submitError} />

        <form onSubmit={handleSubmit} noValidate>
          <FormSection title="Personal Information">
            <Input
              label="Surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              error={errors.surname}
              required
            />
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <Input
              label="Other Names"
              name="otherNames"
              value={formData.otherNames}
              onChange={handleChange}
              error={errors.otherNames}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              required
            />
            <Input
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              error={errors.nationality}
              required
            />
            <Input
              label="ID/Passport Number"
              name="idPassportNumber"
              value={formData.idPassportNumber}
              onChange={handleChange}
              error={errors.idPassportNumber}
              required
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              required
            />
            <FileUpload
              label="Upload Identification Document"
              name="identificationDocument"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              error={errors.identificationDocument}
            />
          </FormSection>

          <FormSection title="Academic Information">
            <Input
              label="Institution Name"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleChange}
              error={errors.institutionName}
              required
            />
            <Input
              label="Course/Program"
              name="courseProgram"
              value={formData.courseProgram}
              onChange={handleChange}
              error={errors.courseProgram}
              required
            />
            <Input
              label="Current Year"
              name="currentYear"
              value={formData.currentYear}
              onChange={handleChange}
              error={errors.currentYear}
              required
            />
            <Input
              label="Year of Graduation"
              name="yearOfGraduation"
              value={formData.yearOfGraduation}
              onChange={handleChange}
              error={errors.yearOfGraduation}
              required
            />
            <Input
              label="Academic Qualification"
              name="academicQualification"
              value={formData.academicQualification}
              onChange={handleChange}
              error={errors.academicQualification}
              required
            />
            <FileUpload
              label="Upload Academic Documents"
              name="academicDocuments"
              onChange={handleChange}
              accept=".pdf"
              error={errors.academicDocuments}
            />
          </FormSection>

          <FormSection title="Insurance Information">
            <Input
              label="Insurance Policy Number"
              name="insurancePolicyNumber"
              value={formData.insurancePolicyNumber}
              onChange={handleChange}
              error={errors.insurancePolicyNumber}
              required
            />
            <Input
              label="Insurance Company"
              name="insuranceCompany"
              value={formData.insuranceCompany}
              onChange={handleChange}
              error={errors.insuranceCompany}
              required
            />
            <Input
              label="Policy Expiration Date"
              name="policyExpirationDate"
              type="date"
              value={formData.policyExpirationDate}
              onChange={handleChange}
              error={errors.policyExpirationDate}
              required
            />
            <FileUpload
              label="Upload Insurance Document"
              name="insuranceDocument"
              onChange={handleChange}
              accept=".pdf"
              error={errors.insuranceDocument}
            />
          </FormSection>

          <FormSection title="Emergency Contact">
            <Input
              label="Contact Person"
              name="emergencyContactPerson"
              value={formData.emergencyContactPerson}
              onChange={handleChange}
              error={errors.emergencyContactPerson}
              required
            />
            <Input
              label="Contact Phone"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              error={errors.emergencyContactPhone}
              required
            />
            <Input
              label="Contact Email"
              name="emergencyContactEmail"
              type="email"
              value={formData.emergencyContactEmail}
              onChange={handleChange}
              error={errors.emergencyContactEmail}
              required
            />
          </FormSection>

          <FormSection title="Internship Details">
            <Input
              label="Department"
              name="internshipDepartment"
              value={formData.internshipDepartment}
              onChange={handleChange}
              error={errors.internshipDepartment}
              required
            />
            <Input
              label="Start Date"
              name="internshipStartDate"
              type="date"
              value={formData.internshipStartDate}
              onChange={handleChange}
              error={errors.internshipStartDate}
              required
            />
            <Input
              label="End Date"
              name="internshipEndDate"
              type="date"
              value={formData.internshipEndDate}
              onChange={handleChange}
              error={errors.internshipEndDate}
              required
            />
          </FormSection>

          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ApplicationForm;
