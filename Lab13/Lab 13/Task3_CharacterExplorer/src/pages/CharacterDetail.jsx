import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CharacterDetail({ favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch character details
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://rickandmortyapi.com/api/character/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Character not found");
        return res.json();
      })
      .then((data) => {
        setCharacter(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading character...</p>
      </div>
    );
  }

  if (error) return <div className="error-banner">⚠ {error}</div>;
  if (!character) return null;

  const statusColor = { Alive: "#2ea44f", Dead: "#f85149", unknown: "#8b949e" };
  const isFav = favorites.includes(character.id);

  return (
    <div className="page char-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-hero">
        <img src={character.image} alt={character.name} />
        <div className="detail-info">
          <h1>{character.name}</h1>
          <p className="char-meta" style={{ fontSize: "1rem" }}>
            <span
              className="status-dot"
              style={{ background: statusColor[character.status] || "#8b949e" }}
            ></span>
            {character.status} · {character.species}
          </p>
          {character.type && <p className="sub-text">Type: {character.type}</p>}
          <p className="sub-text">Gender: {character.gender}</p>
          <p className="sub-text">Origin: {character.origin.name}</p>
          <p className="sub-text">Last known location: {character.location.name}</p>
          <p className="sub-text">Episodes appeared in: {character.episode.length}</p>
          <button
            className={`btn-fav ${isFav ? "active" : ""}`}
            onClick={() => onToggleFavorite(character.id)}
          >
            {isFav ? "★ Remove from Favorites" : "☆ Add to Favorites"}
          </button>
        </div>
      </div>

      <div className="episodes-section">
        <h2>Episodes ({character.episode.length})</h2>
        <div className="episode-chips">
          {character.episode.map((ep) => {
            const num = ep.split("/").pop();
            return (
              <span key={ep} className="ep-chip">Ep {num}</span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CharacterDetail;
