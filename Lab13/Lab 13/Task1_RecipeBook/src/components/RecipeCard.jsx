import { Link } from "react-router-dom";

function RecipeCard({ recipe, onToggleMealPlan, isSaved }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} />
      <div className="card-body">
        <h3>{recipe.name}</h3>
        <p className="cuisine">{recipe.cuisine}</p>
        <p className="description">{recipe.description}</p>
        <div className="card-meta">
          <span className="badge time">⏱ {recipe.prepTime} min</span>
          <span className={`badge difficulty ${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
          <span className="badge rating">⭐ {recipe.rating}</span>
          {recipe.vegetarian && <span className="badge vegetarian">🌿 Veg</span>}
        </div>
        <div className="card-actions">
          <Link to={`/recipes/${recipe.id}`} className="btn-view">View Recipe</Link>
          <button
            className={`btn-meal ${isSaved ? "saved" : ""}`}
            onClick={() => onToggleMealPlan(recipe)}
          >
            {isSaved ? "✓ In Meal Plan" : "+ Meal Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
