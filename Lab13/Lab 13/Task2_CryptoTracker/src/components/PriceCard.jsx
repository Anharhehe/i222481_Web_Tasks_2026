import { Link } from "react-router-dom";

function PriceCard({ coin, prevPrice, isFavorite, onToggleFavorite, currency }) {
  const priceUp = prevPrice != null && coin.current_price > prevPrice;
  const priceDown = prevPrice != null && coin.current_price < prevPrice;
  const changeUp = coin.price_change_percentage_24h >= 0;

  const fmtPrice = (n) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    });

  return (
    <div className={`price-card ${priceUp ? "flash-up" : ""} ${priceDown ? "flash-down" : ""}`}>
      <div className="card-top">
        <img src={coin.image} alt={coin.name} width="40" height="40" />
        <div className="coin-name">
          <strong>{coin.name}</strong>
          <span className="symbol">{coin.symbol.toUpperCase()}</span>
        </div>
        <button
          className={`btn-star ${isFavorite ? "active" : ""}`}
          onClick={() => onToggleFavorite(coin.id)}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="card-price">
        <span className="price">{fmtPrice(coin.current_price)}</span>
        <span className={`change-badge ${changeUp ? "up" : "down"}`}>
          {changeUp ? "▲" : "▼"} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </span>
      </div>

      <div className="card-stats">
        <span>Market Cap: #{coin.market_cap_rank}</span>
        <span>Vol: {(coin.total_volume / 1e9).toFixed(2)}B</span>
      </div>

      <Link to={`/coin/${coin.id}`} className="btn-detail">View Details →</Link>
    </div>
  );
}

export default PriceCard;
