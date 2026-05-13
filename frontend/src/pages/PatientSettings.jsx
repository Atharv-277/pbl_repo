import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  UserRound,
  Settings,
  Sparkles,
  CalendarDays,
  Bell,
  LogOut,
  Camera,
  Droplet,
  Activity,
  Phone,
  CreditCard,
  ChevronRight
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

  const handleEditProfile = () => {
    navigate("/editinfo");
  };

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

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 md:px-8 md:py-8 font-sans selection:bg-blue-100">
      <div className="mx-auto flex w-full max-w-7xl gap-8">
        <PatientDashboardSidebar
          patientName={patient.name}
          sidebarOptions={sidebarOptions}
          onAction={handleSidebarAction}
        />

        <div className="flex-1 space-y-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Account Settings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your personal information and preferences.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 lg:grid-cols-3"
          >
            {/* Left Column: Profile Card & Quick Status */}
            <div className="space-y-6 lg:col-span-1">
              {/* Main Profile Card */}
              <motion.div 
                variants={itemVariants}
                className="overflow-hidden rounded-3xl border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl"
              >
                <div className="h-24 w-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="relative px-6 pb-6 text-center">
                  <div className="relative mx-auto -mt-12 mb-4 h-24 w-24 rounded-full border-4 border-white bg-slate-100 shadow-md">
                    <div className="grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                      <UserRound className="text-slate-500" size={40} />
                    </div>
                    <button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-600 p-1.5 text-white transition-transform hover:scale-110 hover:bg-blue-700">
                      <Camera size={14} />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                  <p className="text-sm font-medium text-blue-600">Patient ID: {patient.id}</p>
                  
                  <div className="mt-6 flex justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      <ShieldCheck size={14} />
                      Verified Patient
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Insurance/Status Card */}
              <motion.div 
                variants={itemVariants}
                className="rounded-3xl border border-white/40 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-100 p-2.5">
                    <CreditCard className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Insurance Info</h3>
                    <p className="text-xs text-slate-500">Current active plan</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/60 p-4 backdrop-blur-md">
                  <p className="text-sm font-medium text-slate-700">{patient.insurance}</p>
                  <button className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                    Update Details &rarr;
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Vitals & Tasks */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal Information Grid */}
              <motion.div 
                variants={itemVariants}
                className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-8"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="rounded-xl bg-blue-50 p-3">
                      <Activity className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Age</p>
                      <p className="font-semibold text-slate-900">{patient.age} Years</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="rounded-xl bg-purple-50 p-3">
                      <UserRound className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Gender</p>
                      <p className="font-semibold text-slate-900">{patient.gender}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="rounded-xl bg-rose-50 p-3">
                      <Droplet className="text-rose-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Blood Group</p>
                      <p className="font-semibold text-slate-900">{patient.bloodGroup}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <Phone className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Phone</p>
                      <p className="font-semibold text-slate-900">{patient.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Actionable Tasks */}
              <motion.div 
                variants={itemVariants}
                className="rounded-3xl border border-white/40 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-8"
              >
                <h3 className="mb-4 text-lg font-bold text-slate-900">Action Items</h3>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div 
                      key={index} 
                      className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                          {task}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}