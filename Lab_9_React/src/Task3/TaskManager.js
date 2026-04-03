import React, { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import FilterControls from './FilterControls';
import TaskList from './TaskList';
import './TaskManager.css';

const INITIAL_TASKS = [
  { id: 1, text: 'Read React documentation', isCompleted: false },
  { id: 2, text: 'Build a small project', isCompleted: true },
  { id: 3, text: 'Write lab report', isCompleted: false },
];

/**
 * App (TaskManager) — main parent component
 * Manages all state: tasks, filter, loading, newTaskText
 */
function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // useEffect — simulate loading initial data from an API after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(INITIAL_TASKS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Add a new task
  const handleAddTask = (text) => {
    const newTask = { id: Date.now(), text, isCompleted: false };
    setTasks((prev) => [...prev, newTask]);
  };

  // Toggle completion status
  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.isCompleted;
    if (filter === 'completed') return t.isCompleted;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="tm-wrap">
      <div className="tm-header">
        <h2 className="tm-title">&#128203; Personal Task Manager</h2>
        {!loading && (
          <span className="tm-counter">
            {completedCount} / {tasks.length} completed
          </span>
        )}
      </div>

      {loading ? (
        <p className="loading-msg">Loading tasks...</p>
      ) : (
        <>
          <TaskInput onAddTask={handleAddTask} />
          <FilterControls currentFilter={filter} onFilterChange={setFilter} />
          <TaskList
            tasks={filteredTasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        </>
      )}
    </div>
  );
}

export default TaskManager;
