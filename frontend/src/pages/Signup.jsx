// Register.jsx
import { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Register() {
  const [userType, setUserType] = useState("patient");
  const [fullname, setfullname] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [experience, setexperience] = useState("");
  const [qualification, setqualification] = useState("");
  const [address, setaddress] = useState("");
  const [licenseno, setlicenseno] = useState("");
  const [hospitalname, sethospitalname] = useState("");
  const [email, setemail] = useState("");
  const [fee, setfee] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        name: fullname,
        email,
        password,
        phoneNo: phone,
        gender,
        address,
        role: userType,
      };

      if (userType === "doctor") {
        userData.specialization = specialization;
        userData.qualification = qualification;
        userData.experience = parseInt(experience);
        userData.licenceNo = licenseno;
        userData.hospitalName = hospitalname;
        userData.fees = parseInt(fee);
      }

      const response = await authAPI.register(userData);

      // Store user data
      localStorage.setItem("user", JSON.stringify(response.data));

      // Redirect based on role
      if (response.data.role === "doctor") {
        navigate("/doctorDashboard");
      } else {
        navigate("/patientDashboard");
      }

    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Fullscreen blurred background image with less blur */}
      <img
                        src="/src/assets/images/register.png"
        alt="Register Background"
        className="absolute inset-0 w-full h-full object-cover blur-[2px] scale-105 z-0"
        style={{ minHeight: '100vh' }}
      />
      {/* No white overlay */}
      {/* Centered Register Form */}
      <div className="relative z-20 w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center">
        <div className="flex justify-center mb-6 gap-2 w-full">
          <button
            onClick={() => setUserType("patient")}
            className={`px-6 py-2 cursor-pointer rounded-l-lg font-semibold shadow-sm transition-all duration-200 ${userType === "patient" ? "bg-gray-100 text-teal-600 shadow" : "bg-white text-gray-500 border"}`}
          >
            Patient
          </button>
          <button
            onClick={() => setUserType("doctor")}
            className={`px-6 py-2 cursor-pointer rounded-r-lg font-semibold shadow-sm transition-all duration-200 ${userType === "doctor" ? "bg-teal-500 text-white shadow" : "bg-white text-gray-500 border"}`}
          >
            Doctor
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center text-teal-600 w-full">MediConnect</h2>
        <h3 className="text-lg font-semibold mb-6 text-center w-full">Create account</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <input required value={fullname} onChange={(e)=>{setfullname(e.target.value);}} type="text" placeholder="Full Name" className="input border-gray-300 rounded-lg p-3" />
          <input required value={email} onChange={(e)=>{setemail(e.target.value);}} type="email" placeholder="Email" className="input border-gray-300 rounded-lg p-3" />
          <input required value={password} onChange={(e)=>{setpassword(e.target.value);}} type="password" placeholder="Password" className="input border-gray-300 rounded-lg p-3" />
          <input value={phone} onChange={(e)=>{setphone(e.target.value);}} type="text" placeholder="Phone Number" className="input border-gray-300 rounded-lg p-3" />
          <select required value={gender} onChange={(e) => setGender(e.target.value)} className="input border-gray-300 rounded-lg p-3">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <textarea value={address} onChange={(e)=>{setaddress(e.target.value);}} placeholder="Address" className="input border-gray-300 rounded-lg p-3 md:col-span-2 h-20" />
          {/* Doctor Specific Fields */}
          {userType === "doctor" && (
            <>
              <select required value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="input border-gray-300 rounded-lg p-3">
                <option value="">Select Specialization</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Dentist">Dentist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="General Physician">General Physician</option>
              </select>
              <input required value={experience} onChange={(e)=>{setexperience(e.target.value);}} type="number" placeholder="Experience (years)" className="input border-gray-300 rounded-lg p-3" />
              <input required value={qualification} onChange={(e)=>{setqualification(e.target.value);}} type="text" placeholder="Qualification" className="input border-gray-300 rounded-lg p-3" />
              <input required value={licenseno} onChange={(e)=>{setlicenseno(e.target.value);}} type="text" placeholder="Medical License Number" className="input border-gray-300 rounded-lg p-3" />
              <input required value={hospitalname} onChange={(e)=>{sethospitalname(e.target.value);}} type="text" placeholder="Clinic/Hospital Name" className="input border-gray-300 rounded-lg p-3" />
              <input required value={fee} onChange={(e)=>{setfee(e.target.value);}} type="number" placeholder="Consultation Fee (₹)" className="input border-gray-300 rounded-lg p-3" />
            </>
          )}
          {/* Terms and Conditions */}
          <div className="md:col-span-2 flex items-start gap-2">
            <input required type="checkbox" className="mt-1" />
            <p className="text-sm">
              I agree to the <span className="text-teal-600 underline">terms and conditions</span>.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 cursor-pointer bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:from-teal-500 hover:to-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Registering..." : `Register as ${userType === "doctor" ? "Doctor" : "Patient"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
