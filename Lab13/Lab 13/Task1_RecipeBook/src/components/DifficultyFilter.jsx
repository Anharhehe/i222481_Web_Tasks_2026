function DifficultyFilter({ selected, onChange }) {
  const levels = ["Easy", "Medium", "Hard"];
  return (
    <div className="filter-group">
      <label>Difficulty:</label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">All Levels</option>
        {levels.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
    </div>
  );
}

export default DifficultyFilter;
