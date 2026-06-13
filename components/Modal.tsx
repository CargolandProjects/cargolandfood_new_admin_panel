"use client";

import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: "error" | "success" | "warning" | "info";
  actionLabel?: string;
  onAction?: () => void;
}

export default function Modal({
  isOpen,
  title,
  message,
  onClose,
  type = "error",
  actionLabel = "Close",
  onAction,
}: ModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "bg-red-100",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "bg-green-100",
      iconColor: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "bg-yellow-100",
      iconColor: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "bg-blue-100",
      iconColor: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const style = typeStyles[type];

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    onClose();
  };

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
          className={`w-full max-w-md rounded-lg border ${style.border} ${style.bg} shadow-lg`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${style.icon}`}>
                {type === "error" && (
                  <svg
                    className={`w-6 h-6 ${style.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {type === "success" && (
                  <svg
                    className={`w-6 h-6 ${style.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {type === "warning" && (
                  <svg
                    className={`w-6 h-6 ${style.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4v2m0 4v2M7.08 6.06a9 9 0 1 1 9.84 9.84M7.08 6.06l2.83 2.83m0 0l2.83 2.83"
                    />
                  </svg>
                )}
                {type === "info" && (
                  <svg
                    className={`w-6 h-6 ${style.iconColor}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-200 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${style.button}`}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
