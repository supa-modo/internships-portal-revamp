import React, { useState, useRef } from "react";
import { FaUpload, FaFile, FaTimes } from "react-icons/fa";

const FileUploadInput = ({
  label,
  name,
  onChange,
  error,
  accept,
  maxSize,
  currentFile,
  description,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      // Create a synthetic event object
      const syntheticEvent = {
        target: {
          name, // Include the field name
          value: file, // Include the file as the value
          files: [file], // Include the files array
        },
      };
      onChange(syntheticEvent); // Pass the synthetic event to the parent
    } else {
      // Handle the case where the file is null (e.g., when removing a file)
      const syntheticEvent = {
        target: {
          name, // Include the field name
          value: null, // Set value to null
          files: [], // Clear the files array
        },
      };
      onChange(syntheticEvent); // Pass the synthetic event to the parent
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6
          ${isDragging ? "border-primary-500 bg-primary-50" : "border-gray-300"}
          ${error ? "border-red-300" : ""}
          transition-colors duration-200
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          onChange={(e) => handleFileChange(e.target.files[0])}
          accept={accept}
          className="hidden"
        />

        <div className="space-y-2 text-center">
          <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Click to upload
            </button>
            {" or drag and drop"}
          </div>
          <p className="text-xs text-gray-500">
            {description ||
              `${accept.split(",").join(", ")} up to ${maxSize}MB`}
          </p>
        </div>

        {currentFile && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaFile className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {currentFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleFileChange(null)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FileUploadInput;
