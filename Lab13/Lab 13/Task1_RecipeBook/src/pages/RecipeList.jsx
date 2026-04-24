import { useState, useEffect } from "react";
import { recipesData } from "../data/recipesData";
import RecipeCard from "../components/RecipeCard";
import SearchBar from "../components/SearchBar";
import CuisineFilter from "../components/CuisineFilter";
import DifficultyFilter from "../components/DifficultyFilter";

function RecipeList({ mealPlan, onToggleMealPlan }) {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Simulate loading with setTimeout
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRecipes(recipesData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const cuisines = [...new Set(recipesData.map((r) => r.cuisine))];

  const filtered = recipes
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      );
    })
    .filter((r) => (cuisine ? r.cuisine === cuisine : true))
    .filter((r) => (difficulty ? r.difficulty === difficulty : true))
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "prepTime") return a.prepTime - b.prepTime;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>All Recipes</h1>
      <div className="filters">
        <SearchBar value={search} onChange={setSearch} />
        <CuisineFilter cuisines={cuisines} selected={cuisine} onChange={setCuisine} />
        <DifficultyFilter selected={difficulty} onChange={setDifficulty} />
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Default</option>
            <option value="rating">Rating</option>
            <option value="prepTime">Prep Time</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="no-results">No recipes found.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isSaved={mealPlan.some((r) => r.id === recipe.id)}
              onToggleMealPlan={onToggleMealPlan}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
