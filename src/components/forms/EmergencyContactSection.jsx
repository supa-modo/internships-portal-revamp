import { FaInfoCircle } from "react-icons/fa";
import FormInput from "./FormInput";
import { GrEmergency } from "react-icons/gr";

const EmergencyContactSection = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <GrEmergency  className="text-primary-600 w-7 h-7 sm:w-8 sm:h-8 mr-2" />
        <h2 className="text-lg sm:text-xl font-bold font-nunito-sans text-amber-700">
          Emergency Contact Information
        </h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 w-5 h-5 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-blue-800">
              Emergency Contact Details
            </h4>
            <p className="text-sm text-blue-700">
              Please provide contact information for someone we can reach in
              case of an emergency.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormInput
            label="Emergency Contact Person"
            name="emergencyContactPerson"
            value={formData.emergencyContactPerson}
            onChange={handleChange}
            error={errors.emergencyContactPerson}
            required
            placeholder="Full name of emergency contact"
          />
        </div>
        <FormInput
          label="Emergency Contact Phone"
          name="emergencyContactPhone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
          error={errors.emergencyContactPhone}
          required
          placeholder="+254 XXX XXX XXX"
        />
        <FormInput
          label="Emergency Contact Email"
          name="emergencyContactEmail"
          type="email"
          value={formData.emergencyContactEmail}
          onChange={handleChange}
          error={errors.emergencyContactEmail}
          required
          placeholder="email@example.com"
        />
       
      </div>
    </div>
  );
};

export default EmergencyContactSection;
