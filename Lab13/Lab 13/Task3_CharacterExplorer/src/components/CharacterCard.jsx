import { Link } from "react-router-dom";

function CharacterCard({ character, isFavorite, onToggleFavorite }) {
  const statusColor = {
    Alive: "#2ea44f",
    Dead: "#f85149",
    unknown: "#8b949e",
  };

  return (
    <div className="char-card">
      <div className="char-img-wrap">
        <img src={character.image} alt={character.name} loading="lazy" />
        <button
          className={`btn-star ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(character.id)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      <div className="char-body">
        <h3>{character.name}</h3>
        <p className="char-meta">
          <span
            className="status-dot"
            style={{ background: statusColor[character.status] || "#8b949e" }}
          ></span>
          {character.status} · {character.species}
        </p>
        <p className="char-location">📍 {character.location.name}</p>
        <Link to={`/character/${character.id}`} className="btn-view">View Details</Link>
      </div>
    </div>
  );
}

export default CharacterCard;
