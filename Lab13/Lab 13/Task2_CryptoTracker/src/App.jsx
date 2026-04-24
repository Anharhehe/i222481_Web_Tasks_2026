import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CoinDetail from "./pages/CoinDetail";
import Settings from "./pages/Settings";
import FavoriteCoins from "./components/FavoriteCoins";
import "./App.css";

function App() {
  const [currency, setCurrency] = useState(() => localStorage.getItem("crypto_currency") || "usd");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("crypto_favorites")) || []; }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem("crypto_currency", currency); }, [currency]);
  useEffect(() => { localStorage.setItem("crypto_favorites", JSON.stringify(favorites)); }, [favorites]);

  function handleToggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" className="nav-brand">₿ CryptoTracker</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
            Settings {favorites.length > 0 && <span className="badge-count">{favorites.length} ★</span>}
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard favorites={favorites} onToggleFavorite={handleToggleFavorite} currency={currency} />} />
          <Route path="/coin/:id" element={<CoinDetail currency={currency} favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/settings" element={<Settings currency={currency} onCurrencyChange={setCurrency} favorites={favorites} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
