import { useState, useEffect } from "react";
import CharacterCard from "../components/CharacterCard";

function FavoritesPage({ favorites, onToggleFavorite }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full data for each favorited character id
  useEffect(() => {
    if (favorites.length === 0) {
      setCharacters([]);
      return;
    }
    setLoading(true);
    setError(null);
    const ids = favorites.join(",");
    fetch(`https://rickandmortyapi.com/api/character/${ids}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites");
        return res.json();
      })
      .then((data) => {
        // API returns array for multiple, single object for one
        setCharacters(Array.isArray(data) ? data : [data]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [favorites]);

  return (
    <div className="page">
      <h1>Favorite Characters</h1>
      <p className="subtitle">{favorites.length} character{favorites.length !== 1 ? "s" : ""} saved</p>

      {favorites.length === 0 && (
        <p className="no-results">No favorites yet. Star a character from the character list!</p>
      )}

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading favorites...</p>
        </div>
      )}

      {error && <div className="error-banner">⚠ {error}</div>}

      {!loading && characters.length > 0 && (
        <div className="char-grid">
          {characters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
