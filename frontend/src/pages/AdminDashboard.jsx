import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, resolveAssetUrl } from "../services/api";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.token || user?.role !== "admin") { navigate("/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, allRes] = await Promise.all([
        adminAPI.getStats(), adminAPI.getPendingDoctors(), adminAPI.getAllDoctors(),
      ]);
      setStats(statsRes.data);
      setPendingDoctors(pendingRes.data);
      setAllDoctors(allRes.data);
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        toast.error("Access denied."); navigate("/login");
      }
    } finally { setLoading(false); }
  };

  const handleApprove = async (doctorId, doctorName) => {
    setActionLoading(doctorId);
    try {
      const res = await adminAPI.approveDoctor(doctorId);
      toast.success(res.data.message || `Dr. ${doctorName} approved!`);
      setSelectedDoctor(null);
      await fetchData();
    } catch { toast.error("Failed to approve doctor."); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (doctorId, doctorName) => {
    if (!window.confirm(`Reject Dr. ${doctorName}'s registration?`)) return;
    setActionLoading(doctorId);
    try {
      const res = await adminAPI.rejectDoctor(doctorId);
      toast.success(res.data.message || `Dr. ${doctorName} rejected.`);
      setSelectedDoctor(null);
      await fetchData();
    } catch { toast.error("Failed to reject doctor."); }
    finally { setActionLoading(null); }
  };



  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  const getAssetUrl = (assetPath) => {
    return resolveAssetUrl(assetPath, null);
  };

  const isPdfAsset = (assetPath) => {
    if (!assetPath) return false;
    const clean = String(assetPath).replace(/\\/g, '/').split('?')[0].toLowerCase();
    return clean.endsWith('.pdf');
  };

  const statusBadge = (status) => {
    const s = { pending: "bg-amber-100 text-amber-800 border-amber-200", approved: "bg-emerald-100 text-emerald-800 border-emerald-200", rejected: "bg-red-100 text-red-800 border-red-200", blocked: "bg-slate-200 text-slate-700 border-slate-300" };
    const dot = { pending: "bg-amber-500", approved: "bg-emerald-500", rejected: "bg-red-500", blocked: "bg-slate-500" };
    return (
      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${s[status] || ""}`}>
        <span className={`mr-1.5 h-2 w-2 rounded-full ${dot[status]}`} />
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-slate-500 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/25">MC</span>
            <div><h1 className="text-lg font-bold text-slate-900">Admin Panel</h1><p className="text-xs text-slate-500 -mt-0.5">MediConnect</p></div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mb-8">
          {[
            { label: "Total Doctors", value: stats.total, icon: "👨‍⚕️", bg: "bg-slate-50 border-slate-200" },
            { label: "Pending", value: stats.pending, icon: "⏳", bg: "bg-amber-50 border-amber-200" },
            { label: "Approved", value: stats.approved, icon: "✅", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Rejected", value: stats.rejected, icon: "❌", bg: "bg-red-50 border-red-200" },
            { label: "Blocked", value: stats.blocked, icon: "⛔", bg: "bg-slate-100 border-slate-300" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border p-5 ${stat.bg} shadow-sm`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-3xl font-extrabold text-slate-800">{stat.value}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm w-fit">
          {["pending", "all"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${activeTab === tab ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}>
              {tab === "pending" ? `Pending Requests${stats.pending > 0 ? ` (${stats.pending})` : ""}` : "All Doctors"}
            </button>
          ))}
        </div>

        {/* Pending Tab */}
        {activeTab === "pending" && (
          pendingDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 py-20">
              <span className="text-6xl mb-4">🎉</span>
              <h3 className="text-xl font-bold text-slate-700">All caught up!</h3>
              <p className="mt-1 text-sm text-slate-500">No pending doctor registrations.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {pendingDoctors.map((doc, idx) => (
                  <motion.div key={doc._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl cursor-pointer transition-all"
                    onClick={() => setSelectedDoctor(doc)}>
                    <div className="absolute right-4 top-4"><span className="flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" /></span></div>
                    <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30 p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-lg shadow-emerald-500/30">
                          {doc.profileImage ? (
                            <img src={getAssetUrl(doc.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            doc.name?.charAt(0)?.toUpperCase() || "D"
                          )}
                        </div>
                        <div><h3 className="text-lg font-bold text-slate-900">Dr. {doc.name}</h3><p className="text-sm text-slate-500">{doc.specialization}</p></div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</p><p className="mt-0.5 font-medium text-slate-700 break-all">{doc.email}</p></div>
                        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hospital</p><p className="mt-0.5 font-medium text-slate-700">{doc.hospitalName}</p></div>
                        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Experience</p><p className="mt-0.5 font-medium text-slate-700">{doc.experience} yrs</p></div>
                        <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fees</p><p className="mt-0.5 font-medium text-slate-700">₹{doc.fees}</p></div>
                      </div>
                      <p className="mt-3 text-xs text-teal-600 font-semibold">Click to view full details & certificate →</p>
                    </div>
                    <div className="flex gap-3 border-t border-slate-100 bg-slate-50/50 p-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleApprove(doc._id, doc.name)} disabled={actionLoading === doc._id}
                        className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98] disabled:opacity-50">
                        {actionLoading === doc._id ? "Processing..." : "✓ Approve"}
                      </button>
                      <button onClick={() => handleReject(doc._id, doc.name)} disabled={actionLoading === doc._id}
                        className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98] disabled:opacity-50">
                        ✕ Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )
        )}

        {/* All Doctors Tab */}
        {activeTab === "all" && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {["Doctor", "Specialization", "Hospital", "Exp", "Fees", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allDoctors.map((doc) => (
                    <tr key={doc._id} className="transition hover:bg-emerald-50/30 cursor-pointer" onClick={() => setSelectedDoctor(doc)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
                            {doc.profileImage ? (
                              <img src={getAssetUrl(doc.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              doc.name?.charAt(0)?.toUpperCase() || "D"
                            )}
                          </div>
                          <div><p className="font-semibold text-slate-800">Dr. {doc.name}</p><p className="text-xs text-slate-500">{doc.email}</p></div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{doc.specialization}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{doc.hospitalName}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">{doc.experience} yrs</td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">₹{doc.fees}</td>
                      <td className="px-5 py-4">{statusBadge(doc.status)}</td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        {doc.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(doc._id, doc.name)}
                              disabled={actionLoading === doc._id}
                              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() => handleReject(doc._id, doc.name)}
                              disabled={actionLoading === doc._id}
                              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allDoctors.length === 0 && <div className="flex flex-col items-center py-16 text-slate-400"><span className="text-4xl mb-2">📋</span><p className="font-medium">No doctors registered yet.</p></div>}
          </div>
        )}
      </main>

      {/* Doctor Detail Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedDoctor(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 z-50 m-auto max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl">

              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 rounded-t-3xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 overflow-hidden items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-lg">
                    {selectedDoctor.profileImage ? (
                      <img src={getAssetUrl(selectedDoctor.profileImage)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      selectedDoctor.name?.charAt(0)?.toUpperCase() || "D"
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Dr. {selectedDoctor.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-slate-500">{selectedDoctor.specialization}</span>
                      {statusBadge(selectedDoctor.status)}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedDoctor(null)} className="rounded-full p-2 hover:bg-white/80 transition text-slate-500 hover:text-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Full Name", value: selectedDoctor.name },
                      { label: "Email", value: selectedDoctor.email },
                      { label: "Phone", value: selectedDoctor.phoneNo || "N/A" },
                      { label: "Gender", value: selectedDoctor.gender || "N/A" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
                        <p className="mt-1 font-medium text-slate-800 break-all">{item.value}</p>
                      </div>
                    ))}
                    <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Address</p>
                      <p className="mt-1 font-medium text-slate-800">{selectedDoctor.address || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Specialization", value: selectedDoctor.specialization },
                      { label: "Qualification", value: selectedDoctor.qualification },
                      { label: "Experience", value: `${selectedDoctor.experience} years` },
                      { label: "Licence No.", value: selectedDoctor.licenceNo },
                      { label: "Hospital / Clinic", value: selectedDoctor.hospitalName },
                      { label: "Consultation Fee", value: `₹${selectedDoctor.fees}` },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
                        <p className="mt-1 font-medium text-slate-800">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical License Certificate */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Medical License Certificate</h3>
                  {selectedDoctor.licenceCertificate ? (
                    <div className="rounded-2xl border border-slate-200 overflow-hidden">
                      {isPdfAsset(selectedDoctor.licenceCertificate) ? (
                        <div className="bg-slate-50 p-6 text-center">
                          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500 text-3xl mb-3">📄</div>
                          <p className="font-medium text-slate-700 mb-2">PDF Certificate Uploaded</p>
                          <a href={getAssetUrl(selectedDoctor.licenceCertificate)} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition">
                            View PDF Certificate ↗
                          </a>
                        </div>
                      ) : (
                        <div>
                          <img src={getAssetUrl(selectedDoctor.licenceCertificate)} alt="Medical License Certificate"
                            className="w-full max-h-[400px] object-contain bg-slate-50" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          <div className="hidden items-center justify-center p-8 bg-slate-50 text-slate-400">
                            <p>Failed to load certificate image</p>
                          </div>
                          <div className="border-t border-slate-100 bg-slate-50 p-3 text-center">
                            <a href={getAssetUrl(selectedDoctor.licenceCertificate)} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                              Open full size ↗
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <span className="text-4xl mb-2 block">📎</span>
                      <p className="text-sm font-medium text-slate-500">No certificate uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer Actions */}
              {selectedDoctor.status === "pending" && (
                <div className="sticky bottom-0 flex gap-3 border-t border-slate-100 bg-white p-5 rounded-b-3xl">
                  <button onClick={() => handleApprove(selectedDoctor._id, selectedDoctor.name)} disabled={actionLoading === selectedDoctor._id}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50">
                    {actionLoading === selectedDoctor._id ? "Processing..." : "✓ Approve Doctor"}
                  </button>
                  <button onClick={() => handleReject(selectedDoctor._id, selectedDoctor.name)} disabled={actionLoading === selectedDoctor._id}
                    className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98] disabled:opacity-50">
                    ✕ Reject Doctor
                  </button>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
