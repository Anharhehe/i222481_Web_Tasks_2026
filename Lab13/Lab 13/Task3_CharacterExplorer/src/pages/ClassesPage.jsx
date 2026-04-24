import { useState, useEffect } from "react";

const SPECIES_COLORS = {
  Human: "#58a6ff",
  Alien: "#bc8cff",
  Robot: "#79c0ff",
  Humanoid: "#56d364",
  "Mythological Creature": "#ffa657",
  Animal: "#ffa657",
  Disease: "#f85149",
  Cronenberg: "#ff7b72",
  "Poopybutthole": "#e3b341",
  unknown: "#8b949e",
};

function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Fetch a large sample to extract species distribution
    Promise.all(
      [1, 2, 3, 4, 5].map((p) =>
        fetch(`https://rickandmortyapi.com/api/character?page=${p}`).then((r) => r.json())
      )
    )
      .then((pages) => {
        const all = pages.flatMap((p) => p.results);
        const map = {};
        all.forEach((c) => {
          map[c.species] = (map[c.species] || 0) + 1;
        });
        const sorted = Object.entries(map)
          .map(([species, count]) => ({ species, count }))
          .sort((a, b) => b.count - a.count);
        setClasses(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading species data...</p>
      </div>
    );
  }

  if (error) return <div className="error-banner">⚠ {error}</div>;

  return (
    <div className="page">
      <h1>Species / Classes</h1>
      <p className="subtitle">Species distribution across sampled characters</p>
      <div className="classes-grid">
        {classes.map(({ species, count }) => (
          <div className="class-card" key={species}>
            <div
              className="class-icon"
              style={{ background: SPECIES_COLORS[species] || "#8b949e" }}
            >
              {species.charAt(0)}
            </div>
            <div>
              <h3>{species}</h3>
              <p>{count} characters</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassesPage;
