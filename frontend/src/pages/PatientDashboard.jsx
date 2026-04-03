import React from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  HeartPulse,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Video,
  Droplets,
} from "lucide-react";

export default function PatientDashboard() {
  const patient = {
    name: "Atharv Patil",
    age: 21,
    gender: "Male",
    bloodGroup: "B+",
    phone: "+91 9876543210",
    emergency: "+91 9876501234",
    insurance: "HealthSecure Plus",
    id: "MDX1024",
  };

  const stats = [
    {
      title: "Upcoming Visits",
      value: 3,
      trend: "+1 this week",
      icon: <CalendarDays size={20} />,
    },
    {
      title: "Completed",
      value: 8,
      trend: "On-time follow-ups",
      icon: <CheckCircle2 size={20} />,
    },
    {
      title: "Pending Requests",
      value: 2,
      trend: "1 awaiting confirmation",
      icon: <Clock3 size={20} />,
    },
    {
      title: "Medical Reports",
      value: 5,
      trend: "2 added this month",
      icon: <FileText size={20} />,
    },
  ];

  const appointments = [
    {
      doctor: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      date: "12 April 2026",
      time: "10:30 AM",
      mode: "Teleconsult",
      status: "Confirmed",
    },
    {
      doctor: "Dr. Amit Mehta",
      specialty: "Dermatologist",
      date: "15 April 2026",
      time: "04:00 PM",
      mode: "In-Clinic",
      status: "Pending",
    },
    {
      doctor: "Dr. Riya Bhosale",
      specialty: "Nutritionist",
      date: "18 April 2026",
      time: "11:45 AM",
      mode: "Teleconsult",
      status: "Confirmed",
    },
  ];

  const doctors = [
    {
      name: "Dr. Rohan Verma",
      specialty: "Neurologist",
      experience: "8 Years",
      availability: "Available Today",
      rating: 4.9,
      fee: "₹900",
    },
    {
      name: "Dr. Sneha Kulkarni",
      specialty: "Dentist",
      experience: "5 Years",
      availability: "Available Tomorrow",
      rating: 4.8,
      fee: "₹700",
    },
    {
      name: "Dr. Kunal Shah",
      specialty: "General Physician",
      experience: "10 Years",
      availability: "Available Today",
      rating: 4.9,
      fee: "₹650",
    },
  ];

  const notifications = [
    "Your appointment with Dr. Priya Sharma has been confirmed.",
    "Prescription uploaded by Dr. Amit Mehta.",
    "Your appointment request is under review.",
  ];

  const medications = [
    { name: "Atorvastatin 10mg", timing: "After dinner", adherence: 92 },
    { name: "Vitamin D3", timing: "Morning", adherence: 78 },
    { name: "Omega-3", timing: "After lunch", adherence: 84 },
  ];

  const wellnessGoals = [
    { label: "Hydration", progress: 70, icon: <Droplets size={16} /> },
    { label: "Daily Steps", progress: 82, icon: <Activity size={16} /> },
    { label: "Sleep Quality", progress: 64, icon: <Clock3 size={16} /> },
  ];

  const upcomingTasks = [
    "Lab test due in 2 days",
    "Update blood pressure reading",
    "Review dermatologist prescription",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-emerald-900 to-teal-700 p-6 text-white shadow-xl md:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-2xl" />

          <div className="relative grid items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
                <Sparkles size={15} />
                Premium Care Dashboard
              </div>

              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Welcome back, {patient.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">
                Keep appointments, records, medication, and teleconsults in one
                clean workspace built for faster decisions and better outcomes.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5">
                  Book Appointment
                </button>
                <button className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20">
                  Upload Reports
                </button>
                <button className="rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/20">
                  Request Refill
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/80">Wellness Score</p>
              <div className="mt-3 flex items-center gap-4">
                <div
                  style={{
                    background:
                      "conic-gradient(#34d399 0 79%, rgba(255,255,255,0.16) 79% 100%)",
                  }}
                  className="grid h-16 w-16 place-items-center rounded-full"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-sm font-semibold">
                    79
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-white">Great Progress</p>
                  <p className="mt-1 text-xs text-white/75">
                    +6 points from last month
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-black/25 p-3 text-sm text-white/90">
                Next visit in <span className="font-semibold">1 day 14 hrs</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:p-5">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search doctors, specialties, hospitals..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              "Cardiology",
              "Dermatology",
              "Teleconsult",
              "Lab Tests",
            ].map((filter) => (
              <button
                key={filter}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  {item.icon}
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                  <ArrowUpRight size={13} />
                  Active
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-slate-900">{item.value}</h2>
              <p className="mt-1 text-sm font-medium text-slate-700">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.trend}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">
                  Upcoming Appointments
                </h2>
                <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                  Manage Calendar
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map((appt) => (
                  <article
                    key={`${appt.doctor}-${appt.date}-${appt.time}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5"
                  >
                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{appt.doctor}</p>
                        <p className="text-sm text-slate-600">{appt.specialty}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {appt.date} • {appt.time} • {appt.mode}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            appt.status
                          )}`}
                        >
                          {appt.status}
                        </span>
                        <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-white">
                          View
                        </button>
                        {appt.mode === "Teleconsult" && appt.status === "Confirmed" ? (
                          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                            <Video size={15} />
                            Join Call
                          </button>
                        ) : (
                          <button className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Recommended Doctors</h2>
                <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                  Explore All
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {doctors.map((doc) => (
                  <article
                    key={doc.name}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50">
                        <HeartPulse className="text-emerald-600" size={22} />
                      </div>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        ★ {doc.rating}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">{doc.name}</h3>
                    <p className="text-sm text-slate-600">{doc.specialty}</p>
                    <p className="mt-2 text-xs text-slate-500">Experience: {doc.experience}</p>
                    <p className="text-xs text-emerald-700">{doc.availability}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">{doc.fee}</span>
                      <button className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800">
                        Book
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
                <Pill className="text-emerald-600" size={19} />
                Medication Tracker
              </h2>

              <div className="space-y-4">
                {medications.map((med) => (
                  <div key={med.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{med.name}</span>
                      <span className="text-slate-500">{med.adherence}%</span>
                    </div>
                    <p className="text-xs text-slate-500">{med.timing}</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${med.adherence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                Mark Today's Doses
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Activity className="text-cyan-700" size={18} />
                Wellness Goals
              </h2>

              <div className="space-y-4">
                {wellnessGoals.map((goal) => (
                  <div key={goal.label} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <p className="inline-flex items-center gap-2 font-medium text-slate-700">
                        {goal.icon}
                        {goal.label}
                      </p>
                      <span className="text-slate-500">{goal.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-cyan-600"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Bell className="text-amber-600" size={18} />
                Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map((note) => (
                  <div
                    key={note}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <UserRound className="text-slate-700" size={18} />
                Profile Summary
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

                <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                  <p>Age: {patient.age}</p>
                  <p>Gender: {patient.gender}</p>
                  <p>Blood: {patient.bloodGroup}</p>
                  <p>Phone: {patient.phone}</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                  <p className="inline-flex items-center gap-2 font-medium">
                    <ShieldCheck size={16} />
                    Insurance Active
                  </p>
                  <p className="mt-1 text-xs">{patient.insurance}</p>
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

                <button className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
                  Edit Profile
                </button>
                <button className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  Download Records
                </button>
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <button className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
              <CalendarDays className="mb-2" size={20} />
              Book Appointment
            </button>
            <button className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700">
              <Stethoscope className="mb-2" size={20} />
              Find Doctors
            </button>
            <button className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700">
              <FileText className="mb-2" size={20} />
              Medical Records
            </button>
            <button className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
              <Video className="mb-2" size={20} />
              Start Teleconsult
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}