export default function PatientDashboardSidebar({ patientName, sidebarOptions, onAction }) {
  return (
    <aside className="hidden w-72 shrink-0 self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block lg:sticky lg:top-6">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-700 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-lg font-semibold">
            {patientName?.charAt(0)?.toUpperCase() || "P"}
          </div>
          <div>
            <p className="text-sm text-white/80">Signed in as</p>
            <p className="font-semibold">{patientName}</p>
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-2">
        {sidebarOptions.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onAction(item.key)}
            className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
              item.key === "logout"
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
