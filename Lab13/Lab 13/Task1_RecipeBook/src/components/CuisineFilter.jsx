function CuisineFilter({ cuisines, selected, onChange }) {
  return (
    <div className="filter-group">
      <label>Cuisine:</label>
      <select value={selected} onChange={(e) => onChange(e.target.value)}>
        <option value="">All Cuisines</option>
        {cuisines.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}

export default CuisineFilter;
