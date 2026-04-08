import { toast } from 'react-toastify';



import { useState, useEffect, useMemo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { appointmentAPI, doctorAPI, patientAPI } from "../services/api";
import Navbar from "../Navbar";

export default function BookDoctorProfile() {
  const fallbackAvatar = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjc3NDhEIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RHI8L3RleHQ+Cjwvc3ZnPgo=";
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [showDoctorList, setShowDoctorList] = useState(true);
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [patientDescription, setPatientDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [maxFee, setMaxFee] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  const specializationOptions = [...new Set(doctors.map((doc) => doc.specialization).filter(Boolean))];
  const hospitalOptions = [...new Set(doctors.map((doc) => doc.HospitalName).filter(Boolean))];

  const filteredDoctors = doctors.filter((doc) => {
    const doctorName = (doc.name || doc.userId?.name || "").toLowerCase();
    const specialization = doc.specialization || "";
    const hospital = doc.HospitalName || "";
    const fee = Number(doc.fees) || 0;
    const experience = Number(doc.experiance) || 0;

    const matchesSearch = !searchTerm || doctorName.includes(searchTerm.toLowerCase());
    const matchesSpecialization = !specializationFilter || specialization === specializationFilter;
    const matchesHospital = !hospitalFilter || hospital === hospitalFilter;
    const matchesFee = !maxFee || fee <= Number(maxFee);
    const matchesExperience = !minExperience || experience >= Number(minExperience);

    return matchesSearch && matchesSpecialization && matchesHospital && matchesFee && matchesExperience;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSpecializationFilter("");
    setHospitalFilter("");
    setMaxFee("");
    setMinExperience("");
  };

  const getDateKey = (dateValue) => {
    const dateObj = new Date(dateValue);
    if (Number.isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toSlotDateTime = (dateKey, timeValue) => {
    if (!dateKey || !timeValue) return null;
    const [hours, minutes] = timeValue.split(":").map(Number);
    const baseDate = new Date(`${dateKey}T00:00:00`);
    if (Number.isNaN(baseDate.getTime()) || Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }
    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate;
  };

  const availableTimeSlots = useMemo(() => {
    const selectedDateKey = dates[selectedDate]?.fullDate;
    if (!selectedDateKey) return [];

    const now = new Date();
    return timeSlots.filter((timeValue) => {
      const slotDateTime = toSlotDateTime(selectedDateKey, timeValue);
      return slotDateTime && slotDateTime > now;
    });
  }, [dates, selectedDate]);

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
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      return `${baseURL}/${profileImage}`;
    }
    
    // If it's already a full URL, return as is
    if (profileImage.startsWith('http')) {
      return profileImage;
    }
    
    // Default fallback
    return fallbackAvatar;
  };

  useEffect(() => {
    // Get doctor data from location state
    if (location.state?.doctor) {
      console.log('Doctor data received:', location.state.doctor);
      setDoctor(location.state.doctor);
      setShowDoctorList(false);
    } else {
      // If no doctor selected, show doctor list
      fetchDoctors();
    }

    const today = new Date();
    const upcomingDates = [];
    for (let i = 0; i < 6; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);
      upcomingDates.push({
        day: nextDate.toLocaleDateString("en-US", { weekday: "short" }),
        date: nextDate.getDate(),
        fullDate: nextDate.toISOString().split('T')[0],
      });
    }
    setDates(upcomingDates);
  }, [location.state]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDoctorSelect = (selectedDoctor) => {
    setDoctor(selectedDoctor);
    setShowDoctorList(false);
    setSelectedTime(null);
  };

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!doctor?._id || dates.length === 0) {
        setBookedSlots(new Set());
        return;
      }

      try {
        const response = await appointmentAPI.getDoctorAppointments(doctor._id);
        const selectedDateKey = dates[selectedDate]?.fullDate;
        const slots = response.data
          .filter((appointment) => appointment.status !== "cancelled")
          .filter((appointment) => getDateKey(appointment.appointmentDate) === selectedDateKey)
          .map((appointment) => appointment.time)
          .filter(Boolean);

        setBookedSlots(new Set(slots));

        if (selectedTime && slots.includes(selectedTime)) {
          setSelectedTime(null);
        }
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedSlots(new Set());
      }
    };

    fetchBookedSlots();
  }, [doctor?._id, selectedDate, dates.length]);

  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime(null);
    }
  }, [availableTimeSlots, selectedTime]);

  const handleBookAppointment = async () => {
    if (!doctor || !selectedTime) return;

    if (!availableTimeSlots.includes(selectedTime)) {
      toast.error("Selected slot has already passed. Please choose a future time.");
      setSelectedTime(null);
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) {
        navigate('/');
        return;
      }

      // First, get or create patient profile
      const patientResponse = await patientAPI.getProfile();
      const patient = patientResponse.data;

      const appointmentData = {
        doctorId: doctor._id,
        patientId: patient._id, // Use the patient ID instead of user ID
        appointmentDate: dates[selectedDate].fullDate,
        description: patientDescription.trim(),
        time: selectedTime
      };

      await appointmentAPI.createAppointment(appointmentData);
     toast.success("Appointment booked successfully!");
      navigate('/patientDashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show doctor list if no specific doctor is selected
  if (showDoctorList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5fcfe] via-[#eef8fb] to-[#f6f8fc] transition-colors duration-200">
        <Navbar />
        <div className="mx-auto mt-20 max-w-7xl px-4 py-10">
          <div className="mb-10 text-center">
            <p className="mx-auto mb-3 inline-flex rounded-full border border-[#1694a4]/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6f79] backdrop-blur">
              Premium Consultation
            </p>
            <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">
              Book an Appointment
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Choose your specialist and reserve a time slot in under a minute.
            </p>
          </div>

          {doctors.length === 0 ? (
            <div className="rounded-3xl border border-white/70 bg-white/70 py-16 text-center shadow-lg backdrop-blur">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1694a4]/20 border-t-[#1694a4]"></div>
              <p className="font-medium text-slate-600">Loading doctors...</p>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur md:p-5">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by doctor name"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#1694a4]"
                  />

                  <select
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#1694a4]"
                  >
                    <option value="">All Specializations</option>
                    {specializationOptions.map((specialization) => (
                      <option key={specialization} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>

                  <select
                    value={hospitalFilter}
                    onChange={(e) => setHospitalFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#1694a4]"
                  >
                    <option value="">All Hospitals</option>
                    {hospitalOptions.map((hospital) => (
                      <option key={hospital} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="0"
                    value={maxFee}
                    onChange={(e) => setMaxFee(e.target.value)}
                    placeholder="Max fee (₹)"
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#1694a4]"
                  />

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={minExperience}
                      onChange={(e) => setMinExperience(e.target.value)}
                      placeholder="Min exp (years)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#1694a4]"
                    />
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-xl border border-[#1694a4]/30 px-3 py-2 text-sm font-semibold text-[#0f6f79] transition hover:bg-[#1694a4]/10"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </p>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="rounded-3xl border border-white/70 bg-white/80 px-6 py-10 text-center shadow-lg">
                  <p className="text-lg font-semibold text-slate-800">No doctors match your filters</p>
                  <p className="mt-2 text-sm text-slate-600">Try changing specialization, hospital, fee, or experience filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
               {filteredDoctors.map((doctor) => (
                 <article key={doctor._id} className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_-24px_rgba(15,111,121,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-24px_rgba(15,111,121,0.6)]">
                   <div className="pointer-events-none absolute -right-14 -top-14 h-32 w-32 rounded-full bg-[#1694a4]/10 blur-2xl" />
                   <div className="relative">
                     <div className="mb-5 flex items-center">
                       <div className="mr-4 h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-[#1694a4]/20">
                         <img
                           src={getImageUrl(doctor.profileImage)}
                                                         alt={`Dr. ${doctor.name || doctor.userId?.name || 'Doctor'}`}
                           className="w-full h-full object-cover"
                                                      onError={(e) => {
                              e.target.src = fallbackAvatar;
                            }}
                         />
                       </div>
                       <div>
                         <h3 className="text-xl font-semibold text-slate-900">
                           Dr. {doctor.name || doctor.userId?.name || 'Unknown'}
                         </h3>
                         <p className="font-medium text-[#0f6f79]">{doctor.specialization || 'General Physician'}</p>
                       </div>
                     </div>
                     
                     <div className="mb-5 grid grid-cols-2 gap-2 text-sm">
                       <p className="rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-slate-600">
                         <span className="block text-[11px] uppercase tracking-wide text-slate-400">Experience</span>
                         <span className="font-semibold text-slate-800">{doctor.experiance || 0} years</span>
                       </p>
                       <p className="rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-slate-600">
                         <span className="block text-[11px] uppercase tracking-wide text-slate-400">Fee</span>
                         <span className="font-semibold text-slate-800">₹{doctor.fees || 0}</span>
                       </p>
                       <p className="col-span-2 rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-slate-600">
                         <span className="block text-[11px] uppercase tracking-wide text-slate-400">Hospital</span>
                         <span className="line-clamp-1 font-semibold text-slate-800">{doctor.HospitalName || 'Not specified'}</span>
                       </p>
                     </div>

                     <button 
                       onClick={() => handleDoctorSelect(doctor)}
                       className="w-full rounded-full bg-gradient-to-r from-[#1694a4] to-[#0f6f79] px-4 py-2.5 font-semibold text-white shadow-lg shadow-[#1694a4]/30 transition hover:from-[#147c88] hover:to-[#0b5b63]"
                     >
                       Select Doctor
                     </button>
                   </div>
                 </article>
               ))}
             </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Show booking form for selected doctor
  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5fcfe] via-[#eef8fb] to-[#f6f8fc] transition-colors duration-200">
        <Navbar />
        <div className="mx-auto mt-24 max-w-3xl rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-xl backdrop-blur">
          <p className="text-slate-600">No doctor selected. Please go back and select a doctor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5fcfe] via-[#eef8fb] to-[#f6f8fc] transition-colors duration-200">
      <Navbar />
      <div className="mx-auto mt-20 max-w-6xl px-4 py-8">
        {/* Back Button */}
                 <button
           onClick={() => setShowDoctorList(true)}
           className="mb-6 inline-flex items-center rounded-full border border-[#1694a4]/20 bg-white/80 px-4 py-2 text-sm font-semibold text-[#0f6f79] shadow-sm backdrop-blur transition hover:border-[#1694a4]/40 hover:text-[#147c88]"
         >
           ← Back to Doctor List
         </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur md:p-8">
            <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
              <img
                src={getImageUrl(doctor.profileImage || doctor.userId?.profileImage)}
                alt={`Dr. ${doctor.name || doctor.userId?.name || 'Doctor'}`}
                className="h-60 w-full rounded-2xl object-cover md:w-48"
                onError={(e) => {
                  e.target.src = fallbackAvatar;
                }}
              />
              <div className="flex-1">
                <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                  Dr. {doctor.name || doctor.userId?.name || 'Unknown'}
                  <FaCheckCircle className="text-emerald-500" />
                </h2>
                <p className="mt-1 text-slate-600">{doctor.qualification || 'MBBS'} • {doctor.specialization || 'General Physician'}</p>
                <span className="mt-3 inline-flex rounded-full border border-[#1694a4]/20 bg-[#1694a4]/10 px-3 py-1 text-sm font-semibold text-[#0f6f79]">
                  {doctor.experiance || 0} Years Experience
                </span>

                <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/80 p-4">
                  <h3 className="font-semibold text-slate-800">Doctor Details</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                    <li>Hospital/Clinic: {doctor.HospitalName || 'Not specified'}</li>
                    <li>License Number: {doctor.licenceNo || 'Not specified'}</li>
                    <li>Specialization: {doctor.specialization || 'General Physician'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Select Date</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d, idx) => (
                  <button
                    key={idx}
                    className={`min-w-[86px] rounded-2xl border px-4 py-3 text-center transition ${
                      selectedDate === idx
                        ? "border-[#1694a4] bg-gradient-to-b from-[#1694a4] to-[#0f6f79] text-white shadow-lg shadow-[#1694a4]/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#1694a4]/40"
                    }`}
                    onClick={() => {
                      setSelectedDate(idx);
                      setSelectedTime(null);
                    }}
                  >
                    <span className="block text-xs font-semibold uppercase tracking-wide">{d.day}</span>
                    <span className="block text-2xl font-bold leading-tight">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Select Time</h3>
              <div className="flex flex-wrap gap-2.5">
                {availableTimeSlots.map((time, i) => (
                  <button
                    key={i}
                    disabled={bookedSlots.has(time)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      bookedSlots.has(time)
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : selectedTime === time
                        ? "border-[#1694a4] bg-[#1694a4] text-white shadow-md shadow-[#1694a4]/30"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#1694a4]/40"
                    }`}
                    onClick={() => {
                      if (!bookedSlots.has(time)) {
                        setSelectedTime(time);
                      }
                    }}
                  >
                    {time}
                    {bookedSlots.has(time) ? " (Booked)" : ""}
                  </button>
                ))}
              </div>
              {availableTimeSlots.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  No future slots available for the selected date.
                </p>
              ) : null}
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f6f79]">Booking Summary</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">Confirm Appointment</h3>

            <div className="mt-6 space-y-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-sm">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-800">Doctor:</span> Dr. {doctor.name || doctor.userId?.name || 'Unknown'}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-800">Specialty:</span> {doctor.specialization || 'General Physician'}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-800">Date:</span> {dates[selectedDate]?.day}, {dates[selectedDate]?.date}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-800">Time:</span> {selectedTime || 'Not selected'}
              </p>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-500">Consultation Fee</p>
              <p className="text-2xl font-bold text-slate-900">₹{doctor.fees || 0}</p>
            </div>

            <div className="mt-5">
              <label htmlFor="patient-description" className="mb-2 block text-sm font-semibold text-slate-700">
                Describe Your Issue (Optional)
              </label>
              <textarea
                id="patient-description"
                value={patientDescription}
                onChange={(e) => setPatientDescription(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Example: Fever for 3 days, headache at night, and mild cough..."
                className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#1694a4]"
              />
              <p className="mt-1 text-right text-xs text-slate-500">{patientDescription.length}/500</p>
            </div>

            <button
              className="mt-7 w-full cursor-pointer rounded-full bg-gradient-to-r from-[#1694a4] to-[#0f6f79] px-6 py-3 font-semibold text-white shadow-lg shadow-[#1694a4]/30 transition-all hover:from-[#147c88] hover:to-[#0b5b63] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={selectedTime === null || loading}
              onClick={handleBookAppointment}
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
