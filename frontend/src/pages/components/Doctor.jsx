import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_BASE_ROOT, doctorAPI } from "@/services/api.js";

// DoctorProfileCard.jsx
export default function DoctorProfileCard() {
  const fallbackAvatar =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjc3NDhEIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RHI8L3RleHQ+Cjwvc3ZnPgo=";
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await doctorAPI.getAllDoctors();
        setDoctors(response.data);
      } catch (err) {
        // Don't show error for 401, just show empty state
        if (err.response?.status === 401) {
          setDoctors([]);
        } else {
          setError("Failed to load doctors");
        }
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent immediate API calls
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Function to get proper image URL
  const getImageUrl = (profileImage) => {
    if (!profileImage) {
      return fallbackAvatar;
    }
    
    // If it's a blob URL, return as is
    if (profileImage.startsWith('blob:')) {
      return profileImage;
    }
    
    // If it's a relative path, construct full URL
    if (profileImage.startsWith('uploads/')) {
      return `${API_BASE_ROOT}/${profileImage}`;
    }
    
    // If it's already a full URL, return as is
    if (profileImage.startsWith('http')) {
      return profileImage;
    }
    
    // Default fallback
    return fallbackAvatar;
  };

  if (loading) {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#f7fcfd] via-[#ecf8fa] to-[#f5f7fb] py-16 md:py-24 px-4">
        <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#1694a4]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#0f6f79]/20 blur-3xl" />
        <div className="relative text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#1694a4]/20 border-t-[#1694a4]"></div>
          <p className="mt-5 text-base font-medium tracking-wide text-slate-600">Curating our specialists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-br from-[#fff8f8] via-[#fff] to-[#fff7f7] py-16 md:py-24 px-4">
        <div className="mx-auto max-w-md rounded-3xl border border-rose-100 bg-white/80 p-8 text-center shadow-xl backdrop-blur">
          <p className="text-base font-semibold text-rose-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 rounded-full bg-[#1694a4] px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#1694a4]/30 transition hover:-translate-y-0.5 hover:bg-[#147c88]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-[#f8fbfc] via-[#f3f8fa] to-[#f5f7fb] py-16 md:py-24 px-4">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-lg backdrop-blur">
          <p className="text-base font-medium text-slate-600">No doctors available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#f6fdff] via-[#edf9fb] to-[#f4f7fb] py-14 md:py-20">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#1694a4]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#0f6f79]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <p className="mb-3 inline-flex items-center rounded-full border border-[#1694a4]/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6f79] backdrop-blur">
            Trusted Medical Team
          </p>
          <h2 className="text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
            Meet Our Expert Doctors
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 md:text-base">
            Handpicked specialists with proven experience, modern care approach, and a focus on patient-first treatment.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/30 p-3">
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
          {[...doctors, ...doctors].map((doctor, index) => {
            const doctorName = doctor.name || doctor.userId?.name || "Unknown";
            const specialization = doctor.specialization || "General Physician";
            const experience = doctor.experiance || 0;

            return (
              <article
                key={`${doctor._id}-${index}`}
                className="group relative w-[320px] shrink-0 overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-5 shadow-[0_20px_50px_-24px_rgba(15,111,121,0.5)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-24px_rgba(15,111,121,0.6)] md:w-[360px] md:p-6"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#1694a4]/10 blur-2xl" />

                <div className="relative">
                  <div className="mb-5 flex items-center">
                    <div className="mr-4 h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-[#1694a4]/20 md:h-16 md:w-16">
                      <img
                        src={getImageUrl(doctor.profileImage || doctor.userId?.profileImage)}
                        alt={`Dr. ${doctorName}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = fallbackAvatar;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
                        Dr. {doctorName}
                      </h3>
                      <p className="text-sm font-medium text-[#0f6f79] md:text-base">{specialization}</p>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-2.5 text-xs md:text-sm">
                    <p className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-slate-600">
                      <span className="block text-[11px] uppercase tracking-wide text-slate-400">Experience</span>
                      <span className="font-semibold text-slate-800">{experience} years</span>
                    </p>
                    <p className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-slate-600">
                      <span className="block text-[11px] uppercase tracking-wide text-slate-400">Fee</span>
                      <span className="font-semibold text-slate-800">₹{doctor.fees || 0}</span>
                    </p>
                    <p className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-slate-600">
                      <span className="block text-[11px] uppercase tracking-wide text-slate-400">Qualification</span>
                      <span className="font-semibold text-slate-800">{doctor.qualification || "MBBS"}</span>
                    </p>
                    <p className="rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2 text-slate-600">
                      <span className="block text-[11px] uppercase tracking-wide text-slate-400">Hospital</span>
                      <span className="line-clamp-1 font-semibold text-slate-800">{doctor.HospitalName || "Not specified"}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/bookAppointment", { state: { doctor } })}
                    className="w-full cursor-pointer rounded-full bg-gradient-to-r from-[#1694a4] to-[#0f6f79] px-4 py-2.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#1694a4]/30 transition duration-300 hover:from-[#147c88] hover:to-[#0b5b63] group-hover:shadow-[#0f6f79]/35 md:text-base"
                  >
                    Book Appointment
                  </button>
                </div>
              </article>
            );
          })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
