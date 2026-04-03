// Navbar.jsx
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import { HiMenu, HiX } from 'react-icons/hi';

const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/15 text-emerald-700"
        : "text-slate-700 hover:bg-emerald-500/10 hover:text-emerald-700"
    }`;

  const openSidebar = () => {
    setSidebarOpen(true);
    setMobileMenuOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const syncAuthState = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setIsLoggedIn(false);
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser && parsedUser.token) {
        setIsLoggedIn(true);
        setUser(parsedUser);
      } else {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuthState();

    const onStorageChange = () => syncAuthState();
    const onAuthChanged = () => syncAuthState();

    window.addEventListener("storage", onStorageChange);
    window.addEventListener("auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorageChange);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const userName = user?.name || user?.fullName || user?.username || "";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(244,251,247,0.86)_100%)] shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-[78px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
            MC
          </span>
          <Link to="/">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Medi<span className="text-emerald-600">Connect</span>
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white/75 p-1.5 shadow-sm md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/service" className={navLinkClass}>
            Service
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {!isLoggedIn ? (
            <>
              <Link
                to="/register"
                className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(16,185,129,0.30)] transition hover:scale-[1.02] hover:shadow-[0_14px_24px_rgba(13,148,136,0.28)]"
              >
                Log In
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-bold text-white">
                {userInitial}
              </span>
              <button
                onClick={openSidebar}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Profile
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-white/80 text-2xl text-emerald-700 shadow-sm transition hover:bg-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b border-emerald-100 bg-white/95 px-4 pb-5 pt-3 shadow-xl backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-700"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/service"
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-700"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`
              }
            >
              Service
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-700"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`
              }
            >
              Contact Us
            </NavLink>

            <div className="my-3 h-px w-full bg-slate-200" />

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/register"
                  className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition"
                >
                  Log In
                </Link>
              </div>
            ) : (
              <button
                onClick={openSidebar}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Profile
              </button>
            )}
          </div>
        </div>
      )}
      <Sidebar show={sidebarOpen} onClose={closeSidebar} />
    </nav>
  );
};

export default Navbar;
