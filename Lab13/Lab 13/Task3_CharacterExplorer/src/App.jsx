import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import CharacterListPage from "./pages/CharacterListPage";
import CharacterDetail from "./pages/CharacterDetail";
import ClassesPage from "./pages/ClassesPage";
import FavoritesPage from "./pages/FavoritesPage";
import "./App.css";

function App() {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rm_favorites")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("rm_favorites", JSON.stringify(favorites));
  }, [favorites]);

  function handleToggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" className="nav-brand">🛸 Character Explorer</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Characters</NavLink>
          <NavLink to="/classes" className={({ isActive }) => isActive ? "active" : ""}>Species</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? "active" : ""}>
            Favorites {favorites.length > 0 && <span className="badge-count">{favorites.length}</span>}
          </NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CharacterListPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/character/:id" element={<CharacterDetail favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/favorites" element={<FavoritesPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
