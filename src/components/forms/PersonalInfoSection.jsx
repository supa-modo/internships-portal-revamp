import { FaUser } from "react-icons/fa6";
import FormInput from "./FormInput";
import FileUploadInput from "./FileUploadInput";

const PersonalInfoSection = ({ formData, handleChange, errors }) => {
  return (
    <div className=" space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <FaUser className="text-primary-600 w-6 h-6 sm:w-7 sm:h-7 mr-2" />
        <h2 className="text-lg sm:text-xl font-bold font-nunito-sans text-amber-700">
          Personal Information
        </h2>
      </div>

      {/* First Row: Three Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        <FormInput
          label="Surname"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
          error={errors.surname}
          required
        />
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        <FormInput
          label="Other Names"
          name="otherNames"
          value={formData.otherNames}
          onChange={handleChange}
          error={errors.otherNames}
        />
      </div>

      {/* Second Row: Three Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
        <FormInput
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          required
        />
        <FormInput
          label="Nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          error={errors.nationality}
          required
        />
      </div>

      {/* Third Row: Two Input Fields */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        <FormInput
          label="ID/Passport Number"
          name="idPassportNumber"
          value={formData.idPassportNumber}
          onChange={handleChange}
          error={errors.idPassportNumber}
          required
        />
        <FormInput
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          required
        />
      </div>

      {/* File Upload Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <FileUploadInput
          label="Identification Document"
          name="identificationDocument"
          onChange={handleChange}
          error={errors.identificationDocument}
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={10}
          currentFile={formData.identificationDocument}
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
