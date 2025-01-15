import React, { useState, useMemo } from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

const DataTable = ({
  title,
  columns,
  data,
  filters,
  searchPlaceholder = "Search...",
  onRowClick,
  defaultItemsPerPage = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const handleSort = (key, index) => {
    // Skip sorting for first and last columns
    if (index === 0 || index === columns.length - 1) return;

    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleFilterClick = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const filteredAndSortedData = useMemo(() => {
    let processedData = [...data];

    // Apply search
    if (searchQuery) {
      processedData = processedData.filter((item) =>
        columns.some((column) =>
          String(item[column.accessor])
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        processedData = processedData.filter(
          (item) => String(item[key]) === String(value)
        );
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        const aValue = String(a[sortConfig.key]);
        const bValue = String(b[sortConfig.key]);
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return processedData;
  }, [data, searchQuery, activeFilters, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="rounded-2xl px-6 pt-3 pb-10 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-primary-700">{title}</h2>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-[40rem] pl-12 pr-4 py-2 font-semibold text-gray-600 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <IoMdClose className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filters */}
          {filters && (
            <div className="flex gap-3">
              {filters.map((filter) => (
                <div key={filter.key} className="flex gap-2">
                  {filter.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleFilterClick(filter.key, option.value)
                      }
                      className={`px-4 py-2 text-sm shadow-md font-medium rounded-lg transition-colors
                        ${
                          activeFilters[filter.key] === option.value
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border-gray-300 rounded-2xl">
        <table className="w-full">
          <thead className="border border-primary-600">
            <tr className="bg-primary-700">
              {columns.map((column, index) => (
                <th
                  key={column.accessor}
                  onClick={() => handleSort(column.accessor, index)}
                  className={`px-6 py-5 text-left text-sm font-semibold text-white ${
                    index !== 0 && index !== columns.length - 1
                      ? "cursor-pointer"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {index !== 0 && index !== columns.length - 1 && (
                      <HiMiniArrowsUpDown className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => onRowClick?.(item)}
                className="border-x border-gray-300 hover:bg-amber-50 cursor-pointer"
              >
                {columns.map((column) => (
                  <td
                    key={column.accessor}
                    className="px-6 py-3 text-sm border-b border-gray-200 text-gray-600"
                  >
                    {column.render
                      ? column.render(item)
                      : item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center border-x border-b rounded-b-2xl border-gray-300 justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredAndSortedData.length)} of{" "}
              {filteredAndSortedData.length} entries
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
    </div>
  );
};

export default DataTable;
