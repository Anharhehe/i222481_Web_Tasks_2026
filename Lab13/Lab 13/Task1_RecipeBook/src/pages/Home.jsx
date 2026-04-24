import { Link } from "react-router-dom";
import { recipesData } from "../data/recipesData";
import RecipeCard from "../components/RecipeCard";

function Home({ mealPlan, onToggleMealPlan }) {
  const featured = recipesData.filter((r) => r.rating >= 4.6);

  return (
    <div className="page home">
      <div className="hero">
        <h1>🍽 Welcome to Recipe Book</h1>
        <p>Discover delicious recipes from around the world. Save your favourites to your weekly meal plan.</p>
        <Link to="/recipes" className="btn-view hero-btn">Browse All Recipes</Link>
      </div>

      <h2>Featured Recipes</h2>
      <div className="recipe-grid">
        {featured.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isSaved={mealPlan.some((r) => r.id === recipe.id)}
            onToggleMealPlan={onToggleMealPlan}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
