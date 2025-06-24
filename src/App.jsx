import React, { useEffect, useState } from 'react';
import Calendar from './components/Calendar';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <header className="sticky top-0 z-50 text-center p-4 shadow bg-white dark:bg-gray-800">
        <div className="flex justify-between max-w-5xl mx-auto items-center">
          <h1 className="text-2xl font-bold tracking-tight">My Calendar</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-1 text-sm font-medium rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>
      <Calendar />
    </div>
  );
};

export default App;
