import { FaGraduationCap } from "react-icons/fa6";
import FormInput from "./FormInput";
import FileUploadInput from "./FileUploadInput";

const AcademicInfoSection = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FaGraduationCap className="text-primary-600 w-5 h-5" />
        <h2 className="text-xl font-semibold text-gray-800">
          Academic Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Institution Name"
          name="institutionName"
          value={formData.institutionName}
          onChange={handleChange}
          error={errors.institutionName}
          required
        />
        <FormInput
          label="Course/Program"
          name="courseProgram"
          value={formData.courseProgram}
          onChange={handleChange}
          error={errors.courseProgram}
          required
        />
        <FormInput
          label="Current Year"
          name="currentYear"
          type="number"
          min="1"
          max="6"
          value={formData.currentYear}
          onChange={handleChange}
          error={errors.currentYear}
          required
        />
        <FormInput
          label="Year of Graduation"
          name="yearOfGraduation"
          type="number"
          min={new Date().getFullYear()}
          value={formData.yearOfGraduation}
          onChange={handleChange}
          error={errors.yearOfGraduation}
          required
        />
        <div className="md:col-span-2">
          <FormInput
            label="Academic Qualification"
            name="academicQualification"
            value={formData.academicQualification}
            onChange={handleChange}
            error={errors.academicQualification}
            required
          />
        </div>
        <div className="md:col-span-2">
          <FileUploadInput
            label="Academic Documents"
            name="academicDocuments"
            onChange={handleChange}
            error={errors.academicDocuments}
            accept=".pdf"
            maxSize={10}
            currentFile={formData.academicDocuments}
            description="Upload your academic transcripts and certificates (PDF format)"
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicInfoSection;
