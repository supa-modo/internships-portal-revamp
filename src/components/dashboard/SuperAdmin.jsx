import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaUserShield,
  FaHistory,
  FaChartBar,
  FaCog,
  FaKey,
  FaEnvelope,
  FaTrash,
  FaUserPlus,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";
import axiosInstance from "../../services/api";
import NotificationModal from "../common/NotificationModal";
import AddUserModal from "../common/AddNewUser";
import { FaUser } from "react-icons/fa6";

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/system-users/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAdded = (newUser) => {
    setUsers((prev) => [...prev, newUser]); // Add the new user to the list
    setIsAddUserModalOpen(false); // Close the modal
  };

  const handlePasswordReset = async (userId) => {
    setSelectedUser(users.find((u) => u.id === userId));
    setModalConfig({
      type: "confirm",
      title: "Reset Password",
      message: "Are you sure you want to reset this user's password?",
      onConfirm: async () => {
        try {
          await axiosInstance.post(
            `/system-users/users/${userId}/reset-password`
          );
          setModalConfig({
            type: "success",
            title: "Success",
            message: "Password reset email has been sent to the user.",
          });
        } catch (error) {
          setModalConfig({
            type: "error",
            title: "Error",
            message: "Failed to reset password. Please try again.",
          });
        }
      },
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = Object.values(user)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const tabs = [
    { id: "users", label: "Users Management", icon: FaUsers },
    { id: "roles", label: "Role Management", icon: FaUserShield },
    { id: "audit", label: "Audit Logs", icon: FaHistory },
    { id: "analytics", label: "System Analytics", icon: FaChartBar },
    { id: "settings", label: "System Settings", icon: FaCog },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>
        <button
          onClick={fetchUsers}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <TbRefresh className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="hr">HR</option>
          <option value="user">User</option>
        </select>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddUserModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaUserPlus className="w-4 h-4" />
          <span>Add User</span>
        </motion.button>
      </div>

      {/* Users Table */}
      <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 font-nunito-sans">
            <tr>
              <th className="px-4 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                <FaUser className="w-4 h-4" />
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-5 text-left text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y font-nunito-sans divide-gray-200">
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span>{index + 1} .</span>
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-bold">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-[15px] font-bold text-gray-700">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="pr-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-5 pb-1.5 pt-1 inline-flex text-[13px] leading-5 font-semibold rounded-lg ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "hr"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="pr-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium">
                  <div className="flex space-x-6">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePasswordReset(user.id)}
                      className="text-primary-600 flex items-center gap-2 bg-primary-100 px-4 py-1.5 rounded-lg border border-primary-600  hover:text-primary-900"
                      title="Reset Password"
                    >
                      <FaKey className="w-4 h-4" />
                      <span>Reset Password</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        /* Edit email logic */
                      }}
                      className="text-blue-600 flex items-center gap-2 bg-blue-100 px-4 py-1.5 rounded-lg border border-blue-600  hover:text-blue-900"
                      title="Edit Email"
                    >
                      <FaEnvelope className="w-4 h-4" />
                      <span>Edit Email</span>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        /* Delete user logic */
                      }}
                      className="text-red-600 flex items-center gap-2 bg-red-100 px-4 py-1.5 rounded-lg border border-red-600  hover:text-red-900"
                      title="Delete User"
                    >
                      <FaTrash className="w-4 h-4" />
                      <span>Delete User</span>
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalConfig.onConfirm}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default SuperAdmin;
