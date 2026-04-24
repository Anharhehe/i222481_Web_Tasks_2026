import React from 'react';
import TaskItem from './TaskItem';
import './TaskManager.css';

/**
 * TaskList Component
 * Props:
 *  - tasks (array)
 *  - onToggleTask (function)
 *  - onDeleteTask (function)
 */
function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p className="no-tasks">No tasks found.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
