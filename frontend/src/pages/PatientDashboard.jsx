import React, { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
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
  Star,
  Camera,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appointmentAPI, doctorAPI, patientAPI, reviewAPI, resolveAssetUrl } from "../services/api";
import Navbar from "../Navbar";

const formatStatus = (status) => {
  if (status === "scheduled") return "Scheduled";
  if (status === "completed") return "Completed";
  if (status === "approved") return "Approved";
  if (status === "rejected") return "Rejected";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
};

const getStatusColor = (status) => {
  if (status === "completed" || status === "approved") return "bg-emerald-100 text-emerald-700";
  if (status === "scheduled") return "bg-amber-100 text-amber-700";
  if (status === "cancelled" || status === "rejected") return "bg-red-100 text-red-700";
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
  const [notificationsCleared, setNotificationsCleared] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
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
    const syncUser = () => {
      setCurrentUser(JSON.parse(localStorage.getItem("user") || "{}"));
    };

    window.addEventListener("auth-changed", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("auth-changed", syncUser);
      window.removeEventListener("storage", syncUser);
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
        } catch {
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

    const completed = appointments.filter((item) => item.status === "completed" || item.status === "approved").length;
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
      .filter((item) => item?.status !== "cancelled" && item?.status !== "rejected")
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

    return list.reverse();
  }, [assignedDoctor?.userId?.name, appointmentCards, reviews.length, doctorNoteAlerts]);

  const patient = {
    name: currentUser?.name || "Patient",
    age: currentUser?.age || fallbackVitals.age,
    gender: currentUser?.gender || "N/A",
    bloodGroup: currentUser?.bloodGroup || fallbackVitals.bloodGroup,
    phone: currentUser?.phoneNo || "N/A",
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

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const response = await patientAPI.uploadProfilePhoto(formData);
      // Update local storage so it persists across refreshes
      const updatedUser = { ...currentUser, profileImage: response.data.profileImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      // Refresh window or state to pull the latest profile info
      window.location.reload();
    } catch (err) {
      console.error('Failed to upload profile photo:', err);
      toast.error('Failed to upload profile photo');
    }
  };

  const handleBookDoctor = (doctor) => {
    navigate("/bookAppointment", { state: { doctor } });
  };



  useEffect(() => {
    const section = searchParams.get("section");
    if (!section || loading) return;

    const sectionMap = {
      overview: "patient-overview",
      appointments: "appointments-section",
      notifications: "notifications-section",
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
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-100 px-4 pb-6 pt-24 md:px-8 md:pb-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="space-y-6">
            <section
              id="patient-overview"
              className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-emerald-900 to-teal-700 p-6 text-white shadow-xl md:p-8"
            >
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-2xl" />

              <div className="relative grid items-start gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-4">
                    <div className="relative group shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white/20 bg-white/10 flex items-center justify-center overflow-hidden shadow-xl transition-all group-hover:border-white/40">
                        {currentUser?.profileImage ? (
                          <img
                            src={resolveAssetUrl(currentUser.profileImage)}
                            alt="Patient Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-white/50">{patient.name?.charAt(0) || 'P'}</span>
                        )}
                      </div>
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer backdrop-blur-sm">
                        <Camera size={24} className="mb-1" />
                        <span className="text-xs font-semibold">Change</span>
                        <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleProfilePhotoUpload} />
                      </label>
                    </div>
                    <div>
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
                    </div>
                  </div>

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
                              <button
                                type="button"
                                onClick={() => cancelAppointment(appointment.id)}
                                disabled={cancellingAppointmentId === appointment.id}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-60"
                              >
                                {cancellingAppointmentId === appointment.id ? "Cancelling..." : "Cancel (Mistaken Booking)"}
                              </button>
                            ) : null}

                            {appointment.rawStatus === "completed" || appointment.rawStatus === "approved" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenReviewAppointmentId((prev) =>
                                    prev === appointment.id ? "" : appointment.id
                                  )
                                }
                                disabled={Boolean(doctorRatings[appointment.doctorId]?.hasReviewed)}
                                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${doctorRatings[appointment.doctorId]?.hasReviewed
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

                        {(appointment.rawStatus === "completed" || appointment.rawStatus === "approved") &&
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
                          <button
                            type="button"
                            onClick={() => handleBookDoctor(doctor)}
                            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
                          >
                            View
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div id="notifications-section" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Bell className="text-amber-600" size={18} />
                      Notifications
                    </h2>
                    {!notificationsCleared && notifications.length > 0 && (
                      <button
                        onClick={() => setNotificationsCleared(true)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {notificationsCleared || notifications.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                        <Bell className="mx-auto mb-2 text-slate-400 opacity-50" size={24} />
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((note, index) => (
                        <div
                          key={`${note}-${index}`}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm transition hover:border-amber-200"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                            <Bell size={14} />
                          </div>
                          <p>{note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </aside>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
