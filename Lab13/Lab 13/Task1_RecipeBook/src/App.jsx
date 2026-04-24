import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import MealPlan from "./pages/MealPlan";
import "./App.css";

function App() {
  const [mealPlan, setMealPlan] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mealPlan")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  function handleToggleMealPlan(recipe) {
    setMealPlan((prev) =>
      prev.some((r) => r.id === recipe.id)
        ? prev.filter((r) => r.id !== recipe.id)
        : [...prev, recipe]
    );
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" className="nav-brand">🍽 Recipe Book</NavLink>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/recipes" className={({ isActive }) => isActive ? "active" : ""}>Recipes</NavLink>
          <NavLink to="/meal-plan" className={({ isActive }) => isActive ? "active" : ""}>
            Meal Plan {mealPlan.length > 0 && <span className="badge-count">{mealPlan.length}</span>}
          </NavLink>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home mealPlan={mealPlan} onToggleMealPlan={handleToggleMealPlan} />} />
          <Route path="/recipes" element={<RecipeList mealPlan={mealPlan} onToggleMealPlan={handleToggleMealPlan} />} />
          <Route path="/recipes/:id" element={<RecipeDetail mealPlan={mealPlan} onToggleMealPlan={handleToggleMealPlan} />} />
          <Route path="/meal-plan" element={<MealPlan mealPlan={mealPlan} onToggleMealPlan={handleToggleMealPlan} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
