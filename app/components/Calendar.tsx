'use client'

import { useState, useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
} from 'date-fns';

interface Appointment {
  consultation_type: string;
  schedule: Date;
}

interface CalendarProps {
  appointments: Appointment[];
}

const Calendar: React.FC<CalendarProps> = ({ appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use useMemo to memoize the calculated dates
  const { dates } = useMemo(() => {
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(startMonth);
    const endDate = endOfWeek(endMonth);

    const dates: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      dates.push(day);
      day = addDays(day, 1);
    }

    return { startDate, endDate, dates };
  }, [currentDate]);  // Dependency on currentDate

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';
    return (
      <div className="flex justify-between items-center text-xs">
        <button
          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setCurrentDate(addDays(currentDate, -30))}
        >
          Previous
        </button>
        <h2 className="text-xs font-semibold">{format(currentDate, dateFormat)}</h2>
        <button
          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setCurrentDate(addDays(currentDate, 30))}
        >
          Next
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-xs font-semibold">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-1">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const dateFormat = 'd';
    return (
      <div className="grid grid-cols-7 text-xs">
        {dates.map((day, index) => {
          const isAppointment = appointments.some((appointment) =>
            isSameDay(appointment.schedule, day)
          );

          return (
            <div
              key={index}
              className={`p-1 border border-gray-200 text-center ${
                isAppointment
                  ? 'bg-green-100'
                  : day.getMonth() === currentDate.getMonth()
                  ? 'bg-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {format(day, dateFormat)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-4">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
