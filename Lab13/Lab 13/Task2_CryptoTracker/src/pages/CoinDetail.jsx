import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CoinDetail({ currency, favorites, onToggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch coin data");
        return res.json();
      })
      .then((data) => {
        setCoin(data);
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
        <div className="skeleton-block" style={{ width: "60px", height: "60px", borderRadius: "50%" }}></div>
        <div className="skeleton-block" style={{ width: "200px", height: "30px" }}></div>
        <div className="skeleton-block" style={{ width: "300px", height: "20px" }}></div>
        <div className="skeleton-block" style={{ width: "300px", height: "20px" }}></div>
      </div>
    );
  }

  if (error) return <div className="error-banner">⚠ {error}</div>;
  if (!coin) return null;

  const market = coin.market_data;
  const cur = currency;
  const isFav = favorites.includes(coin.id);

  const fmt = (n) =>
    n != null
      ? n.toLocaleString("en-US", { style: "currency", currency: cur.toUpperCase() })
      : "N/A";

  return (
    <div className="page coin-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>

      <div className="coin-detail-header">
        <img src={coin.image?.large} alt={coin.name} width="80" height="80" />
        <div>
          <h1>{coin.name} <span className="symbol">({coin.symbol?.toUpperCase()})</span></h1>
          <p className="rank">Market Cap Rank: #{coin.market_cap_rank}</p>
          <button
            className={`btn-fav ${isFav ? "active" : ""}`}
            onClick={() => onToggleFavorite(coin.id)}
          >
            {isFav ? "★ Remove Favorite" : "☆ Add to Favorites"}
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Current Price</h3>
          <p className="big-price">{fmt(market?.current_price?.[cur])}</p>
        </div>
        <div className="detail-card">
          <h3>24h Change</h3>
          <p className={`change ${market?.price_change_percentage_24h >= 0 ? "up" : "down"}`}>
            {market?.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>
        <div className="detail-card">
          <h3>24h High</h3>
          <p>{fmt(market?.high_24h?.[cur])}</p>
        </div>
        <div className="detail-card">
          <h3>24h Low</h3>
          <p>{fmt(market?.low_24h?.[cur])}</p>
        </div>
        <div className="detail-card">
          <h3>All-Time High</h3>
          <p>{fmt(market?.ath?.[cur])}</p>
        </div>
        <div className="detail-card">
          <h3>All-Time Low</h3>
          <p>{fmt(market?.atl?.[cur])}</p>
        </div>
        <div className="detail-card">
          <h3>Market Cap</h3>
          <p>{fmt(market?.market_cap?.[cur])}</p>
        </div>
        <div className="detail-card">
          <h3>Circulating Supply</h3>
          <p>{market?.circulating_supply?.toLocaleString() ?? "N/A"}</p>
        </div>
        <div className="detail-card">
          <h3>Total Supply</h3>
          <p>{market?.total_supply?.toLocaleString() ?? "N/A"}</p>
        </div>
      </div>

      {coin.description?.en && (
        <div className="description-box">
          <h2>About {coin.name}</h2>
          <p dangerouslySetInnerHTML={{ __html: coin.description.en.split(". ").slice(0, 4).join(". ") + "." }} />
        </div>
      )}
    </div>
  );
}

export default CoinDetail;
