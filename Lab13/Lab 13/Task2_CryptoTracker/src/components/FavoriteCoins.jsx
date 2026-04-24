import { Link } from "react-router-dom";

function FavoriteCoins({ favorites }) {
  if (favorites.length === 0) {
    return <p className="no-results">No favorites yet.</p>;
  }
  return (
    <div className="fav-coins">
      {favorites.map((id) => (
        <Link key={id} to={`/coin/${id}`} className="fav-chip">
          ⭐ {id}
        </Link>
      ))}
    </div>
  );
}

export default FavoriteCoins;
