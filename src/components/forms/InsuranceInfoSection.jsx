import { FaExclamationCircle, FaShieldAlt } from "react-icons/fa";
import FileUploadInput from "./FileUploadInput";
import FormInput from "./FormInput";

const InsuranceInfoSection = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <FaShieldAlt className="text-primary-600 w-7 h-7 mr-2" />
        <h2 className="text-xl font-bold font-nunito-sans text-amber-700">
          Insurance Information
        </h2>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-4">
          <FaExclamationCircle className="text-amber-500 w-6 h-6 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">
              Important Notice
            </h4>
            <p className="text-sm text-amber-700">
              Valid insurance coverage is mandatory for all interns. Please
              ensure your policy covers the entire internship period.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          label="Insurance Policy Number"
          name="insurancePolicyNumber"
          value={formData.insurancePolicyNumber}
          onChange={handleChange}
          error={errors.insurancePolicyNumber}
          required
          placeholder="Enter your policy number"
        />
        <FormInput
          label="Insurance Company"
          name="insuranceCompany"
          value={formData.insuranceCompany}
          onChange={handleChange}
          error={errors.insuranceCompany}
          required
          placeholder="Enter insurance company name"
        />
        <FormInput
          label="Policy Expiration Date"
          name="policyExpirationDate"
          type="date"
          value={formData.policyExpirationDate}
          onChange={handleChange}
          error={errors.policyExpirationDate}
          required
          min={new Date().toISOString().split("T")[0]}
        />
        <div className="md:col-span-3">
          <FileUploadInput
            label="Insurance Policy Document"
            name="insuranceDocument"
            onChange={handleChange}
            error={errors.insuranceDocument}
            accept=".pdf"
            maxSize={10}
            currentFile={formData.insuranceDocument}
            description="Upload your insurance policy document (PDF format only)"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default InsuranceInfoSection;
