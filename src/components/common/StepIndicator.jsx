import React from "react";
import {
  FaUser,
  FaGraduationCap,
  FaShieldAlt,
  FaPhone,
  FaBriefcase,
} from "react-icons/fa";

const StepProgressIndicator = ({ currentStep, totalSteps = 5 }) => {
  const steps = [
    { label: "Personal", icon: FaUser },
    { label: "Academic", icon: FaGraduationCap },
    { label: "Insurance", icon: FaShieldAlt },
    { label: "Emergency", icon: FaPhone },
    { label: "Internship", icon: FaBriefcase },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      {/* Progress bar - visible on mobile */}
      <div className="block sm:hidden w-full bg-gray-200 h-2 rounded-full mb-6">
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Steps container */}
      <div className="relative flex flex-col sm:flex-row justify-between">
        {/* Connecting line - hidden on mobile */}
        <div className="hidden sm:block absolute top-7 left-0 w-full h-0.5 bg-gray-200" />
        <div
          className="hidden sm:block absolute top-7 left-0 h-0.5 bg-primary-600 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="flex flex-row sm:w-full justify-between relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;

            return (
              <div
                key={index}
                className={`
                  flex flex-col items-center relative
                  ${index < steps.length - 1 ? "flex-1 sm:flex-initial" : ""}
                `}
              >
                {/* Step circle */}
                <div
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    transition-all duration-300 z-10
                    ${
                      isCompleted
                        ? "bg-primary-600"
                        : isActive
                        ? "bg-primary-600"
                        : "bg-gray-200"
                    }
                    ${isCompleted || isActive ? "text-white" : "text-gray-400"}
                  `}
                >
                  <Icon className="w-7 h-7" />
                </div>

                {/* Label */}
                <span
                  className={`
                  mt-2 text-xs sm:text-sm font-semibold font-nunito-sans text-center
                  ${
                    isActive
                      ? "text-primary-600"
                      : isCompleted
                      ? "text-primary-600"
                      : "text-gray-500"
                  }
                `}
                >
                  {step.label}
                </span>

                {/* Mobile connecting line */}
                {index < steps.length - 1 && (
                  <div className="sm:hidden w-full flex-1 h-0.5 bg-gray-200 absolute top-7 left-1/2">
                    <div
                      className="h-full bg-primary-600 transition-all duration-300"
                      style={{
                        width: isCompleted ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepProgressIndicator;
