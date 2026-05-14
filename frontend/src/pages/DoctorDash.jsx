import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarClock,
  CalendarDays,
  Bell,
  UserRound,
  Search,
  ShieldCheck,
  Stethoscope,
  Clock3,
  CheckCircle2,
  XCircle,
  FilePenLine,
  LogOut,
  Camera,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Calendar from "./components/Calender";
import { appointmentAPI, doctorAPI, resolveAssetUrl } from "../services/api";

const toDateKey = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const formatStatus = (status) => {
  if (status === "scheduled") return "Scheduled";
  if (status === "completed") return "Completed";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
};

const getStatusStyles = (status) => {
  if (status === "completed" || status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "cancelled" || status === "rejected") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

const getRiskStyles = (risk) => {
  if (risk === "High") return "bg-red-100 text-red-700";
  if (risk === "Medium") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
};

export default function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [hideCancelled, setHideCancelled] = useState(false);
  const [hiddenAppointmentIds, setHiddenAppointmentIds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [statsPayload, setStatsPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestNotes, setRequestNotes] = useState({});
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState("");
  const [creatingFollowUp, setCreatingFollowUp] = useState(false);
  const [followUpForm, setFollowUpForm] = useState({
    patientId: "",
    date: "",
    time: "",
    description: "",
  });

  const [blockedSlotForm, setBlockedSlotForm] = useState({
    date: "",
    from: "",
    to: "",
    reason: "",
  });

  const [blockedSlots, setBlockedSlots] = useState([]);
  const navigate = useNavigate();

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardResponse, patientsResponse, doctorsResponse, blockedSlotsResponse] = await Promise.all([
        appointmentAPI.getDoctorDashboard(),
        doctorAPI.getMyPatients(),
        doctorAPI.getAllDoctors(),
        doctorAPI.getMyBlockedSlots(),
      ]);

      setAppointments(dashboardResponse.data?.appointments || []);
      setStatsPayload(dashboardResponse.data?.stats || null);
      setPatients(patientsResponse.data || []);

      const matchedDoctor = (doctorsResponse.data || []).find(
        (doctor) => String(doctor?.userId?._id) === String(user?._id)
      );
      setDoctorProfile(matchedDoctor || null);
      setBlockedSlots(blockedSlotsResponse.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctor dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const appointmentRows = useMemo(() => {
    return appointments.map((item) => {
      const patientUser = item?.patient?.userId;
      return {
        id: item?._id,
        patientId: item?.patient?._id,
        patient: patientUser?.name || "Unknown Patient",
        issue: item?.description || "General consultation",
        age: patientUser?.age || "N/A",
        gender: patientUser?.gender || "N/A",
        appointmentDate: item?.appointmentDate,
        createdAt: item?.createdAt,
        dateKey: toDateKey(item?.appointmentDate),
        time: item?.time || "Time not set",
        status: item?.status || "scheduled",
      };
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return appointmentRows
      .filter((item) => {
        const dateMatches = selectedDate ? item.dateKey === selectedDate : true;
        const hideCompletedMatch = hideCompleted ? (item.status !== "completed" && item.status !== "approved") : true;
        const hideCancelledMatch = hideCancelled ? (item.status !== "cancelled" && item.status !== "rejected") : true;
        const hiddenMatch = !hiddenAppointmentIds.includes(String(item.id));
        const searchMatches = normalizedSearch
          ? `${item.patient} ${item.issue}`.toLowerCase().includes(normalizedSearch)
          : true;
        return dateMatches && hideCompletedMatch && hideCancelledMatch && hiddenMatch && searchMatches;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || a.appointmentDate || 0).getTime();
        const timeB = new Date(b.createdAt || b.appointmentDate || 0).getTime();
        return timeB - timeA;
      });
  }, [appointmentRows, selectedDate, searchTerm, hideCompleted, hideCancelled, hiddenAppointmentIds]);

  const pendingRequests = useMemo(() => {
    return appointmentRows.filter((item) => item.status === "scheduled");
  }, [appointmentRows]);

  const weeklyCompletedCount = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    return appointmentRows.filter((item) => {
      if (item.status !== "completed" && item.status !== "approved") return false;
      const date = new Date(item.appointmentDate);
      return !Number.isNaN(date.getTime()) && date >= weekAgo && date <= now;
    }).length;
  }, [appointmentRows]);

  const patientsTable = useMemo(() => {
    return (patients || []).map((patient) => {
      const patientAppointments = appointmentRows.filter(
        (appointment) => String(appointment.patientId) === String(patient?._id)
      );

      const latest = patientAppointments
        .slice()
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];

      const count = patientAppointments.length;
      const risk = count >= 5 ? "High" : count >= 3 ? "Medium" : "Low";

      return {
        id: patient?._id,
        name: patient?.userId?.name || "Unknown",
        age: patient?.userId?.age || "N/A",
        gender: patient?.userId?.gender || "N/A",
        condition: latest?.issue || "General consultation",
        lastVisit: latest?.appointmentDate
          ? new Date(latest.appointmentDate).toLocaleDateString()
          : "No visits yet",
        risk,
      };
    });
  }, [patients, appointmentRows]);

  const followUpEligiblePatients = useMemo(() => {
    const map = new Map();

    appointmentRows
      .filter((appointment) => appointment.status === "completed" || appointment.status === "approved")
      .forEach((appointment) => {
        const id = String(appointment.patientId || "");
        if (!id || map.has(id)) return;
        map.set(id, {
          id,
          name: appointment.patient || "Unknown",
        });
      });

    return Array.from(map.values());
  }, [appointmentRows]);

  const stats = useMemo(() => {
    return [
      {
        title: "Today's Appointments",
        value: statsPayload?.todayAppointments ?? 0,
        icon: <CalendarDays size={20} />,
        trend: `${statsPayload?.monthAppointments ?? 0} this month`,
      },
      {
        title: "Pending Requests",
        value: pendingRequests.length,
        icon: <Clock3 size={20} />,
        trend: "Needs response",
      },
      {
        title: "Completed (Week)",
        value: weeklyCompletedCount,
        icon: <CheckCircle2 size={20} />,
        trend: "Last 7 days",
      },
      {
        title: "Active Patients",
        value: statsPayload?.activePatients ?? patients.length,
        icon: <UserRound size={20} />,
        trend: "Assigned records",
      },
    ];
  }, [statsPayload, pendingRequests.length, weeklyCompletedCount, patients.length]);

  const doctor = {
    name: doctorProfile?.name || user?.name || "Doctor",
    specialization: doctorProfile?.specialization || "General Physician",
    experience: doctorProfile?.experiance || doctorProfile?.experience || "N/A",
    rating: statsPayload?.completionRate ? `${statsPayload.completionRate}%` : "N/A",
  };

  const notifications = [
    `${pendingRequests.length} appointment request(s) require action`,
    `${statsPayload?.completedAppointments ?? 0} appointment(s) completed so far`,
    `${statsPayload?.totalAppointments ?? appointments.length} total appointments tracked`,
  ];

  const followUpTimeOptions = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  ];

  const handleRequestNoteChange = (id, note) => {
    setRequestNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleRequestStatus = async (id, status) => {
    setUpdatingAppointmentId(id);
    try {
      const response = await appointmentAPI.updateAppointmentStatus(id, {
        status,
        doctorNote: requestNotes[id] || "",
      });

      setAppointments((prev) =>
        prev.map((appointment) =>
          String(appointment._id) === String(id) ? response.data : appointment
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment status.");
    } finally {
      setUpdatingAppointmentId("");
    }
  };

  const handleBlockedSlotSubmit = async (event) => {
    event.preventDefault();

    if (!blockedSlotForm.date || !blockedSlotForm.from || !blockedSlotForm.to) {
      return;
    }

    try {
      const response = await doctorAPI.addBlockedSlot({
        date: blockedSlotForm.date,
        from: blockedSlotForm.from,
        to: blockedSlotForm.to,
        reason: blockedSlotForm.reason,
      });

      setBlockedSlots(response.data || []);
      setBlockedSlotForm({ date: "", from: "", to: "", reason: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add blocked slot.");
    }
  };

  const removeBlockedSlot = async (id) => {
    try {
      const response = await doctorAPI.deleteBlockedSlot(id);
      setBlockedSlots(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove blocked slot.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  const handleCreateFollowUp = async (event) => {
    event.preventDefault();

    if (!doctorProfile?._id) {
      setError("Doctor profile not loaded.");
      return;
    }

    if (!followUpForm.patientId || !followUpForm.date || !followUpForm.time) {
      setError("Please select patient, date, and time for follow-up visit.");
      return;
    }

    if (followUpEligiblePatients.length === 0) {
      setError("No eligible patient found. Only previously visited patients can be selected.");
      return;
    }

    try {
      setCreatingFollowUp(true);
      setError("");

      await appointmentAPI.createAppointment({
        doctorId: doctorProfile._id,
        patientId: followUpForm.patientId,
        appointmentDate: followUpForm.date,
        time: followUpForm.time,
        description: followUpForm.description?.trim() || "Doctor follow-up visit",
      });

      setFollowUpForm({
        patientId: "",
        date: "",
        time: "",
        description: "",
      });

      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create follow-up visit.");
    } finally {
      setCreatingFollowUp(false);
    }
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
      const response = await doctorAPI.uploadProfilePhoto(formData);
      // Update local storage so it persists across refreshes
      const updatedUser = { ...user, profileImage: response.data.profileImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Refresh dashboard to pull the latest profile info
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to upload profile photo:', err);
      alert('Failed to upload profile photo');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white/20 bg-white/10 flex items-center justify-center overflow-hidden shadow-xl transition-all group-hover:border-white/40">
                    {doctorProfile?.profileImage || user?.profileImage ? (
                      <img 
                        src={resolveAssetUrl(doctorProfile?.profileImage || user?.profileImage)} 
                        alt="Dr. Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-white/50">{doctor.name?.charAt(0) || 'D'}</span>
                    )}
                  </div>
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer backdrop-blur-sm">
                    <Camera size={24} className="mb-1" />
                    <span className="text-xs font-semibold">Change</span>
                    <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleProfilePhotoUpload} />
                  </label>
                </div>
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                    <ShieldCheck size={14} />
                    Clinical Command Center
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Welcome, Dr. {doctor.name}</h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
                    Live data from backend is now connected for appointments, patient list,
                    and dashboard insights.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={fetchDashboardData}
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                >
                  Refresh Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/80">Doctor Insights</p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span>Completion Rate</span>
                  <span className="font-semibold">{doctor.rating}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Specialization</span>
                  <span className="font-semibold">{doctor.specialization}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Experience</span>
                  <span className="font-semibold">{doctor.experience}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">{item.icon}</div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                  <ArrowUpRight size={12} />
                  Live
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-slate-900">{item.value}</h2>
              <p className="mt-1 text-sm font-medium text-slate-700">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.trend}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">Appointments + Calendar</h2>
                <label className="flex min-w-[220px] items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                  <Search size={16} className="text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search patient or issue"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none"
                  />
                </label>
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={hideCompleted}
                    onChange={(event) => setHideCompleted(event.target.checked)}
                    className="accent-emerald-600"
                  />
                  Hide completed
                </label>

                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={hideCancelled}
                    onChange={(event) => setHideCancelled(event.target.checked)}
                    className="accent-emerald-600"
                  />
                  Hide cancelled
                </label>

                <button
                  type="button"
                  onClick={() => setHiddenAppointmentIds([])}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Show hidden ({hiddenAppointmentIds.length})
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                <Calendar
                  appointments={appointmentRows}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />

                <div className="space-y-3">
                  {filteredAppointments.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                      No appointments found for selected filters.
                    </div>
                  ) : null}

                  {filteredAppointments.map((appointment) => (
                    <article
                      key={appointment.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{appointment.patient}</h3>
                          <p className="text-sm text-slate-600">{appointment.issue}</p>
                          <p className="text-xs text-slate-500">
                            {appointment.gender}, {appointment.age} yrs • {appointment.time}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                            appointment.status
                          )}`}
                        >
                          {formatStatus(appointment.status)}
                        </span>
                      </div>

                      {(appointment.status === "completed" || appointment.status === "cancelled" || appointment.status === "approved" || appointment.status === "rejected") ? (
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setHiddenAppointmentIds((prev) =>
                                prev.includes(String(appointment.id))
                                  ? prev
                                  : [...prev, String(appointment.id)]
                              )
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Remove from this list
                          </button>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Patient List</h2>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Condition</th>
                      <th className="px-4 py-3">Last Visit</th>
                      <th className="px-4 py-3">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    {patientsTable.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">{patient.name}</p>
                          <p className="text-xs text-slate-500">
                            {patient.id} • {patient.gender}, {patient.age} yrs
                          </p>
                        </td>
                        <td className="px-4 py-3">{patient.condition}</td>
                        <td className="px-4 py-3">{patient.lastVisit}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getRiskStyles(
                              patient.risk
                            )}`}
                          >
                            {patient.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Appointment Requests</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {pendingRequests.length} pending
                </span>
              </div>

              <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No pending requests right now.
                  </p>
                ) : null}

                {pendingRequests.map((request) => (
                  <article key={request.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{request.patient}</h3>
                        <p className="text-sm text-slate-600">{request.issue}</p>
                        <p className="text-xs text-slate-500">
                          {request.gender}, {request.age} yrs • {new Date(
                            request.appointmentDate
                          ).toLocaleDateString()} • {request.time}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                          request.status
                        )}`}
                      >
                        {formatStatus(request.status)}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                      <Activity size={14} />
                      Status update required
                    </div>

                    <label className="mb-3 block">
                      <span className="mb-1 inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                        <FilePenLine size={14} />
                        Doctor note (optional)
                      </span>
                      <textarea
                        rows={2}
                        value={requestNotes[request.id] || ""}
                        onChange={(event) => handleRequestNoteChange(request.id, event.target.value)}
                        placeholder="Add guidance or follow-up note"
                        className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-300"
                      />
                    </label>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={updatingAppointmentId === request.id}
                        onClick={() => handleRequestStatus(request.id, "approved")}
                        className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={updatingAppointmentId === request.id}
                        onClick={() => handleRequestStatus(request.id, "rejected")}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-60"
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <CalendarDays size={18} className="text-emerald-700" />
                Book Follow-up Visit
              </h2>

              <form className="space-y-3" onSubmit={handleCreateFollowUp}>
                <label className="block text-xs font-medium text-slate-600">
                  Patient
                  <select
                    value={followUpForm.patientId}
                    onChange={(event) =>
                      setFollowUpForm((prev) => ({ ...prev, patientId: event.target.value }))
                    }
                    disabled={followUpEligiblePatients.length === 0}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                  >
                    <option value="">Select visited patient</option>
                    {followUpEligiblePatients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </label>

                {followUpEligiblePatients.length === 0 ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    No patient has completed a visit yet. Follow-up can be booked only after first completed visit.
                  </p>
                ) : null}

                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-medium text-slate-600">
                    Date
                    <input
                      type="date"
                      value={followUpForm.date}
                      onChange={(event) =>
                        setFollowUpForm((prev) => ({ ...prev, date: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-600">
                    Time
                    <select
                      value={followUpForm.time}
                      onChange={(event) =>
                        setFollowUpForm((prev) => ({ ...prev, time: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                    >
                      <option value="">Select time</option>
                      {followUpTimeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block text-xs font-medium text-slate-600">
                  Note
                  <textarea
                    rows={2}
                    value={followUpForm.description}
                    onChange={(event) =>
                      setFollowUpForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                    placeholder="Follow-up purpose"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-300"
                  />
                </label>

                <button
                  type="submit"
                  disabled={creatingFollowUp}
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {creatingFollowUp ? "Booking..." : "Book Upcoming Visit"}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <CalendarClock size={18} className="text-blue-700" />
                Block Busy Time
              </h2>

              <form className="space-y-3" onSubmit={handleBlockedSlotSubmit}>
                <label className="block text-xs font-medium text-slate-600">
                  Date
                  <input
                    type="date"
                    value={blockedSlotForm.date}
                    onChange={(event) =>
                      setBlockedSlotForm((prev) => ({ ...prev, date: event.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-medium text-slate-600">
                    From
                    <input
                      type="time"
                      value={blockedSlotForm.from}
                      onChange={(event) =>
                        setBlockedSlotForm((prev) => ({ ...prev, from: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-600">
                    To
                    <input
                      type="time"
                      value={blockedSlotForm.to}
                      onChange={(event) =>
                        setBlockedSlotForm((prev) => ({ ...prev, to: event.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
                    />
                  </label>
                </div>

                <label className="block text-xs font-medium text-slate-600">
                  Reason
                  <input
                    type="text"
                    value={blockedSlotForm.reason}
                    onChange={(event) =>
                      setBlockedSlotForm((prev) => ({ ...prev, reason: event.target.value }))
                    }
                    placeholder="Surgery / Emergency / Meeting"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Add Blocked Slot
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Blocked Slots</h2>

              <div className="space-y-3">
                {blockedSlots.length === 0 ? (
                  <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                    No blocked slots yet.
                  </p>
                ) : null}

                {blockedSlots.map((slot) => (
                  <div key={slot._id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(slot.date).toLocaleDateString()} • {slot.from} - {slot.to}
                    </p>
                    <p className="text-xs text-slate-600">{slot.reason}</p>
                    <button
                      type="button"
                      onClick={() => removeBlockedSlot(slot._id)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <XCircle size={14} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Bell size={18} className="text-amber-600" /> Notifications
              </h2>
              <div className="space-y-3">
                {notifications.map((note, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Stethoscope size={18} className="text-blue-700" /> Doctor Profile
              </h2>
              <p className="text-sm text-slate-700">Dr. {doctor.name}</p>
              <p className="text-sm text-slate-600">{doctor.specialization}</p>
              <p className="text-sm text-slate-600">Experience: {doctor.experience}</p>
              <p className="text-sm text-slate-600 mt-1">Completion: {doctor.rating}</p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
