// Register.jsx
import { useState } from "react";
import { FaEye, FaEyeSlash, FaCloudUploadAlt, FaFileAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import registerImage from "../assets/images/register.png";

export default function Register() {
  const [userType, setUserType] = useState("patient");
  const [fullname, setfullname] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [experience, setexperience] = useState("");
  const [qualification, setqualification] = useState("");
  const [address, setaddress] = useState("");
  const [licenseno, setlicenseno] = useState("");
  const [hospitalname, sethospitalname] = useState("");
  const [email, setemail] = useState("");
  const [fee, setfee] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [certificateFile, setCertificateFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert("Only JPG and PNG images are allowed for profile photo.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Profile photo must be less than 5MB.");
        return;
      }
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, PNG, and PDF files are allowed.");
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        return;
      }
      setCertificateFile(file);
    }
  };

  const removeCertificate = () => {
    setCertificateFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (userType === "doctor") {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("name", fullname);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phoneNo", phone);
        formData.append("gender", gender);
        formData.append("address", address);
        formData.append("role", userType);
        formData.append("specialization", specialization);
        formData.append("qualification", qualification);
        formData.append("experience", parseInt(experience));
        formData.append("licenceNo", licenseno);
        formData.append("hospitalName", hospitalname);
        formData.append("fees", parseInt(fee));
        if (certificateFile) {
          formData.append("licenceCertificate", certificateFile);
        }
        if (profilePhotoFile) {
          formData.append("profileImage", profilePhotoFile);
        }

        const response = await authAPI.registerWithFile(formData);

        if (response.data.pending) {
          alert(response.data.message || "Registration submitted! Please wait for admin approval.");
          navigate("/login");
          return;
        }

        localStorage.setItem("user", JSON.stringify(response.data));
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/doctorDashboard");
      } else {
        // Patient: regular JSON
        const userData = {
          name: fullname,
          email,
          password,
          phoneNo: phone,
          gender,
          address,
          role: userType,
        };

        const response = await authAPI.register(userData);
        localStorage.setItem("user", JSON.stringify(response.data));
        window.dispatchEvent(new Event("auth-changed"));
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
        src={registerImage}
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
          {/* Profile Photo Upload (Doctor Only) */}
          {userType === "doctor" && (
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div className="relative group cursor-pointer">
                <div className={`w-24 h-24 rounded-full border-4 border-teal-100 flex items-center justify-center overflow-hidden bg-teal-50 transition-all group-hover:border-teal-300 ${!profilePhotoPreview ? 'border-dashed' : ''}`}>
                  {profilePhotoPreview ? (
                    <img src={profilePhotoPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaCloudUploadAlt className="text-3xl text-teal-400 group-hover:text-teal-500 transition-colors" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">Upload Photo</span>
                </div>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleProfilePhotoChange}
                />
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2">Profile Photo (Optional)</p>
            </div>
          )}
          <input required value={fullname} onChange={(e)=>{setfullname(e.target.value);}} type="text" placeholder="Full Name" className="input border-gray-300 rounded-lg p-3" />
          <input required value={email} onChange={(e)=>{setemail(e.target.value);}} type="email" placeholder="Email" className="input border-gray-300 rounded-lg p-3" />
          <div className="relative">
            <input required value={password} onChange={(e)=>{setpassword(e.target.value);}} type={showPassword ? "text" : "password"} placeholder="Password" className="input border-gray-300 rounded-lg p-3 w-full pr-10" />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
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

              {/* Medical License Certificate Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical License Certificate <span className="text-red-500">*</span>
                </label>
                {!certificateFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-xl cursor-pointer bg-teal-50/50 hover:bg-teal-50 transition-all duration-200 hover:border-teal-500">
                    <div className="flex flex-col items-center justify-center pt-2 pb-2">
                      <FaCloudUploadAlt className="text-3xl text-teal-500 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Click to upload certificate</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 w-full p-3 border border-teal-200 rounded-xl bg-teal-50">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-teal-500 text-white">
                      <FaFileAlt className="text-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{certificateFile.name}</p>
                      <p className="text-xs text-gray-500">{(certificateFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCertificate}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
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
