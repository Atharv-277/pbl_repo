import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
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
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  Video,
  Droplets,
  Settings,
  LogOut,
  Star,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appointmentAPI, doctorAPI, patientAPI, reviewAPI } from "../services/api";

const formatStatus = (status) => {
  if (status === "scheduled") return "Scheduled";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
};

const getStatusColor = (status) => {
  if (status === "completed") return "bg-emerald-100 text-emerald-700";
  if (status === "scheduled") return "bg-amber-100 text-amber-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export default function PatientDashboard() {
  const [patientProfile, setPatientProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({ doctor: null, reviews: [] });
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [doctorRatings, setDoctorRatings] = useState({});
  const [topRatedDoctors, setTopRatedDoctors] = useState([]);
  const [openReviewAppointmentId, setOpenReviewAppointmentId] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [submittingReviewFor, setSubmittingReviewFor] = useState("");
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
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
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const [profileResponse, dashboardResponse, appointmentsResponse, doctorsResponse] =
          await Promise.all([
            patientAPI.getProfile(),
            patientAPI.getDashboard(),
            appointmentAPI.getMyPatientAppointments(),
            doctorAPI.getAllDoctors(),
          ]);

        setPatientProfile(profileResponse.data || null);
        setDashboardData(dashboardResponse.data || { doctor: null, reviews: [] });
        setAppointments(appointmentsResponse.data || []);
        setDoctors(doctorsResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load patient dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const loadDoctorRatings = async (doctorList, patientId) => {
    if (!doctorList.length) {
      setDoctorRatings({});
      setTopRatedDoctors([]);
      return;
    }

    const ratingResults = await Promise.all(
      doctorList.map(async (doctor) => {
        try {
          const response = await reviewAPI.getDoctorReviews(doctor._id);
          const reviews = Array.isArray(response.data) ? response.data : [];
          const reviewCount = reviews.length;
          const averageRating = reviewCount
            ? reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0) / reviewCount
            : 0;

          const hasReviewed = Boolean(
            patientId && reviews.some((review) => String(review?.patient?._id) === String(patientId))
          );

          return {
            ...doctor,
            averageRating,
            reviewCount,
            hasReviewed,
          };
        } catch (ratingError) {
          return {
            ...doctor,
            averageRating: 0,
            reviewCount: 0,
            hasReviewed: false,
          };
        }
      })
    );

    const ratingMap = {};
    ratingResults.forEach((doctor) => {
      ratingMap[String(doctor._id)] = {
        averageRating: doctor.averageRating,
        reviewCount: doctor.reviewCount,
        hasReviewed: doctor.hasReviewed,
      };
    });

    const rankedDoctors = [...ratingResults]
      .sort((a, b) => {
        if (b.averageRating === a.averageRating) {
          return b.reviewCount - a.reviewCount;
        }
        return b.averageRating - a.averageRating;
      })
      .filter((doctor) => doctor.reviewCount > 0)
      .slice(0, 10);

    setDoctorRatings(ratingMap);
    setTopRatedDoctors(rankedDoctors);
  };

  useEffect(() => {
    if (!doctors.length) return;
    loadDoctorRatings(doctors, patientProfile?._id);
  }, [doctors, patientProfile?._id]);

  const assignedDoctor = dashboardData?.doctor || null;
  const reviews = dashboardData?.reviews || [];

  const stats = useMemo(() => {
    const now = new Date();

    const upcoming = appointments.filter((item) => {
      if (item.status !== "scheduled") return false;
      const date = new Date(item.appointmentDate);
      return !Number.isNaN(date.getTime()) && date >= now;
    }).length;

    const completed = appointments.filter((item) => item.status === "completed").length;
    const pending = appointments.filter((item) => item.status === "scheduled").length;

    return [
      {
        title: "Upcoming Visits",
        value: upcoming,
        trend: "Live from backend",
        icon: <CalendarDays size={20} />,
      },
      {
        title: "Completed",
        value: completed,
        trend: "Finished appointments",
        icon: <CheckCircle2 size={20} />,
      },
      {
        title: "Pending Requests",
        value: pending,
        trend: "Awaiting completion",
        icon: <Clock3 size={20} />,
      },
      {
        title: "Doctor Reviews",
        value: reviews.length,
        trend: "From assigned doctor",
        icon: <FileText size={20} />,
      },
    ];
  }, [appointments, reviews.length]);

  const appointmentCards = useMemo(() => {
    return appointments
      .filter((item) => item?.status !== "cancelled")
      .map((item) => ({
      id: item?._id,
      doctorId: item?.doctor?._id,
      doctor: item?.doctor?.userId?.name || "Doctor",
      specialty: item?.doctor?.specialization || "General Physician",
      date: item?.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString() : "Date pending",
      time: item?.time || "Time pending",
      mode: "In-Clinic",
      description: item?.description || "",
      createdByRole: item?.createdByRole || "patient",
      doctorNote: typeof item?.doctorNote === "string" ? item.doctorNote.trim() : "",
      status: formatStatus(item?.status),
      rawStatus: item?.status,
    }));
  }, [appointments]);

  const doctorNoteAlerts = useMemo(() => {
    return appointmentCards
      .filter((appointment) => Boolean(appointment.doctorNote))
      .map((appointment) =>
        `Doctor update from Dr. ${appointment.doctor}: ${appointment.doctorNote}`
      );
  }, [appointmentCards]);

  const handleDraftChange = (appointmentId, field, value) => {
    setReviewDrafts((prev) => ({
      ...prev,
      [appointmentId]: {
        rating: prev[appointmentId]?.rating || 5,
        comment: prev[appointmentId]?.comment || "",
        [field]: value,
      },
    }));
  };

  const submitDoctorRating = async (appointment) => {
    const draft = reviewDrafts[appointment.id] || { rating: 5, comment: "" };
    const ratingValue = Number(draft.rating);
    const commentValue = String(draft.comment || "").trim();

    if (!appointment?.doctorId) {
      toast.error("Doctor details not available for this appointment.");
      return;
    }

    if (!patientProfile?._id) {
      toast.error("Patient profile not found. Please refresh the page.");
      return;
    }

    if (Number.isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    if (!commentValue) {
      toast.error("Please add a short review comment.");
      return;
    }

    try {
      setSubmittingReviewFor(appointment.id);
      await reviewAPI.createReview({
        doctor: appointment.doctorId,
        patient: patientProfile._id,
        rating: ratingValue,
        comment: commentValue,
      });

      toast.success("Thanks! Your rating was submitted.");
      setOpenReviewAppointmentId("");
      setReviewDrafts((prev) => ({
        ...prev,
        [appointment.id]: { rating: 5, comment: "" },
      }));
      await loadDoctorRatings(doctors, patientProfile._id);
    } catch (submitError) {
      toast.error(submitError?.response?.data?.message || "Failed to submit rating.");
    } finally {
      setSubmittingReviewFor("");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    const ok = window.confirm("Cancel this appointment? This action is for mistaken bookings.");
    if (!ok) return;

    try {
      setCancellingAppointmentId(appointmentId);
      await appointmentAPI.updateAppointmentStatus(appointmentId, { status: "cancelled" });

      setAppointments((prev) =>
        prev.map((item) =>
          String(item?._id) === String(appointmentId)
            ? { ...item, status: "cancelled" }
            : item
        )
      );

      toast.success("Appointment cancelled successfully.");
    } catch (cancelError) {
      toast.error(cancelError?.response?.data?.message || "Failed to cancel appointment.");
    } finally {
      setCancellingAppointmentId("");
    }
  };

  const recommendedDoctors = useMemo(() => {
    const assignedDoctorId = String(assignedDoctor?._id || "");

    return doctors
      .filter((doctor) => String(doctor?._id) !== assignedDoctorId)
      .slice(0, 3);
  }, [doctors, assignedDoctor?._id]);

  const notifications = useMemo(() => {
    const list = [];

    const doctorBookedFollowUps = appointmentCards.filter(
      (appointment) =>
        appointment.rawStatus === "scheduled" &&
        appointment.createdByRole === "doctor"
    );

    if (assignedDoctor?.userId?.name) {
      list.push(`Assigned doctor: Dr. ${assignedDoctor.userId.name}`);
    } else {
      list.push("No doctor assigned yet. Book a consultation to get started.");
    }

    if (appointmentCards.length > 0) {
      list.push(`You have ${appointmentCards.length} appointment(s) in your history.`);
    }

    if (reviews.length > 0) {
      list.push(`${reviews.length} review(s) are available for your assigned doctor.`);
    }

    if (doctorBookedFollowUps.length > 0) {
      list.push(`Doctor scheduled ${doctorBookedFollowUps.length} follow-up visit(s) for you.`);
      doctorBookedFollowUps.slice(0, 5).forEach((appointment) => {
        list.push(`Follow-up with Dr. ${appointment.doctor} on ${appointment.date} at ${appointment.time}.`);
      });
    }

    if (doctorNoteAlerts.length > 0) {
      list.push(`You have ${doctorNoteAlerts.length} doctor note update(s).`);
      list.push(...doctorNoteAlerts.slice(0, 5));
    }

    return list;
  }, [assignedDoctor?.userId?.name, appointmentCards, reviews.length, doctorNoteAlerts]);

  const patient = {
    name: user?.name || "Patient",
    age: user?.age || fallbackVitals.age,
    gender: user?.gender || "N/A",
    bloodGroup: user?.bloodGroup || fallbackVitals.bloodGroup,
    phone: user?.phoneNo || "N/A",
    emergency: "N/A",
    insurance: "Not Available",
    id: patientProfile?._id || "N/A",
  };

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  const handleSidebarAction = (action) => {
    if (action === "logout") {
      handleLogout();
      return;
    }

    const sectionMap = {
      overview: "patient-overview",
      appointments: "appointments-section",
      notifications: "notifications-section",
      settings: "settings-section",
    };

    const sectionId = sectionMap[action];
    if (sectionId) {
      scrollToSection(sectionId);
    }
  };

  const sidebarOptions = [
    { key: "overview", label: "Dashboard", icon: <Sparkles size={16} /> },
    { key: "appointments", label: "Appointments", icon: <CalendarDays size={16} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { key: "settings", label: "Settings", icon: <Settings size={16} /> },
    { key: "logout", label: "Logout", icon: <LogOut size={16} /> },
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
    "Keep profile and contact information updated",
    "Track appointment outcomes after each visit",
    "Use doctor notes for follow-up planning",
  ];

  useEffect(() => {
    const section = searchParams.get("section");
    if (!section || loading) return;

    const sectionMap = {
      overview: "patient-overview",
      appointments: "appointments-section",
      notifications: "notifications-section",
      settings: "settings-section",
    };

    const targetId = sectionMap[section];
    if (!targetId) return;

    const timer = setTimeout(() => {
      scrollToSection(targetId);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchParams, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl gap-6">
        <aside className="hidden w-72 shrink-0 self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block lg:sticky lg:top-6">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-700 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-lg font-semibold">
                {patient.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <div>
                <p className="text-sm text-white/80">Signed in as</p>
                <p className="font-semibold">{patient.name}</p>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {sidebarOptions.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSidebarAction(item.key)}
                className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  item.key === "logout"
                    ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 space-y-6">
        <section
          id="patient-overview"
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-emerald-900 to-teal-700 p-6 text-white shadow-xl md:p-8"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-2xl" />

          <div className="relative grid items-start gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
                <Sparkles size={15} />
                Patient Care Dashboard
              </div>

              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Welcome back, {patient.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-white/85 md:text-base">
                Your profile, doctor assignment, appointments, and recommendations are
                now connected directly to backend APIs.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/bookAppointment"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5"
                >
                  Book Appointment
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm text-white/80">Current Assignment</p>
              <div className="mt-3 text-sm">
                <p className="font-medium text-white">
                  {assignedDoctor?.userId?.name
                    ? `Dr. ${assignedDoctor.userId.name}`
                    : "No doctor assigned"}
                </p>
                <p className="mt-1 text-white/80">
                  {assignedDoctor?.specialization || "Assign a doctor to see specialization"}
                </p>
                <div className="mt-4 rounded-xl bg-black/25 p-3 text-sm text-white/90">
                  Total appointments: <span className="font-semibold">{appointments.length}</span>
                </div>
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
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">{item.icon}</div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700">
                  <ArrowUpRight size={13} />
                  Live
                </span>
              </div>
              <h2 className="text-3xl font-semibold text-slate-900">{item.value}</h2>
              <p className="mt-1 text-sm font-medium text-slate-700">{item.title}</p>
              <p className="mt-1 text-xs text-slate-500">{item.trend}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Top Rated Doctors</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <Star size={13} />
              Live ranking
            </span>
          </div>

          {topRatedDoctors.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Ratings will appear here after patients submit reviews.
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-4">
              <motion.div
                className="flex w-max gap-3"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              >
                {[...topRatedDoctors, ...topRatedDoctors].map((doctor, index) => (
                  <article
                    key={`${doctor._id}-${index}`}
                    className="min-w-[240px] rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <p className="text-sm font-semibold text-slate-900">Dr. {doctor.name || doctor.userId?.name || "Doctor"}</p>
                    <p className="text-xs text-slate-600">{doctor.specialization || "General Physician"}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        <Star size={12} /> {doctor.averageRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500">{doctor.reviewCount} review(s)</span>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-6">
            <div id="appointments-section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">Upcoming Appointments</h2>
                <a
                  href="/bookAppointment"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Book New
                </a>
              </div>

              <div className="space-y-4">
                {appointmentCards.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No appointments found yet.
                  </div>
                ) : null}

                {appointmentCards.map((appointment) => (
                  <article
                    key={appointment.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5"
                  >
                    <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">Dr. {appointment.doctor}</p>
                        <p className="text-sm text-slate-600">{appointment.specialty}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {appointment.date} • {appointment.time} • {appointment.mode}
                        </p>
                        {appointment.rawStatus === "scheduled" && appointment.createdByRole === "doctor" ? (
                          <p className="mt-1 inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                            Follow-up booked by doctor
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            appointment.rawStatus
                          )}`}
                        >
                          {appointment.status}
                        </span>
                        {appointment.rawStatus === "scheduled" ? (
                          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                            <Video size={15} />
                            View Details
                          </button>
                        ) : null}

                        {appointment.rawStatus === "scheduled" ? (
                          <button
                            type="button"
                            onClick={() => cancelAppointment(appointment.id)}
                            disabled={cancellingAppointmentId === appointment.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-60"
                          >
                            {cancellingAppointmentId === appointment.id ? "Cancelling..." : "Cancel (Mistaken Booking)"}
                          </button>
                        ) : null}

                        {appointment.rawStatus === "completed" ? (
                          <button
                            type="button"
                            onClick={() =>
                              setOpenReviewAppointmentId((prev) =>
                                prev === appointment.id ? "" : appointment.id
                              )
                            }
                            disabled={Boolean(doctorRatings[appointment.doctorId]?.hasReviewed)}
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                              doctorRatings[appointment.doctorId]?.hasReviewed
                                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                                : "bg-amber-500 text-white hover:bg-amber-600"
                            }`}
                          >
                            <Star size={15} />
                            {doctorRatings[appointment.doctorId]?.hasReviewed ? "Rated" : "Give Rating"}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {appointment.doctorNote ? (
                      <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                          Doctor Follow-up Note
                        </p>
                        <p className="mt-1 text-sm text-cyan-900">{appointment.doctorNote}</p>
                      </div>
                    ) : null}

                    {appointment.rawStatus === "completed" &&
                    openReviewAppointmentId === appointment.id &&
                    !doctorRatings[appointment.doctorId]?.hasReviewed ? (
                      <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
                        <p className="mb-2 text-sm font-semibold text-slate-900">Rate Dr. {appointment.doctor}</p>

                        <div className="mb-3 flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((value) => {
                            const selectedRating = Number(reviewDrafts[appointment.id]?.rating || 5);
                            const isActive = value <= selectedRating;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => handleDraftChange(appointment.id, "rating", value)}
                                className={`rounded-lg p-1.5 ${isActive ? "text-amber-500" : "text-slate-300"}`}
                                aria-label={`Rate ${value} star`}
                              >
                                <Star size={18} fill={isActive ? "currentColor" : "none"} />
                              </button>
                            );
                          })}
                        </div>

                        <textarea
                          value={reviewDrafts[appointment.id]?.comment || ""}
                          onChange={(event) =>
                            handleDraftChange(appointment.id, "comment", event.target.value)
                          }
                          rows={3}
                          placeholder="Write your feedback about this consultation..."
                          className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-amber-300"
                        />

                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenReviewAppointmentId("")}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => submitDoctorRating(appointment)}
                            disabled={submittingReviewFor === appointment.id}
                            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-300"
                          >
                            {submittingReviewFor === appointment.id ? "Submitting..." : "Submit Rating"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Recommended Doctors</h2>
                <span className="text-sm font-medium text-emerald-700">
                  {doctors.length} available
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommendedDoctors.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500">
                    No doctors match your search.
                  </div>
                ) : null}

                {recommendedDoctors.map((doctor) => (
                  <article
                    key={doctor._id}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50">
                        <HeartPulse className="text-emerald-600" size={22} />
                      </div>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        ★ 4.8
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Dr. {doctor.name}</h3>
                    <p className="text-sm text-slate-600">{doctor.specialization || "General Physician"}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Experience: {doctor.experiance || 0} years
                    </p>
                    <p className="text-xs text-emerald-700">{doctor.HospitalName || "Hospital not listed"}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">Rs. {doctor.fees || 0}</span>
                      <a
                        href="/bookAppointment"
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
                      >
                        Book
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div id="medication-section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Pill className="text-emerald-600" size={19} />
                Medication Tracker
              </h2>

              <div className="space-y-4">
                {medications.map((medication) => (
                  <div key={medication.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{medication.name}</span>
                      <span className="text-slate-500">{medication.adherence}%</span>
                    </div>
                    <p className="text-xs text-slate-500">{medication.timing}</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${medication.adherence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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

            <div id="notifications-section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Bell className="text-amber-600" size={18} />
                Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </section>

        <section id="settings-section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
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

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <a
              href="/bookAppointment"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <CalendarDays className="mb-2" size={20} />
              Book Appointment
            </a>
            <a
              href="/"
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              <Stethoscope className="mb-2" size={20} />
              Find Doctors
            </a>
            <button className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700">
              <FileText className="mb-2" size={20} />
              Medical Records
            </button>
            <button className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
              <Video className="mb-2" size={20} />
              Start Teleconsult
            </button>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}
