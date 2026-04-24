import { useState, useEffect, useRef } from "react";
import CryptoList from "../components/CryptoList";
import SearchBar from "../components/SearchBar";

const BASE_URL = "https://api.coingecko.com/api/v3/coins/markets";

function Dashboard({ favorites, onToggleFavorite, currency }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("market_cap");
  const [prevPrices, setPrevPrices] = useState({});
  const intervalRef = useRef(null);

  async function fetchCoins() {
    try {
      const res = await fetch(
        `${BASE_URL}?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
      );
      if (!res.ok) throw new Error("API error – rate limited or network issue");
      const data = await res.json();
      setCoins((prev) => {
        const map = {};
        prev.forEach((c) => (map[c.id] = c.current_price));
        setPrevPrices(map);
        return data;
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchCoins();
  }, [currency]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    intervalRef.current = setInterval(fetchCoins, 60000);
    return () => clearInterval(intervalRef.current);
  }, [currency]);

  const filtered = coins
    .filter((c) => {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "price") return b.current_price - a.current_price;
      if (sortBy === "change") return b.price_change_percentage_24h - a.price_change_percentage_24h;
      return b.market_cap - a.market_cap;
    });

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Crypto Dashboard</h1>
        <p className="subtitle">Live prices in {currency.toUpperCase()} · auto-refreshes every 60s</p>
      </div>

      <div className="filters">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or symbol..." />
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap">Market Cap</option>
            <option value="price">Price</option>
            <option value="change">24h Change</option>
          </select>
        </div>
        <button className="btn-refresh" onClick={fetchCoins}>⟳ Refresh</button>
      </div>

      {error && <div className="error-banner">⚠ {error}</div>}

      <CryptoList
        coins={filtered}
        loading={loading}
        prevPrices={prevPrices}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        currency={currency}
      />
    </div>
  );
}

export default Dashboard;
