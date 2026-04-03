import React from 'react';
import './TaskManager.css';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

/**
 * FilterControls Component
 * Props:
 *  - currentFilter (string)
 *  - onFilterChange (function)
 */
function FilterControls({ currentFilter, onFilterChange }) {
  return (
    <div className="filter-controls">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`filter-btn${currentFilter === f.value ? ' filter-btn--active' : ''}`}
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default FilterControls;
