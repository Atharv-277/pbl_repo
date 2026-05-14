import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Calendar,
  Users,
  Droplets,
  ArrowLeft,
  Save
} from "lucide-react";

export default function EditInfo() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phoneNo: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    try {
      const parsedUser = JSON.parse(userData);
      setFormState({
        name: parsedUser?.name || "",
        age: parsedUser?.age || "",
        gender: parsedUser?.gender || "",
        bloodGroup: parsedUser?.bloodGroup || "",
        phoneNo: parsedUser?.phoneNo || "",
      });
    } catch {
      setFormState({
        name: "",
        age: "",
        gender: "",
        bloodGroup: "",
        phoneNo: "",
      });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const userData = localStorage.getItem("user");
    const parsedUser = userData ? JSON.parse(userData) : {};

    const updatedUser = {
      ...parsedUser,
      ...formState,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/patientSettings");
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 md:px-8 font-sans selection:bg-blue-100 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl md:p-10">
          
          {/* Header Section */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate("/patientSettings")}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Profile</h1>
              <p className="mt-1 text-sm text-slate-500">
                Update your personal information to keep your account current.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {/* Full Name - Full Width */}
            <motion.div variants={itemVariants}>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 text-slate-400" size={18} />
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  placeholder="John Doe"
                />
              </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Phone */}
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-4 text-slate-400" size={18} />
                  <input
                    name="phoneNo"
                    value={formState.phoneNo}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </motion.div>

              {/* Age */}
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Age
                </label>
                <div className="relative flex items-center">
                  <Calendar className="absolute left-4 text-slate-400" size={18} />
                  <input
                    name="age"
                    value={formState.age}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. 28"
                  />
                </div>
              </motion.div>

              {/* Gender */}
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Gender
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-4 text-slate-400" size={18} />
                  <input
                    name="gender"
                    value={formState.gender}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Male / Female / Other"
                  />
                </div>
              </motion.div>

              {/* Blood Group */}
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Blood Group
                </label>
                <div className="relative flex items-center">
                  <Droplets className="absolute left-4 text-rose-400" size={18} />
                  <input
                    name="bloodGroup"
                    value={formState.bloodGroup}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white/50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                    placeholder="e.g. O+"
                  />
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col-reverse justify-end gap-3 pt-6 border-t border-slate-100 sm:flex-row"
            >
              <button
                type="button"
                onClick={() => navigate("/patientSettings")}
                className="w-full rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className=" group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 sm:w-auto"
              >
                <Save size={18} className="transition-transform group-hover:scale-110" />
                Save Changes
              </button>
            </motion.div>
          </motion.form>
          
        </div>
      </motion.div>
    </div>
  );
}