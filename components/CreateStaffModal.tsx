"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createStaff } from "@/lib/api/staff";

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PERMISSIONS = [
  "VENDOR_VIEW",
  "VENDOR_APPROVE",
  "VENDOR_REJECT",
  "VENDOR_SUSPEND",
  "VENDOR_UPDATE",
  "VENDOR_MENU_MANAGE",
  "RIDER_VIEW",
  "RIDER_APPROVE",
  "RIDER_REJECT",
  "RIDER_SUSPEND",
  "ORDER_VIEW",
  "ORDER_UPDATE",
  "DELIVERY_VIEW",
  "DELIVERY_MANAGE",
  "DISPUTE_MANAGE",
  "CUSTOMER_VIEW",
  "CUSTOMER_SUSPEND",
  "PROMOTION_CREATE",
  "PROMOTION_UPDATE",
  "PROMOTION_DISABLE",
  "STAFF_CREATE",
  "STAFF_UPDATE",
  "STAFF_DELETE",
  "STAFF_PERMISSIONS_ASSIGN",
  "AUDIT_VIEW",
  "SETTINGS_MANAGE",
  "SCHEDULE_VIEW",
  "SCHEDULE_CREATE",
  "SCHEDULE_UPDATE",
  "SCHEDULE_DELETE",
  "BANNER_VIEW",
  "BANNER_CREATE",
  "BANNER_UPDATE",
  "BANNER_DELETE",
  "DASHBOARD_VIEW",
];

export default function CreateStaffModal({ isOpen, onClose, onSuccess }: CreateStaffModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSelectAll = () => {
    if (selectedPermissions.length === PERMISSIONS.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions([...PERMISSIONS]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error("Full name is required");
      }
      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }
      if (!formData.password.trim()) {
        throw new Error("Password is required");
      }
      if (!formData.role) {
        throw new Error("Role is required");
      }
      if (selectedPermissions.length === 0) {
        throw new Error("Please select at least one permission");
      }

      await createStaff({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role as "ADMIN" | "EMPLOYEE",
        permissions: selectedPermissions,
      });

      // Reset form
      setFormData({ name: "", email: "", password: "", role: "" });
      setSelectedPermissions([]);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "", role: "" });
    setSelectedPermissions([]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-4xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900">Create New Staff</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Full name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 outline-none focus:border-orange-500 transition-colors"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 outline-none focus:border-orange-500 transition-colors"
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-gray-500 text-sm">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 outline-none focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="text-gray-500 text-sm">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 outline-none appearance-none bg-white focus:border-orange-500 transition-colors"
                  disabled={loading}
                >
                  <option value="">Select Role</option>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="absolute right-4 bottom-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <label className="text-gray-500 text-sm">Permission</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PERMISSIONS.map((permission) => (
                    <label key={permission} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        className="rounded"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">{permission.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  disabled={loading}
                >
                  {selectedPermissions.length === PERMISSIONS.length ? "Deselect all" : "Select all"}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-orange-100 text-orange-600 rounded-md text-sm font-bold hover:bg-orange-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
