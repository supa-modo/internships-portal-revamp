const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className="block text-sm font-bold font-nunito-sans text-gray-500"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base font-semibold font-nunito-sans text-gray-700 rounded-lg border
          focus:ring-1 focus:ring-offset-0 focus:outline-none
          transition-colors duration-200
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
          }
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
