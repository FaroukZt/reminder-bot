import React, { useState, useEffect } from 'react';
import './App.css';
import ReminderApp from './components/ReminderApp';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    document.body.style.background = isDarkMode
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)';
  }, [isDarkMode]);

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <ReminderApp onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
    </div>
  );
};

export default App;
