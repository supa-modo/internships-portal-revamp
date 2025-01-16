import { FaBriefcase, FaClock } from "react-icons/fa6";
import FormInput from "./FormInput";

const InternshipDetailsSection = ({ formData, handleChange, errors }) => {
  const departments = [
    "Information Technology",
    "Human Resources",
    "Finance",
    "Legal Affairs",
    "Communications",
    "Research and Development",
    "Administration",
    "Project Management",
  ];

  const calculateMinEndDate = () => {
    if (!formData.internshipStartDate) return "";
    const startDate = new Date(formData.internshipStartDate);
    const minEndDate = new Date(startDate);
    minEndDate.setMonth(startDate.getMonth() + 3); // Minimum 3 months internship
    return minEndDate.toISOString().split("T")[0];
  };

  const calculateMaxEndDate = () => {
    if (!formData.internshipStartDate) return "";
    const startDate = new Date(formData.internshipStartDate);
    const maxEndDate = new Date(startDate);
    maxEndDate.setMonth(startDate.getMonth() + 6); // Maximum 6 months internship
    return maxEndDate.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FaBriefcase className="text-primary-600 w-5 h-5" />
        <h2 className="text-xl font-semibold text-gray-800">
          Internship Details
        </h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <FaClock className="text-green-500 w-5 h-5 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-800">
              Duration Guidelines
            </h4>
            <p className="text-sm text-green-700">
              Internships must be between 3 to 6 months in duration. Please
              select your preferred dates accordingly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            name="internshipDepartment"
            value={formData.internshipDepartment}
            onChange={handleChange}
            className={`
              w-full px-4 py-2.5 rounded-lg border bg-white
              focus:ring-2 focus:ring-offset-0 focus:outline-none
              ${
                errors.internshipDepartment
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-primary-500 focus:ring-primary-200"
              }
            `}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.internshipDepartment && (
            <p className="text-sm text-red-600 mt-1">
              {errors.internshipDepartment}
            </p>
          )}
        </div>

        <FormInput
          label="Start Date"
          name="internshipStartDate"
          type="date"
          value={formData.internshipStartDate}
          onChange={handleChange}
          error={errors.internshipStartDate}
          required
          min={new Date().toISOString().split("T")[0]}
        />
        <FormInput
          label="End Date"
          name="internshipEndDate"
          type="date"
          value={formData.internshipEndDate}
          onChange={handleChange}
          error={errors.internshipEndDate}
          required
          min={calculateMinEndDate()}
          max={calculateMaxEndDate()}
          disabled={!formData.internshipStartDate}
        />

        <div className="md:col-span-2">
          <FormInput
            label="Additional Notes"
            name="internshipNotes"
            value={formData.internshipNotes}
            onChange={handleChange}
            error={errors.internshipNotes}
            placeholder="Any specific requirements or information you'd like to share"
            as="textarea"
            rows={4}
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Declaration
        </h4>
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="declaration"
            name="declaration"
            checked={formData.declaration}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "declaration",
                  value: e.target.checked,
                },
              })
            }
            className="mt-1"
          />
          <label htmlFor="declaration" className="text-sm text-gray-600">
            I declare that all information provided in this application is true
            and accurate. I understand that any false statements may result in
            the rejection of my application or termination of the internship if
            already commenced.
          </label>
        </div>
        {errors.declaration && (
          <p className="text-sm text-red-600 mt-1">{errors.declaration}</p>
        )}
      </div>
    </div>
  );
};

export default InternshipDetailsSection;
