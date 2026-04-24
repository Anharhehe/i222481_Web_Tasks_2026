import { useState, useEffect } from "react";
import CharacterCard from "./CharacterCard";

function CharacterList({ favorites, onToggleFavorite }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // States for search/filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("");

  // Initial data fetch
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch characters");
        return res.json();
      })
      .then((data) => {
        setCharacters(data.results);
        setTotalPages(data.info.pages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  // Search/filter updates — separate useEffect
  useEffect(() => {
    if (!search && !statusFilter && !speciesFilter) return;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: 1 });
    if (search) params.set("name", search);
    if (statusFilter) params.set("status", statusFilter);
    if (speciesFilter) params.set("species", speciesFilter);

    let isCurrent = true;
    fetch(`https://rickandmortyapi.com/api/character?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("No characters found");
        return res.json();
      })
      .then((data) => {
        if (isCurrent) {
          setCharacters(data.results);
          setTotalPages(data.info.pages);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isCurrent) {
          setCharacters([]);
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { isCurrent = false; };
  }, [search, statusFilter, speciesFilter]);

  return (
    <div>
      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Species:</label>
          <select value={speciesFilter} onChange={(e) => { setSpeciesFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="Human">Human</option>
            <option value="Alien">Alien</option>
            <option value="Robot">Robot</option>
            <option value="Humanoid">Humanoid</option>
            <option value="Mythological Creature">Mythological</option>
          </select>
        </div>
      </div>

      {error && <div className="error-banner">⚠ {error}</div>}

      {loading ? (
        <div className="char-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-block img-skel"></div>
              <div className="skeleton-lines">
                <div className="skeleton-block line wide"></div>
                <div className="skeleton-block line"></div>
                <div className="skeleton-block line short"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="char-grid">
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                isFavorite={favorites.includes(char.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>

          {!search && !statusFilter && !speciesFilter && (
            <div className="pagination">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                ← Prev
              </button>
              <span>Page {page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CharacterList;
