import React, { useMemo, useState } from "react";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function Calendar({ appointments = [], selectedDate = "", onDateSelect }) {
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lastDatePrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const todayDate = today.getDate();
  const isThisMonth = today.getMonth() === month && today.getFullYear() === year;

  const selectedDateKey = selectedDate || "";

  const appointmentDateKeys = useMemo(() => {
    return appointments
      .map((apt) => {
        if (!apt.appointmentDate) return "";
        const aptDate = new Date(apt.appointmentDate);
        if (Number.isNaN(aptDate.getTime())) return "";
        return aptDate.toISOString().split("T")[0];
      })
      .filter(Boolean);
  }, [appointments]);

  const appointmentDates = appointmentDateKeys
    .filter((dateKey) => {
      const d = new Date(dateKey);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .map((dateKey) => new Date(dateKey).getDate());

  const generateCalendar = () => {
    const dates = [];

    // Previous month trailing days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      dates.push({
        value: lastDatePrevMonth - i,
        current: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({
        value: i,
        current: true,
      });
    }

    return dates;
  };

  const handleSelectDate = (dayValue, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    const selected = new Date(year, month, dayValue);
    const isoDate = selected.toISOString().split("T")[0];

    if (selectedDateKey === isoDate) {
      onDateSelect?.("");
      return;
    }

    onDateSelect?.(isoDate);
  };

  const goPrevMonth = () => setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goNextMonth = () => setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-center shadow">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrevMonth}
          className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="text-sm font-semibold text-slate-800">
          {date.toLocaleString("default", { month: "long" })} {year}
        </p>
        <button
          type="button"
          onClick={goNextMonth}
          className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 text-xs font-medium text-gray-500 mb-2">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-sm gap-y-1">
        {generateCalendar().map((day, idx) => {
          const isToday =
            isThisMonth && day.current && day.value === todayDate;
          const hasAppointment = appointmentDates.includes(day.value);
          const dayDate = day.current ? new Date(year, month, day.value).toISOString().split("T")[0] : "";
          const isSelected = day.current && selectedDateKey === dayDate;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDate(day.value, day.current)}
              disabled={!day.current}
              className={`text-center h-8 leading-8 rounded-full 
                ${!day.current ? "text-gray-400" : ""}
                ${hasAppointment && day.current ? "text-rose-600 font-semibold" : ""}
                ${isToday ? "bg-emerald-500 text-white font-bold" : ""}
                ${isSelected ? "ring-2 ring-cyan-500 bg-cyan-500 text-white font-bold" : ""}
                ${day.current ? "hover:bg-cyan-50" : "cursor-default"}
              `}
            >
              {day.value}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-600">
        {appointmentDates.length > 0 && (
          <span>
            <span className="text-rose-500">●</span> Appointment dates
          </span>
        )}
        {selectedDateKey && (
          <span>
            <span className="text-cyan-600">●</span> Selected: {new Date(selectedDateKey).toLocaleDateString()}
          </span>
        )}
      </div>
      {selectedDateKey && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => onDateSelect?.("")}
            className="text-xs font-semibold text-cyan-700 transition hover:text-cyan-900"
          >
            Clear date filter
          </button>
        </div>
      )}
    </div>
  );
}
