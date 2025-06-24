import React, { useState } from 'react';
import dayjs from 'dayjs';

const Sidebar = ({
  currentDate,
  onMonthChange,
  onYearChange,
  searchQuery,
  onSearchChange,
  filteredEvents,
  onSearchClick
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showMonthYearFilter, setShowMonthYearFilter] = useState(false);
  const [showRangeFilter, setShowRangeFilter] = useState(false);
  const [monthFilter, setMonthFilter] = useState(dayjs().month());
  const [yearFilter, setYearFilter] = useState(dayjs().year());
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const months = [...Array(12).keys()].map(i => dayjs().month(i).format('MMMM'));
  const years = Array.from({ length: 20 }, (_, i) => dayjs().year() - 10 + i);
  const today = dayjs();
  const todayEvents = filteredEvents.filter(e => dayjs(e.date).isSame(today, 'day'));

  const startOfMonth = currentDate.startOf('month');
  const daysInMonth = currentDate.daysInMonth();
  const startDay = startOfMonth.day();
  const dates = [];

  for (let i = 0; i < startDay; i++) dates.push(null);
  for (let i = 1; i <= daysInMonth; i++) dates.push(i);

  const eventsInSelectedMonth = filteredEvents.filter(e =>
    dayjs(e.date).month() === monthFilter && dayjs(e.date).year() === yearFilter
  );

  const eventsInRange = filteredEvents.filter(e => {
    const date = dayjs(e.date);
    return fromDate && toDate && date.isAfter(dayjs(fromDate).subtract(1, 'day')) && date.isBefore(dayjs(toDate).add(1, 'day'));
  });

  return (
    <aside className="sticky top-16 w-72 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 p-5 overflow-y-auto h-[calc(100vh-4rem)] shadow-md">
      <div className="space-y-6">
        {/* Mini Calendar */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {currentDate.format('MMMM YYYY')}
          </h2>
          <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-600 dark:text-gray-300 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="font-medium">{d}</div>
            ))}
            {dates.map((day, idx) => {
              const isToday =
                day === today.date() &&
                currentDate.month() === today.month() &&
                currentDate.year() === today.year();

              return (
                <div
                  key={idx}
                  className={`h-6 flex items-center justify-center rounded 
                    ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200'}
                    ${day ? 'hover:bg-blue-100 dark:hover:bg-gray-700 cursor-default' : ''}`}
                >
                  {day || ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Date Navigation */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Date Navigation</h2>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded shadow hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {showDatePicker ? 'Hide Date Picker' : 'Select Month & Year'}
          </button>

          {showDatePicker && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Month</label>
                <select
                  value={currentDate.month()}
                  onChange={onMonthChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {months.map((month, idx) => (
                    <option key={month} value={idx}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Year</label>
                <select
                  value={currentDate.year()}
                  onChange={onYearChange}
                  className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Monthly and Yearly Event List */}
        <div>
          <h2
            onClick={() => setShowMonthYearFilter(!showMonthYearFilter)}
            className="cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2"
          >
            Monthly & Yearly Events <span className="ml-1">▾</span>
          </h2>
          {showMonthYearFilter && (
            <div className="space-y-4">
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(Number(e.target.value))}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx}>{m}</option>
                ))}
              </select>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(Number(e.target.value))}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ul className="text-sm divide-y divide-gray-300 dark:divide-gray-600">
                {eventsInSelectedMonth.length > 0 ? eventsInSelectedMonth.map((event, idx) => (
                  <li key={idx} className="py-1 text-gray-800 dark:text-white">{event.title} - {dayjs(event.date).format('MMM D')}</li>
                )) : <li className="py-1 text-gray-500 dark:text-gray-400">No events</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Date Range Event */}
        <div>
          <h2
            onClick={() => setShowRangeFilter(!showRangeFilter)}
            className="cursor-pointer text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2"
          >
            Date Range Events <span className="ml-1">▾</span>
          </h2>
          {showRangeFilter && (
            <div className="space-y-4">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <ul className="text-sm divide-y divide-gray-300 dark:divide-gray-600">
                {eventsInRange.length > 0 ? eventsInRange.map((event, idx) => (
                  <li key={idx} className="py-1 text-gray-800 dark:text-white">{event.title} - {dayjs(event.date).format('MMM D')}</li>
                )) : <li className="py-1 text-gray-500 dark:text-gray-400">No events</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Search Events */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Search Events</h2>
          <input
            type="text"
            placeholder="Enter title..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          {searchQuery && (
            <ul className="mt-3 divide-y divide-gray-300 dark:divide-gray-700 text-sm">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, idx) => (
                  <li
                    key={idx}
                    className="py-2 px-2 hover:bg-gray-300 dark:hover:bg-gray-800 cursor-pointer rounded"
                    onClick={() => onSearchClick(event.date)}
                  >
                    <div className="font-medium text-gray-700 dark:text-gray-100">{event.title}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs">{dayjs(event.date).format('MMM D, YYYY')}</div>
                  </li>
                ))
              ) : (
                <li className="py-2 text-gray-600 dark:text-gray-400">No matching events.</li>
              )}
            </ul>
          )}
        </div>

        {/* Today's Reminders */}
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg shadow mt-6">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-3">Today's Reminders</h2>
          {todayEvents.length > 0 ? (
            <ul className="space-y-2">
              {todayEvents.map((event, idx) => (
                <li key={idx} className="text-sm text-gray-800 dark:text-white">
                  <strong>{event.title}</strong><br />
                  {event.startTime} - {event.endTime}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">No events for today.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
