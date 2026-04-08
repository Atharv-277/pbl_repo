import {
  CalendarDaysIcon,
  BellIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ show, onClose }) {
  const [testResultCount] = useState(5);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleMyAppointments = () => {
    navigate("/patientDashboard?section=appointments");
    onClose();
  };

  const goToPatientSection = (section) => {
    navigate(`/patientDashboard?section=${section}`);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
    onClose();
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  const menuItemClass =
    "group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-700";

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          show ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-[320px] max-w-[90vw] bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Patient Panel</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 transition"
          >
            <XMarkIcon className="h-6 w-6 text-slate-700" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Profile Card */}
          <div className="px-5 pt-5">
            <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-3xl font-bold text-white shadow-lg">
                {getUserInitial()}
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-slate-900">
                  {user?.name || "User"}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Patient Portal
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="mt-7 px-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Menu
            </p>

            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={handleMyAppointments}
                    className="flex w-full items-center gap-3 rounded-2xl bg-emerald-500 px-4 py-3 text-left text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600"
                  >
                    <CalendarDaysIcon className="h-5 w-5" />
                    My Appointments
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => goToPatientSection("notifications")}
                    className={menuItemClass}
                  >
                    <BellIcon className="h-5 w-5 text-rose-500" />
                    Notifications
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => goToPatientSection("settings")}
                    className={menuItemClass}
                  >
                    <Cog6ToothIcon className="h-5 w-5 text-emerald-500" />
                    Settings
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => goToPatientSection("overview")}
                    className={`${menuItemClass} justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <DocumentTextIcon className="h-5 w-5 text-sky-500" />
                      <span>Test Results</span>
                    </div>

                    {testResultCount > 0 && (
                      <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                        {testResultCount}
                      </span>
                    )}
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/contact");
                      onClose();
                    }}
                    className={menuItemClass}
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-amber-500" />
                    Feedback
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-100 px-5 py-5 bg-slate-50">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 w-full rounded-full bg-emerald-100 overflow-hidden">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            </div>
          </div>

          {/* Help Card */}
          <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              Help & Support
            </div>
            <div className="mt-1 text-sm text-slate-500">
              MediConnect Care Team
            </div>
            <div className="mt-2 text-lg font-bold text-emerald-600">
              24/7 Online Care
            </div>
          </div>

          {/* Logout */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}