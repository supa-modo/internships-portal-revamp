// import React, { useState } from "react";
// import { IoClose } from "react-icons/io5";
// import { FaRegUser } from "react-icons/fa";

// const ApplicationDetails = ({
//   application,
//   isOpen,
//   onClose,
//   onEdit,
//   onDelete,
// }) => {
//   if (!isOpen) return null;

//   const [isEditing, setIsEditing] = useState(false);
//   const [editedInternship, setEditedInternship] = useState({
//     department: application.department,
//     supervisor: application.supervisor,
//     startDate: application.startDate,
//     endDate: application.endDate,
//   });
//   const [status, setStatus] = useState(application.status || "Pending");

//   const departments = [
//     "Engineering",
//     "Finance",
//     "HR",
//     "Marketing",
//     "Operations",
//   ];
//   const supervisors = ["Ms. Green", "Mr. Brown", "Dr. White", "Mrs. Black"];
//   const statuses = ["Pending", "Under Review", "Archived"];

//   const handleUpdate = () => {
//     onEdit({ ...application, ...editedInternship });
//     setIsEditing(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative w-[900px] bg-white rounded-lg">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-bold">Internship Application Details</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <IoClose className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="flex p-6 gap-6">
//           {/* Left Side - Personal Info */}
//           <div className="w-[300px] bg-yellow-50 rounded-lg p-4">
//             <div className="flex flex-col items-center mb-4">
//               <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
//                 <FaRegUser className="w-10 h-10 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-bold">{application.fullName}</h3>
//               <p className="text-sm text-gray-500">
//                 ID/Passport No: {application.passportNo}
//               </p>
//             </div>
//             <div className="space-y-3">
//               <div className="text-sm">
//                 <p className="text-gray-500">Email:</p>
//                 <p className="font-medium">{application.email}</p>
//               </div>
//               <div className="text-sm">
//                 <p className="text-gray-500">Phone:</p>
//                 <p className="font-medium">{application.phone}</p>
//               </div>
//               <div className="text-sm">
//                 <p className="text-gray-500">Nationality:</p>
//                 <p className="font-medium">{application.nationality}</p>
//               </div>
//               <div className="text-sm">
//                 <p className="text-gray-500">Address:</p>
//                 <p className="font-medium">{application.address}</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Details Cards */}
//           <div className="flex-1 space-y-6">
//             {/* Status Update */}
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setIsEditing(!isEditing)}
//                   className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                 >
//                   {isEditing ? "Cancel Edit" : "Edit Application"}
//                 </button>
//                 <button
//                   onClick={onDelete}
//                   className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
//                 >
//                   Delete Application
//                 </button>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm font-medium">Application Status:</span>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   {statuses.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Education Details Card */}
//             <div className="bg-white border rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-4 text-green-700">
//                 Education Details
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Institution:</p>
//                   <p className="font-medium">{application.institution}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Course:</p>
//                   <p className="font-medium">{application.course}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Current Year:</p>
//                   <p className="font-medium">{application.currentYear}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Academic Award:</p>
//                   <p className="font-medium">{application.academicAward}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Internship Details Card */}
//             <div className="bg-white border rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-4 text-green-700">
//                 Internship
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 {isEditing ? (
//                   <>
//                     <div>
//                       <p className="text-sm text-gray-500">Department:</p>
//                       <select
//                         value={editedInternship.department}
//                         onChange={(e) =>
//                           setEditedInternship({
//                             ...editedInternship,
//                             department: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                       >
//                         {departments.map((dept) => (
//                           <option key={dept} value={dept}>
//                             {dept}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Supervisor:</p>
//                       <select
//                         value={editedInternship.supervisor}
//                         onChange={(e) =>
//                           setEditedInternship({
//                             ...editedInternship,
//                             supervisor: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                       >
//                         {supervisors.map((sup) => (
//                           <option key={sup} value={sup}>
//                             {sup}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Start Date:</p>
//                       <input
//                         type="date"
//                         value={editedInternship.startDate}
//                         onChange={(e) =>
//                           setEditedInternship({
//                             ...editedInternship,
//                             startDate: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                       />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">End Date:</p>
//                       <input
//                         type="date"
//                         value={editedInternship.endDate}
//                         onChange={(e) =>
//                           setEditedInternship({
//                             ...editedInternship,
//                             endDate: e.target.value,
//                           })
//                         }
//                         className="w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                       />
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div>
//                       <p className="text-sm text-gray-500">Department:</p>
//                       <p className="font-medium">{application.department}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Supervisor:</p>
//                       <p className="font-medium">{application.supervisor}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">Start Date:</p>
//                       <p className="font-medium">{application.startDate}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-500">End Date:</p>
//                       <p className="font-medium">{application.endDate}</p>
//                     </div>
//                   </>
//                 )}
//               </div>
//               {isEditing && (
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={handleUpdate}
//                     className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
//                   >
//                     Update Application
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Insurance Details Card */}
//             <div className="bg-white border rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-4 text-green-700">
//                 Insurance & Emergency
//               </h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Insurance Company:</p>
//                   <p className="font-medium">{application.insuranceCompany}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Policy Number:</p>
//                   <p className="font-medium">{application.policyNo}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Expiry Date:</p>
//                   <p className="font-medium">{application.expiryDate}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Emergency Contact:</p>
//                   <p className="font-medium">{application.emergencyContact}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Emergency Phone:</p>
//                   <p className="font-medium">{application.emergencyPhone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Emergency Email:</p>
//                   <p className="font-medium">{application.emergencyEmail}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Uploaded Documents */}
//             <div className="bg-white border rounded-lg p-4">
//               <h3 className="text-lg font-semibold mb-4 text-green-700">
//                 Uploaded Documents
//               </h3>
//               <div className="space-y-2">
//                 {application.documents?.map((doc, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center gap-2 text-blue-600 hover:underline"
//                   >
//                     <span className="text-sm">{doc.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicationDetails;

import React from "react";
import { IoClose } from "react-icons/io5";
import {
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaShieldAlt,
} from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";

const ApplicationDetails = ({
  application,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen) return null;

  const statuses = ["Pending", "Under Review", "Archived"];

  const sections = [
    {
      title: "Education Details",
      icon: <FaGraduationCap className="w-5 h-5 text-blue-600" />,
      content: [
        { label: "Institution", value: application.institution },
        { label: "Course", value: application.course },
        { label: "Current Year", value: application.currentYear },
        { label: "Academic Award", value: application.academicAward },
      ],
    },
    {
      title: "Internship Information",
      icon: <FaBriefcase className="w-5 h-5 text-purple-600" />,
      content: [
        { label: "Department", value: application.department },
        { label: "Supervisor", value: application.supervisor },
        { label: "Start Date", value: application.startDate },
        { label: "End Date", value: application.endDate },
      ],
    },
    {
      title: "Insurance & Emergency",
      icon: <FaShieldAlt className="w-5 h-5 text-red-600" />,
      content: [
        { label: "Insurance Company", value: application.insuranceCompany },
        { label: "Policy Number", value: application.policyNo },
        { label: "Expiry Date", value: application.expiryDate },
        { label: "Emergency Contact", value: application.emergencyContact },
        { label: "Emergency Phone", value: application.emergencyPhone },
        { label: "Emergency Email", value: application.emergencyEmail },
      ],
    },
  ];

  return (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <FaUser className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Application Details
              </h2>
              
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
          <div className="flex p-6 gap-6">
            {/* Left Side - Personal Info */}
            <div className="w-[300px] bg-gray-200 rounded-lg p-4">
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                  <FaRegUser className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold">{application.fullName}</h3>
                <p className="text-sm text-gray-500">
                  ID/Passport No: {application.passportNo}
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-500">Email:</p>
                  <p className="font-medium">{application.email}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Phone:</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Nationality:</p>
                  <p className="font-medium">{application.nationality}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Address:</p>
                  <p className="font-medium">{application.address}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Submitted on:</p>
                  <p className="font-medium">{application.dateSubmitted}</p>
                </div>
              </div>


               {/* Documents Section */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Uploaded Documents
            </h3>
            <div className="flex flex-col space-y-2">
              {application.documents?.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-sm font-medium">
                      PDF
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {doc.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
            </div>

            {/* Right Side - Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
                    {section.icon}
                    <h3 className="font-semibold text-gray-800">
                      {section.title}
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {section.content.map((item, i) => (
                      <div key={i} className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          {item.label}
                        </span>
                        <span className="font-medium text-gray-800">
                          {item.value || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

         
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Application Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete Application
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            Edit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
