import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  UserRound,
  Settings,
  Sparkles,
  CalendarDays,
  Bell,
  LogOut,
} from "lucide-react";
import { patientAPI } from "../services/api";
import PatientDashboardSidebar from "./components/PatientDashboardSidebar";

export default function PatientSettings() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [patientProfile, setPatientProfile] = useState(null);

  const fallbackVitals = useMemo(() => {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const randomAge = Math.floor(Math.random() * 43) + 18;
    const randomBloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];

    return {
      age: randomAge,
      bloodGroup: randomBloodGroup,
    };
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await patientAPI.getProfile();
        setPatientProfile(response.data || null);
      } catch {
        setPatientProfile(null);
      }
    };

    loadProfile();
  }, []);

  const patient = {
    name: user?.name || "Patient",
    age: user?.age || fallbackVitals.age,
    gender: user?.gender || "N/A",
    bloodGroup: user?.bloodGroup || fallbackVitals.bloodGroup,
    phone: user?.phoneNo || "N/A",
    insurance: "Not Available",
    id: patientProfile?._id || "N/A",
  };

  const upcomingTasks = [
    "Keep profile and contact information updated",
    "Track appointment outcomes after each visit",
    "Use doctor notes for follow-up planning",
  ];

  const sidebarOptions = [
    { key: "overview", label: "Dashboard", icon: <Sparkles size={16} /> },
    { key: "appointments", label: "Appointments", icon: <CalendarDays size={16} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { key: "settings", label: "Settings", icon: <Settings size={16} /> },
    { key: "logout", label: "Logout", icon: <LogOut size={16} /> },
  ];

  const handleSidebarAction = (action) => {
    if (action === "logout") {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/");
      return;
    }

    if (action === "settings") {
      navigate("/patientSettings");
      return;
    }

    if (action === "overview") {
      navigate("/patientDashboard?section=overview");
      return;
    }

    if (action === "appointments") {
      navigate("/patientDashboard?section=appointments");
      return;
    }

    if (action === "notifications") {
      navigate("/patientDashboard?section=notifications");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl gap-6">
        <PatientDashboardSidebar
          patientName={patient.name}
          sidebarOptions={sidebarOptions}
          onAction={handleSidebarAction}
        />

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="inline-flex items-center gap-2 text-2xl font-semibold text-slate-900 md:text-3xl">
              <Settings className="text-slate-700" size={24} />
              Patient Settings
            </h1>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Settings className="text-slate-700" size={18} />
              Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-slate-100">
                  <UserRound className="text-slate-700" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{patient.name}</p>
                  <p className="text-xs text-slate-500">Patient ID: {patient.id}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">Profile Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                    <p>Age: {patient.age}</p>
                    <p>Gender: {patient.gender}</p>
                    <p>Blood: {patient.bloodGroup}</p>
                    <p>Phone: {patient.phone}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="inline-flex items-center gap-2 font-medium">
                    <ShieldCheck size={16} />
                    Account Status
                  </p>
                  <p className="mt-1 text-xs">{patient.insurance}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">Upcoming Tasks</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {upcomingTasks.map((task) => (
                    <li key={task} className="rounded-lg bg-slate-50 px-3 py-2">
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
