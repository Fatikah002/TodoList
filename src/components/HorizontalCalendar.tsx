import React, { useState } from "react";
import { formatLocalDate } from "@/lib/date";

type HorizontalCalendarProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export function HorizontalCalendar({ selectedDate, onDateChange }: HorizontalCalendarProps) {
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = today.getDay();

  const mondayDiff = currentDay === 0 ? -6 : 1 - currentDay;

  const startOfWeek = new Date(currentYear, currentMonth, today.getDate() + mondayDiff);

  const calendarDays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + i,
    );

    calendarDays.push({
      day: daysOfWeek[date.getDay()],
      date: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }),
      fullDate: formatLocalDate(date),
    });
  }

  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto bg-white py-4">
      {calendarDays.map((item) => {
        const isSelected = item.fullDate === selectedDate;

        return (
          <button
            key={item.fullDate}
            onClick={() => onDateChange(item.fullDate)}
            className={`flex w-12 flex-col items-center gap-3 px-2 py-3 transition-all duration-200 ${
              isSelected ? "rounded-full border border-green-400" : "border border-transparent"
            }`}
          >
            <p
              className={`text-sm ${isSelected ? "font-semibold text-slate-900" : "text-gray-400"}`}
            >
              {item.day}
            </p>

            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-green-200 text-sm font-medium ${
                isSelected ? "bg-green-400 text-white" : "bg-green-100 text-gray-500"
              }`}
            >
              {item.date}
            </div>
          </button>
        );
      })}
    </div>
  );
}
