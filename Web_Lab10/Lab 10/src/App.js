import React, { useState } from 'react';
import AlienDecryption from './Task1/AlienDecryption';
import TravelerOnboarding from './Task2/TravelerOnboarding';
import TaskManager from './Task3/TaskManager';
import './App.css';

const TASKS = [
  { id: 1, label: 'Task 1 – Alien Signal Decryption' },
  { id: 2, label: 'Task 2 – Traveler Onboarding' },
  { id: 3, label: 'Task 3 – Personal Task Manager' },
];

function App() {
  const [activeTask, setActiveTask] = useState(1);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">&#128187; Web Lab 10 – React JS</h1>
        <nav className="app-nav">
          {TASKS.map((t) => (
            <button
              key={t.id}
              className={`nav-btn${activeTask === t.id ? ' nav-btn--active' : ''}`}
              onClick={() => setActiveTask(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="app-main">
        {activeTask === 1 && <AlienDecryption />}
        {activeTask === 2 && <TravelerOnboarding />}
        {activeTask === 3 && <TaskManager />}
      </main>
    </div>
  );
}

export default App;
