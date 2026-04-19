import React, { useState, useEffect } from "react";
import doctorImage from "../assets/images/doctor.png";
import logoutIcon from "../assets/images/icons8-logout-50.png";
import Calendar from "./components/Calender";
import { useNavigate } from "react-router-dom";
import { doctorAPI } from "../services/api";

export default function DoctormobileDashobaord() {
  const [patients, setPatients] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patientsResponse, reviewsResponse] = await Promise.all([
          doctorAPI.getMyPatients(),
          doctorAPI.getMyReviews()
        ]);
        
        setPatients(patientsResponse.data);
        setReviews(reviewsResponse.data);
        
        // Get doctor name from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setDoctorName(user.name || "Doctor");
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-20 bg-teal-700 p-4 md:p-8 flex md:flex-col items-center justify-between md:justify-start space-y-0 md:space-y-6 md:gap-5">
        <button onClick={handleLogout}>
          <img className="h-6 w-6 md:h-5 md:w-5 cursor-pointer" src={logoutIcon} alt="Logout" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-light text-center md:text-left">
            Good Morning <span className="font-bold text-teal-600">Dr. {doctorName}!</span>
          </h2>
          <div className="flex items-center space-x-4">
            <button><span className="icon-bell" /></button>
            <img src={doctorImage} alt="Doctor" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-teal-400" />
            <span className="font-medium">Dr. {doctorName}</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left 2/3 */}
          <div className="md:col-span-2 space-y-6">
            {/* Visits Summary */}
            <div className="rounded-xl shadow bg-white p-4 md:p-6 flex flex-col md:flex-row items-center">
              <div className="flex-1 text-center md:text-left">
                <div className="text-base md:text-lg mb-2 font-medium">My Patients</div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{patients.length}</div>
                <div className="flex justify-center md:justify-start space-x-6 md:space-x-8">
                  <div>
                    <div className="text-gray-700">Total Reviews</div>
                    <div className="text-lg font-semibold">
                      {reviews.length} <span className="text-green-500 ml-1 text-sm">reviews</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-700">Average Rating</div>
                    <div className="text-lg font-semibold">
                      {reviews.length > 0 ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1) : 0} <span className="text-blue-500 ml-1 text-sm">stars</span>
                    </div>
                  </div>
                </div>
              </div>
              <img src={doctorImage} alt="Doctor" className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover mt-4 md:mt-0 md:ml-8" />
            </div>

            {/* Patient List + Consultation */}
            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
              {/* Patient List */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 w-full md:w-1/2">
                <h3 className="font-semibold mb-4">My Patients</h3>
                {patients.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No patients assigned yet</p>
                ) : (
                  patients.map((patient, idx) => (
                    <div key={idx} className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold bg-blue-100 text-blue-600">
                        {patient.userId?.name?.charAt(0) || "P"}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{patient.userId?.name || "Unknown Patient"}</div>
                        <div className="text-xs text-gray-400">{patient.userId?.email || "No email"}</div>
                      </div>
                      <div className="text-gray-700 text-sm">Assigned</div>
                    </div>
                  ))
                )}
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-xl shadow p-4 md:p-6 w-full md:w-1/2">
                <h3 className="font-semibold mb-2">Recent Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No reviews yet</p>
                ) : (
                  reviews.slice(0, 3).map((review, idx) => (
                    <div key={idx} className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-teal-700">
                          {review.patient?.name || "Anonymous"}
                        </div>
                        <div className="text-yellow-500">
                          {"★".repeat(review.rating || 0)}
                        </div>
                      </div>
                      <div className="text-gray-600 text-sm mb-2">
                        {review.comment || "No comment provided"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right 1/3 - Calendar */}
          <div className="w-full">
            <Calendar />
          </div>
        </div>
      </main>
    </div>
  );
}
