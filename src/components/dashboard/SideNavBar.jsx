import React, { useState, useEffect } from "react";
import { IoArchive, IoDocumentText } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { MdEditCalendar, MdOutlineAdminPanelSettings } from "react-icons/md";

import {
  FaFileCircleCheck,
  FaFileCircleExclamation,
  FaFileSignature,
} from "react-icons/fa6";
import { BsArchive, BsUiChecks } from "react-icons/bs";
import { BiSolidReport } from "react-icons/bi";
import axiosInstance from "../../services/api";

const SideNavbar = ({ activeItem = "all", onMenuClick }) => {
  const [counts, setCounts] = useState({
    pending: 0,
    "under-review": 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosInstance.get(
          "/internship-applications/applications/counts"
        );
        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const menuItems = [
    { id: "all", label: "All Applications", icon: IoDocumentText, count: null },
    {
      id: "under-review",
      label: "Under Review",
      icon: FaRegClock,
      count: counts["under-review"] || 0,
    },
    {
      id: "pending",
      label: "Pending Applications",
      icon: FaFileCircleExclamation,
      count: counts.pending || 0,
    },
    {
      id: "approved",
      label: "Approved Applications",
      icon: BsUiChecks,
      count: null,
    },
    {
      id: "archived",
      label: "Archived Applications",
      icon: IoArchive,
      count: null,
    },
    {
      id: "extend",
      label: "Extend Internship Period",
      icon: MdEditCalendar,
      count: null,
    },
    {
      id: "letters",
      label: "Signed Letters",
      icon: FaFileSignature,
      count: null,
    },
    {
      id: "reports",
      label: "Internship Reports",
      icon: BiSolidReport,
      count: null,
    },
    {
      id: "policy",
      label: "Internship Policy Content",
      icon: AiOutlineEdit,
      count: null,
    },
    {
      id: "super-admin",
      label: "Super Admin Console",
      icon: MdOutlineAdminPanelSettings,
      count: null,
    },
  ];

  return (
    <div className="w-72 sticky top-28 h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-lg p-4 space-y-2">
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => onMenuClick(item.id)}
          className={`flex items-center justify-between px-4 py-3 font-nunito-sans  rounded-lg cursor-pointer transition-all
            ${
              activeItem === item.id
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          <div className="flex items-center gap-3">
            <item.icon
              className={`w-6 h-6 ${
                activeItem === item.id ? "text-white" : "text-primary-700"
              }`}
            />
            <span className="text-[15px] font-semibold">{item.label}</span>
          </div>
          {item.count && (
            <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-lg">
              {item.count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SideNavbar;
