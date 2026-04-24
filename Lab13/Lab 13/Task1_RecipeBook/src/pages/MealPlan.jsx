import { Link } from "react-router-dom";

function MealPlan({ mealPlan, onToggleMealPlan }) {
  if (mealPlan.length === 0) {
    return (
      <div className="page">
        <h1>Weekly Meal Plan</h1>
        <p className="no-results">No recipes saved yet. <Link to="/recipes">Browse recipes</Link> to add some!</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Weekly Meal Plan</h1>
      <p>{mealPlan.length} recipe{mealPlan.length !== 1 ? "s" : ""} saved</p>
      <div className="meal-plan-list">
        {mealPlan.map((recipe) => (
          <div key={recipe.id} className="meal-plan-item">
            <img src={recipe.image} alt={recipe.name} />
            <div className="meal-info">
              <h3>{recipe.name}</h3>
              <p>{recipe.cuisine} · ⏱ {recipe.prepTime} min · ⭐ {recipe.rating}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <Link to={`/recipes/${recipe.id}`} className="btn-view">View</Link>
                <button
                  className="btn-meal saved"
                  onClick={() => onToggleMealPlan(recipe)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MealPlan;
