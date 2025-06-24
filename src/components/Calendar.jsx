import React, { useState } from 'react';
import dayjs from 'dayjs';
import initialEvents from '../data/events.json';
import Sidebar from './SidebarPanel';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#3b82f6'
  });
  const [popupEvent, setPopupEvent] = useState(null);
  const [conflictEvents, setConflictEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const days = [];
  let date = startDate;
  while (date.isBefore(endDate) || date.isSame(endDate)) {
    days.push(date);
    date = date.add(1, 'day');
  }

  const getEventsForDay = (date) => {
    return events.filter(e => dayjs(e.date).isSame(date, 'day'));
  };

  {/* For Conflict Detection */}
  const hasConflict = (events) => {
    const conflicts = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const aStart = dayjs(`${events[i].date}T${events[i].startTime}`);
        const aEnd = dayjs(`${events[i].date}T${events[i].endTime}`);
        const bStart = dayjs(`${events[j].date}T${events[j].startTime}`);
        const bEnd = dayjs(`${events[j].date}T${events[j].endTime}`);
        if (aStart.isBefore(bEnd) && bStart.isBefore(aEnd)) {
          conflicts.push([events[i], events[j]]);
        }
      }
    }
    return conflicts;
  };
  {/* Delete Events */}
  const handleDelete = (eventToDelete) => {
    setEvents(events.filter(e => e !== eventToDelete));
    setPopupEvent(null);
  };
  {/* Add or Update Events */}
  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    if (popupEvent) {
      setEvents(events.map(event => event === popupEvent ? newEvent : event));
    } else {
      setEvents([...events, newEvent]);
    }
    setNewEvent({ title: '', date: '', startTime: '', endTime: '', color: '#3b82f6' });
    setShowForm(false);
    setPopupEvent(null);
  };
  {/*Month and Year Change */}
  const handleMonthChange = (e) => {
    setCurrentDate(currentDate.month(parseInt(e.target.value)));
  };

  const handleYearChange = (e) => {
    setCurrentDate(currentDate.year(parseInt(e.target.value)));
  };
  {/* Search Functionality */}
  const filteredEvents = searchQuery
    ? events.filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchClick = (dateStr) => {
    const targetDate = dayjs(dateStr);
    setCurrentDate(targetDate);
  };
  
  {/* Render Calendar */}
  return (
    <div className="flex">
      <Sidebar
        currentDate={currentDate}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredEvents={filteredEvents}
        onSearchClick={handleSearchClick}
      />

      <div className="p-6 max-w-6xl mx-auto relative w-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} className="text-2xl">‹</button>
          <h1 className="text-2xl font-semibold tracking-tight">{currentDate.format('MMMM YYYY')}</h1>
          <button onClick={() => setCurrentDate(currentDate.add(1, 'month'))} className="text-2xl">›</button>
        </div>

        <button onClick={() => { setShowForm(true); setPopupEvent(null); }} className="mb-4 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">Add New Event</button>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form onSubmit={handleAddOrUpdateEvent} className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 w-full max-w-lg relative">
              <button type="button" onClick={() => { setShowForm(false); setPopupEvent(null); }} className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl">×</button>
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100"> {popupEvent ? 'Edit Event' : 'Add New Event'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                  <input type="text" placeholder="e.g., Team Meeting" className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input type="date" className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input type="time" className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={newEvent.startTime} onChange={e => setNewEvent({ ...newEvent, startTime: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input type="time" className="border border-gray-300 dark:border-gray-600 p-3 rounded-lg w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={newEvent.endTime} onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Event Color</label>
                  <input type="color" className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg" value={newEvent.color} onChange={e => setNewEvent({ ...newEvent, color: e.target.value })} />
                </div>
              </div>
              <div className="mt-6 text-center">
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">{popupEvent ? 'Update Event' : 'Add Event'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-600 dark:text-gray-300">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2 mt-2">
          {days.map((date, idx) => {
            const isToday = dayjs().isSame(date, 'day');
            const dayEvents = getEventsForDay(date);
            const conflicts = hasConflict(dayEvents);
            return (
              <div
                key={idx}
                className={`border rounded-lg p-2 h-40 overflow-y-auto text-sm cursor-pointer ${
                  isToday
                    ? 'bg-indigo-100 border-indigo-400 dark:bg-indigo-900 dark:border-indigo-300'
                    : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                }`}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedDateEvents({ date, events: dayEvents });
                  }
                }}
              >
                <div className="text-xs text-right font-medium text-gray-800 dark:text-gray-200">{date.date()}</div>

                {conflicts.length > 0 && (
                  <div onClick={(e) => { e.stopPropagation(); setConflictEvents(conflicts); }} className="relative mt-1 inline-flex items-center space-x-1 text-xs text-red-600 dark:text-red-400 cursor-pointer">
                    <span className="relative inline-flex items-center">
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{conflicts.length}</span>
                      <span className="ml-6 font-bold">Conflict Detected</span>
                    </span>
                  </div>
                )}

                {dayEvents.map((event, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopupEvent(event);
                      setNewEvent(event);
                      setShowForm(false);
                    }}
                    className="mt-1 rounded px-2 py-1 text-white text-xs flex justify-between items-center shadow-sm"
                    style={{ backgroundColor: event.color }}
                  >
                    <span className="truncate">{event.title} ({event.startTime})</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(event); }} className="ml-2 text-white font-bold hover:text-gray-200">×</button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {selectedDateEvents && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full relative">
              <button onClick={() => setSelectedDateEvents(null)} className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black dark:hover:text-white">×</button>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Events on {selectedDateEvents.date.format('MMMM D, YYYY')}
              </h2>
              {selectedDateEvents.events.length > 0 ? (
                <ul className="text-sm space-y-2 text-gray-800 dark:text-gray-200">
                  {selectedDateEvents.events.map((e, idx) => (
                    <li key={idx}>
                      <strong>{e.title}</strong> ({e.startTime} - {e.endTime})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300">No events on this day.</p>
              )}
            </div>
          </div>
        )}

        {popupEvent && !showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full relative">
              <button
                onClick={() => setPopupEvent(null)}
                className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black dark:hover:text-white"
              >×</button>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{popupEvent.title}</h2>
              <p className="text-gray-800 dark:text-gray-200"><strong>Date:</strong> {popupEvent.date}</p>
              <p className="text-gray-800 dark:text-gray-200"><strong>Time:</strong> {popupEvent.startTime} - {popupEvent.endTime}</p>
              <p className="text-gray-800 dark:text-gray-200"><strong>Color:</strong> <span className="inline-block w-4 h-4 rounded ml-1 align-middle" style={{ backgroundColor: popupEvent.color }}></span></p>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => { setShowForm(true); }} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">✎ Edit</button>
                <button onClick={() => handleDelete(popupEvent)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}

        {conflictEvents.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-md w-full relative">
              <button
                onClick={() => setConflictEvents([])}
                className="absolute top-2 right-3 text-xl text-gray-500 hover:text-black dark:hover:text-white"
              >×</button>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Conflicting Events</h2>
              <ul className="space-y-2 text-gray-800 dark:text-gray-200 text-sm">
                {conflictEvents.map(([eventA, eventB], i) => (
                  <li key={i}><strong>{eventA.title}</strong> and <strong>{eventB.title}</strong> overlap between {eventA.startTime}-{eventA.endTime} and {eventB.startTime}-{eventB.endTime}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
