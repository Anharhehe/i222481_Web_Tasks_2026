import React from 'react';
import './TaskManager.css';

/**
 * TaskItem Component
 * Props:
 *  - task: { id, text, isCompleted }
 *  - onToggle (function)
 *  - onDelete (function)
 */
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item${task.isCompleted ? ' task-item--completed' : ''}`}>
      <input
        type="checkbox"
        className="task-checkbox"
        checked={task.isCompleted}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark "${task.text}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
      />
      <span className="task-text">{task.text}</span>
      <button
        className="btn-delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task "${task.text}"`}
      >
        Delete
      </button>
    </li>
  );
}

export default TaskItem;
