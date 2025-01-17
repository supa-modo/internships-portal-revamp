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
          relative border-2 border-dashed rounded-lg p-4 sm:p-6
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

        {/* File Upload Content */}
        <div className="flex items-center">
          {!currentFile && (
            <div
              className="space-y-2 mx-auto cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
               
                <div className="flex items-center w-full justify-center space-x-3">
                <FaUpload className="h-9 w-9 text-gray-400" />
                <div className="flex flex-col text-sm text-gray-600">
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-500 font-bold font-nunito-sans"
                  >
                    <span>Click to Upload</span>
                  </button>
                  <span>or drag and drop</span>
                </div>
                </div>
              
              <p className="text-xs text-gray-500">
                {description ||
                  `${accept.split(",").join(", ")} up to ${maxSize}MB`}
              </p>
            </div>
          )}

          {/* File Name Display (Shown when a file is chosen) */}
          {currentFile && (
            <div className="flex items-center justify-between w-full">
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
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

export default FileUploadInput;
