import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ShieldCheck,
  Star,
  Users,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import heroImage from "../../assets/images/her.jpg";
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fffe] via-[#eefcf8] to-[#f4fbff] py-16 md:py-24">
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-teal-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-emerald-100/40 rounded-full blur-3xl"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:42px_42px]"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white/80 backdrop-blur-md px-4 py-2 shadow-md mb-6">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-slate-700 font-medium">
                Trusted Digital Healthcare Platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Experience{" "}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Smarter Healthcare
              </span>{" "}
              With Comfort & Care
            </h1>

            {/* Description */}
            <p className="mt-6 text-slate-600 text-base sm:text-lg leading-8 max-w-xl">
              Book appointments with expert doctors, access modern medical care,
              and manage your health journey through a seamless and beautifully
              designed digital healthcare experience.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(13,148,136,0.25)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_14px_35px_rgba(6,182,212,0.25)]"
              >
                <CalendarDays className="w-5 h-5" />
                Book Appointment
              </Link>

              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white text-slate-800 px-7 py-3.5 font-semibold shadow-sm transition duration-300 hover:bg-teal-50 hover:border-teal-300">
                <HeartPulse className="w-5 h-5 text-teal-600" />
                Explore Services
              </button>
            </div>

            {/* Mini Features */}
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                Specialist Doctors
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                Secure Health Records
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                Easy Scheduling
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-lg p-5">
                <h3 className="text-3xl font-bold text-teal-600">500+</h3>
                <p className="text-slate-600 mt-1 text-sm">Verified Doctors</p>
              </div>

              <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-lg p-5">
                <h3 className="text-3xl font-bold text-cyan-600">10k+</h3>
                <p className="text-slate-600 mt-1 text-sm">Happy Patients</p>
              </div>

              <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white shadow-lg p-5">
                <h3 className="text-3xl font-bold text-emerald-600">24/7</h3>
                <p className="text-slate-600 mt-1 text-sm">Care Support</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[530px]">
              {/* Soft Background Glow */}
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-teal-200/40 via-cyan-200/30 to-emerald-200/30 blur-2xl"></div>

              {/* Main Image Card */}
              <div className="relative rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white shadow-2xl p-3">
                <img
                  src={heroImage}
                  alt="Doctor"
                  className="w-full h-[580px] object-cover rounded-[1.6rem]"
                />
              </div>

              {/* Floating Top Card */}
              <div className="absolute top-6 -left-8 hidden md:flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-100 px-5 py-4 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Patient Rating</p>
                  <h4 className="text-lg font-bold text-slate-900">4.9/5 Excellence</h4>
                </div>
              </div>

              {/* Floating Bottom Left */}
              <div className="absolute bottom-8 -left-10 hidden md:flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-100 px-5 py-4 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Trusted By</p>
                  <h4 className="text-lg font-bold text-slate-900">10,000+ Patients</h4>
                </div>
              </div>

              {/* Floating Bottom Right */}
              <div className="absolute bottom-16 right-[-20px] hidden lg:flex rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-100 px-5 py-4 shadow-xl">
                <div>
                  <p className="text-xs text-slate-500">Available Support</p>
                  <h4 className="text-lg font-bold text-teal-600">24/7 Online Care</h4>
                </div>
              </div>

              {/* Decorative Orbs */}
              <div className="absolute -top-8 right-10 w-24 h-24 rounded-full bg-teal-200/40 blur-3xl"></div>
              <div className="absolute bottom-10 right-20 w-20 h-20 rounded-full bg-cyan-200/40 blur-3xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;