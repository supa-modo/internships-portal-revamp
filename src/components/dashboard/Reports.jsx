import React, { useState, useEffect } from "react";
import { LuDownload } from "react-icons/lu";
import { IoPrintOutline } from "react-icons/io5";
import { IoFilter, IoClose } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateFullReportPDF,
  generateReportPDF,
} from "../../utils/generateReportPDF";
import { axiosInstance } from "../../services/api";
import NotificationModal from "../common/NotificationModal";
import nationalitiesData from "../../data/Nationalities.json";
import supervisorsData from "../../data/eacSupervisors.json";
import depts_unitsData from "../../data/eacDepartments.json";
import { TbLoader, TbChevronLeft, TbChevronRight } from "react-icons/tb";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    department: "",
    supervisor: "",
    institution: "",
    nationality: "",
    duration: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    underReview: 0,
    pending: 0,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const depts_units = [
    "Select Internship Department",
    ...depts_unitsData.units,
  ];

  const nationalityOptions = [
    { value: "", label: "Select Nationality" },
    ...nationalitiesData.nationalities.map((nat) => ({
      value: nat.nationality,
      label: nat.nationality,
    })),
  ];

  const supervisorOptions = [
    { value: "", label: "Select Internship Supervisor" },
    ...supervisorsData.supervisors.map((supervisor) => ({
      value: supervisor,
      label: supervisor,
    })),
  ];

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get(
        "/internship-applications/stats"
      );
      setStats({
        total: response.data.total,
        approved: response.data.approved,
        underReview: response.data.underReview,
        pending: response.data.pending,
      });
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to fetch stats",
        type: "error",
      });
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axiosInstance.get(
        `/internship-applications/filtered?${queryParams}`
      );
      setReports(response.data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to generate report",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = reports.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto pb-4 px-4 min-h-[calc(100vh-12rem)] bg-gray-50 rounded-xl shadow-md">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-lg md:text-[1.3rem] font-nunito-sans text-primary-700 font-extrabold mb-2">
          Internship Reports Dashboard
        </h1>
        <p className="text-gray-600">
          Generate and manage internship reports with advanced filtering options
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg"
        >
          <h3 className="text-sm font-medium opacity-90">Total Applications</h3>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg"
        >
          <h3 className="text-sm font-medium opacity-90">Approved</h3>
          <p className="text-3xl font-bold mt-2">{stats.approved}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg"
        >
          <h3 className="text-sm font-medium opacity-90">Under Review</h3>
          <p className="text-3xl font-bold mt-2">{stats.underReview}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-lg"
        >
          <h3 className="text-sm font-medium opacity-90">Pending</h3>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-50 rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                showFilters
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {showFilters ? <IoClose size={20} /> : <IoFilter size={20} />}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </motion.button>
            <button
              onClick={handleGenerateReport}
              className="bg-primary-700  text-white px-8 py-2 rounded-lg font-medium hover:bg-primary-600 transition-all flex items-center gap-2"
            >
              <TbLoader size={20} className="" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-gray-200 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                {/* ... Other filter inputs with similar styling ... */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Results Table */}
        <div className="rounded-2xl px-6 pb-14">
          {/* Table */}
          <div className="overflow-hidden border-gray-300 rounded-2xl">
            <table className="w-full">
              <thead className="border border-primary-600">
                <tr className="bg-primary-700">
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    #
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    Name
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    Department
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    Supervisor
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    Start Date
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    End Date
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-semibold text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((report, index) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={report.id || index}
                      className="border-x border-gray-300 hover:bg-amber-100 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600 text-center">
                        {startIndex + index + 1}.
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600">
                        {`${report.surname} ${report.firstName} ${
                          report.otherNames || ""
                        }`}
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600">
                        {report.internshipDepartment}
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600">
                        {report.internshipSupervisor}
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600">
                        {new Date(
                          report.internshipStartDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600">
                        {new Date(
                          report.internshipEndDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600">
                        {report.status}
                      </td>
                      <td className="px-6 py-4 text-sm border-b border-gray-200 text-gray-600">
                        <button
                          onClick={() => generateReportPDF(report)}
                          className="flex items-center gap-2 bg-green-700 text-white px-2 py-[4.5px] rounded hover:bg-green-600"
                        >
                          <LuDownload />
                          Download PDF
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 font-semibold border-b border-gray-300 border-x text-center text-gray-400"
                    >
                      No reports found. Use the filter button above to add application filters and click Generate
                      Report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center border-x border-b rounded-b-2xl border-gray-300 justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, reports.length)}{" "}
                of {reports.length} entries
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 bg-white border font-nunito-sans border-gray-300 rounded-lg text-sm text-primary-600 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {[10, 25, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value} per page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TbChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - (4 - i);
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3.5 py-1 rounded-lg text-sm font-medium transition-colors
            ${
              currentPage === pageNum
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TbChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {reports.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateFullReportPDF(reports)}
                className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <LuDownload size={20} />
                Download Full Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <IoPrintOutline size={20} />
                Print Report
              </motion.button>
            </div>
          </div>
        )}
      </div>

      <NotificationModal
        isOpen={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
        type={notification.type}
        message={notification.message}
      />
    </div>
  );
};

export default Reports;
