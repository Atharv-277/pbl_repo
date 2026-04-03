import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import Calendar from "./components/Calender";

export default function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [requests, setRequests] = useState([
    {
      id: 1,
      patient: "Aman Verma",
      issue: "Hair Loss",
      age: 28,
      gender: "Male",
      date: "2026-04-12",
      time: "02:00 PM",
      priority: "Normal",
      notes: "",
      status: "Pending",
    },
    {
      id: 2,
      patient: "Priya Singh",
      issue: "Rash Problem",
      age: 24,
      gender: "Female",
      date: "2026-04-12",
      time: "04:30 PM",
      priority: "High",
      notes: "",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Nikhil Rao",
      issue: "Eczema Follow-up",
      age: 33,
      gender: "Male",
      date: "2026-04-14",
      time: "11:30 AM",
      priority: "Normal",
      notes: "",
      status: "Pending",
    },
  ]);

  const [blockedSlotForm, setBlockedSlotForm] = useState({
    date: "",
    from: "",
    to: "",
    reason: "",
  });

  const [blockedSlots, setBlockedSlots] = useState([
    {
      id: 1,
      date: "2026-04-10",
      from: "13:00",
      to: "14:30",
      reason: "Surgery Round",
    },
  ]);

  const doctor = {
    name: "Dr. Amit Mehta",
    specialization: "Dermatologist",
    experience: "10 Years",
    patientsServed: 120,
    rating: 4.9,
  };

  const appointments = [
    {
      id: 1,
      patient: "Rahul Sharma",
      issue: "Skin Allergy",
      age: 31,
      gender: "Male",
      appointmentDate: "2026-04-12",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      patient: "Sneha Patil",
      issue: "Acne Treatment",
      age: 22,
      gender: "Female",
      appointmentDate: "2026-04-12",
      time: "11:30 AM",
      status: "Confirmed",
    },
    {
      id: 3,
      patient: "Meera Kulkarni",
      issue: "Psoriasis Review",
      age: 29,
      gender: "Female",
      appointmentDate: "2026-04-14",
      time: "09:45 AM",
      status: "Confirmed",
    },
    {
      id: 4,
      patient: "Karan Joshi",
      issue: "Mole Evaluation",
      age: 41,
      gender: "Male",
      appointmentDate: "2026-04-16",
      time: "12:15 PM",
      status: "Confirmed",
    },
  ];

  const notifications = [
    "New appointment request from Aman Verma",
    "Appointment cancelled by patient",
    "System update completed",
  ];

  const patients = [
    {
      id: "P-1001",
      name: "Rahul Sharma",
      age: 31,
      gender: "Male",
      condition: "Skin Allergy",
      lastVisit: "03 Apr 2026",
      risk: "Medium",
    },
    {
      id: "P-1002",
      name: "Sneha Patil",
      age: 22,
      gender: "Female",
      condition: "Acne Management",
      lastVisit: "01 Apr 2026",
      risk: "Low",
    },
    {
      id: "P-1003",
      name: "Meera Kulkarni",
      age: 29,
      gender: "Female",
      condition: "Psoriasis",
      lastVisit: "29 Mar 2026",
      risk: "High",
    },
    {
      id: "P-1004",
      name: "Karan Joshi",
      age: 41,
      gender: "Male",
      condition: "Mole Evaluation",
      lastVisit: "28 Mar 2026",
      risk: "Low",
    },
  ];

  const stats = [
    {
      title: "Today's Appointments",
      value: appointments.filter((item) => item.appointmentDate === "2026-04-12").length,
      icon: <CalendarDays size={20} />,
      trend: "2 teleconsult, 2 clinic",
    },
    {
      title: "Pending Requests",
      value: requests.filter((item) => item.status === "Pending").length,
      icon: <Clock3 size={20} />,
      trend: "Needs response",
    },
    {
      title: "Completed (Week)",
      value: 12,
      icon: <CheckCircle2 size={20} />,
      trend: "+3 from last week",
    },
    {
      title: "Active Patients",
      value: doctor.patientsServed,
      icon: <UserRound size={20} />,
      trend: "Well-tracked records",
    },
  ];

  const filteredAppointments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return appointments.filter((item) => {
      const dateMatches = selectedDate ? item.appointmentDate === selectedDate : true;
      const searchMatches = normalizedSearch
        ? `${item.patient} ${item.issue}`.toLowerCase().includes(normalizedSearch)
        : true;

      return dateMatches && searchMatches;
    });
  }, [appointments, selectedDate, searchTerm]);

  const handleRequestNoteChange = (id, note) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: note } : item))
    );
  };

  const handleRequestStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleBlockedSlotSubmit = (event) => {
    event.preventDefault();

    if (!blockedSlotForm.date || !blockedSlotForm.from || !blockedSlotForm.to) {
      return;
    }

    setBlockedSlots((prev) => [
      {
        id: Date.now(),
        date: blockedSlotForm.date,
        from: blockedSlotForm.from,
        to: blockedSlotForm.to,
        reason: blockedSlotForm.reason || "Busy",
      },
      ...prev,
    ]);

    setBlockedSlotForm({ date: "", from: "", to: "", reason: "" });
  };

  const removeBlockedSlot = (id) => {
    setBlockedSlots((prev) => prev.filter((item) => item.id !== id));
  };

  const getRiskStyles = (risk) => {
    if (risk === "High") return "bg-red-100 text-red-700";
    if (risk === "Medium") return "bg-amber-100 text-amber-700";
    return "bg-emerald-100 text-emerald-700";
  };

  const getStatusStyles = (status) => {
    if (status === "Accepted") return "bg-emerald-100 text-emerald-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 p-6 text-white shadow-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                <ShieldCheck size={14} />
                Clinical Command Center
              </p>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Welcome, {doctor.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
                Review requests, manage live appointments, block unavailable slots,
                and keep your patient queue streamlined.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                  Start OPD Session
                </button>
                <button className="rounded-xl border border-white/35 bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20">
                  Add Follow-up Note
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/80">Doctor Insights</p>
              <div className="mt-3 space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span>Patient Rating</span>
                  <span className="font-semibold">★ {doctor.rating}</span>
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
                  Stable
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
                <h2 className="text-xl font-semibold text-slate-900">
                  Appointments + Calendar
                </h2>
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

              <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                <Calendar
                  appointments={appointments}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />

                <div className="space-y-3">
                  {filteredAppointments.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                      No appointments found for selected filters.
                    </div>
                  )}

                  {filteredAppointments.map((appt) => (
                    <article
                      key={appt.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{appt.patient}</h3>
                          <p className="text-sm text-slate-600">{appt.issue}</p>
                          <p className="text-xs text-slate-500">
                            {appt.gender}, {appt.age} yrs • {appt.time}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {appt.status}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Patient List</h2>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                  Export Patients
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Condition</th>
                      <th className="px-4 py-3">Last Visit</th>
                      <th className="px-4 py-3">Risk</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    {patients.map((patient) => (
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
                        <td className="px-4 py-3">
                          <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-100">
                            Open Profile
                          </button>
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
                  {requests.filter((item) => item.status === "Pending").length} pending
                </span>
              </div>

              <div className="space-y-4">
                {requests.map((req) => (
                  <article key={req.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{req.patient}</h3>
                        <p className="text-sm text-slate-600">{req.issue}</p>
                        <p className="text-xs text-slate-500">
                          {req.gender}, {req.age} yrs • {new Date(req.date).toLocaleDateString()} • {req.time}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                      <Activity size={14} />
                      Priority: {req.priority}
                    </div>

                    <label className="mb-3 block">
                      <span className="mb-1 inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                        <FilePenLine size={14} />
                        Description for patient (optional)
                      </span>
                      <textarea
                        rows={2}
                        value={req.notes}
                        onChange={(event) => handleRequestNoteChange(req.id, event.target.value)}
                        placeholder="Add guidance, preparation instructions, or reason for rejection"
                        className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-blue-300"
                      />
                    </label>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleRequestStatus(req.id, "Accepted")}
                        className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
                      >
                        Accept Appointment
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRequestStatus(req.id, "Rejected")}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        Reject Appointment
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
                {blockedSlots.length === 0 && (
                  <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                    No blocked slots yet.
                  </p>
                )}

                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(slot.date).toLocaleDateString()} • {slot.from} - {slot.to}
                    </p>
                    <p className="text-xs text-slate-600">{slot.reason}</p>
                    <button
                      type="button"
                      onClick={() => removeBlockedSlot(slot.id)}
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
              <p className="text-sm text-slate-700">{doctor.name}</p>
              <p className="text-sm text-slate-600">{doctor.specialization}</p>
              <p className="text-sm text-slate-600">Experience: {doctor.experience}</p>
              <button className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                Edit Profile
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}