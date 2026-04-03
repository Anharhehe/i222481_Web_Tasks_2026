import React, { useState } from 'react';
import './TaskManager.css';

/**
 * TaskInput Component
 * Props: onAddTask (function)
 */
function TaskInput({ onAddTask }) {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="task-input-wrap">
      <input
        type="text"
        className="task-input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new task..."
        aria-label="New task input"
      />
      <button className="btn-add-task" onClick={handleAdd}>
        Add Task
      </button>
    </div>
  );
}

export default TaskInput;
