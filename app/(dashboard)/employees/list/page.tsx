"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import CreateStaffModal from "@/components/CreateStaffModal";
import { fetchStaffList, type Staff } from "@/lib/api/staff";

interface Employee {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  permissions: number;
  joinDate: string;
  status: "Active" | "On Leave" | "Suspended";
  avatar?: string;
  rating?: number;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Super Admin",
    permissions: 3,
    joinDate: "12 Oct, 2025",
    status: "Active",
    rating: 0.0,
  },
  {
    id: "2",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Super Admin",
    permissions: 2,
    joinDate: "12 Oct, 2025",
    status: "On Leave",
    rating: 0.0,
  },
  {
    id: "3",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Admin",
    permissions: 4,
    joinDate: "12 Oct, 2025",
    status: "Suspended",
    rating: 0.0,
  },
  {
    id: "4",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Admin",
    permissions: 1,
    joinDate: "12 Oct, 2025",
    status: "On Leave",
    rating: 0.0,
  },
  {
    id: "5",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Employee",
    permissions: 6,
    joinDate: "12 Oct, 2025",
    status: "Suspended",
    rating: 0.0,
  },
  {
    id: "6",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Employee",
    permissions: 0,
    joinDate: "12 Oct, 2025",
    status: "On Leave",
    rating: 0.0,
  },
  {
    id: "7",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Admin",
    permissions: 0,
    joinDate: "12 Oct, 2025",
    status: "Suspended",
    rating: 0.0,
  },
  {
    id: "8",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Employee",
    permissions: 0,
    joinDate: "12 Oct, 2025",
    status: "On Leave",
    rating: 0.0,
  },
  {
    id: "9",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Admin",
    permissions: 8,
    joinDate: "12 Oct, 2025",
    status: "Suspended",
    rating: 0.0,
  },
  {
    id: "10",
    name: "Johan Liebert",
    email: "johan@example.com",
    mobileNumber: "09123456789",
    role: "Admin",
    permissions: 7,
    joinDate: "12 Oct, 2025",
    status: "On Leave",
    rating: 0.0,
  },
];

export default function EmployeeListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [employees, setEmployees] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const itemsPerPage = 10;

  // Dummy data for testing
  const dummyEmployees: Staff[] = Array.from({ length: 45 }, (_, i) => ({
    id: `${i + 1}`,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@example.com`,
    role: i % 3 === 0 ? "ADMIN" : "EMPLOYEE",
    permissions: ["VENDOR_VIEW", "ORDER_VIEW"],
    status: i % 2 === 0 ? "ACTIVE" : "INACTIVE",
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        // Using dummy data for testing pagination
        // const allData = dummyEmployees;
        const allData = await fetchStaffList({
          page: currentPage,
          limit: itemsPerPage,
        });
        
        setTotalEmployees(allData.length);
        setTotalPages(Math.ceil(allData.length / itemsPerPage));
        
        // Paginate the data
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setEmployees(allData.slice(startIndex, endIndex));
        setError(null);
      } catch (err) {
        setError("Failed to load employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [currentPage]);

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      "Super Admin": "text-red-600",
      "Admin": "text-blue-600",
      "Employee": "text-orange-600",
    };
    return colors[role] || "text-gray-600";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      "ACTIVE": { bg: "bg-green-100", text: "text-green-700" },
      "INACTIVE": { bg: "bg-gray-200", text: "text-gray-700" },
      "Active": { bg: "bg-green-100", text: "text-green-700" },
      "On Leave": { bg: "bg-yellow-100", text: "text-yellow-700" },
      "Suspended": { bg: "bg-gray-200", text: "text-gray-700" },
    };
    return colors[status] || { bg: "bg-gray-100", text: "text-gray-600" };
  };

  return (
    <div className="min-h-screen p-8 font-sans text-[#4B5563] w-full bg-gray-50/30">
      <div className="w-full space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Employee"
            count={totalEmployees.toString()}
            unit="Staffs"
            change="+2%"
            changeType="positive"
          />
          <StatCard
            label="New Hires"
            count={dummyEmployees.slice(0, 5).length.toString()}
            unit="New Staffs"
            change="+2"
            changeType="positive"
          />
          <StatCard
            label="On Leave"
            count={dummyEmployees.filter(e => e.status === "INACTIVE").length.toString()}
            unit="Staffs"
            change="-4"
            changeType="negative"
          />
          <StatCard
            label="Active Employees"
            count={dummyEmployees.filter(e => e.status === "ACTIVE").length.toString()}
            unit="Staffs"
            change="+4"
            changeType="positive"
          />
        </div>

        {/* Employee List Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-2.5 text-sm focus:border-orange-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  {selectedRole}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  {selectedStatus}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-200"
              >
                <Plus className="w-4 h-4" />
                Create New Staff
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">Employee Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">Mobile Number</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">Permission</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">Join Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-[12px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading employees...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center">
                      <p className="text-red-600">{error}</p>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center">
                      <p className="text-gray-600">No employees found</p>
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10">
                            <Image
                              src="/images/icons/profile_picture.png"
                              alt={employee.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[12px] font-medium text-gray-900">{employee.name}</p>
                            <p className="text-[11px] text-gray-500">⭐ 0.0</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-gray-600">{employee.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[12px] font-semibold ${getRoleColor(employee.role)}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-gray-600">{employee.permissions.length}</td>
                      <td className="py-3 px-4 text-[12px] text-gray-600">
                        {new Date(employee.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${getStatusColor(employee.status).bg} ${getStatusColor(employee.status).text}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-gray-400 hover:text-gray-600">•••</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                    page === currentPage 
                      ? "bg-orange-100 text-orange-600 font-bold" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Page {currentPage} of {totalPages} • Showing {employees.length} of {totalEmployees} employees
          </div>
        </div>
      </div>

      {/* Create Staff Modal */}
      <CreateStaffModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          // Refresh employee list here if needed
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}

function StatCard({
  label,
  count,
  unit,
  change,
  changeType,
}: {
  label: string;
  count: string;
  unit: string;
  change: string;
  changeType: "positive" | "negative";
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <p className="text-[13px] font-medium text-gray-500 mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{count}</p>
          <p className="text-[11px] text-gray-400 mt-1">{unit}</p>
        </div>
        <p className={`text-sm font-semibold ${changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
          {change}
        </p>
      </div>
    </div>
  );
}
