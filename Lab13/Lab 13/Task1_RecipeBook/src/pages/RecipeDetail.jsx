import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recipesData } from "../data/recipesData";
import ReviewForm from "../components/ReviewForm";

function RecipeDetail({ mealPlan, onToggleMealPlan }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const found = recipesData.find((r) => r.id === Number(id));
      if (!found) {
        navigate("/recipes", { replace: true });
        return;
      }
      setRecipe(found);
      setReviews(found.reviews);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [id, navigate]);

  function handleAddReview(newReview) {
    const review = { id: Date.now(), ...newReview };
    setReviews((prev) => [...prev, review]);
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  const isSaved = mealPlan.some((r) => r.id === recipe.id);

  return (
    <div className="page recipe-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-header">
        <img src={recipe.image} alt={recipe.name} />
        <div>
          <h1>{recipe.name}</h1>
          <p className="cuisine">{recipe.cuisine}</p>
          <p>{recipe.description}</p>
          <div className="card-meta">
            <span className="badge time">⏱ {recipe.prepTime} min</span>
            <span className={`badge difficulty ${recipe.difficulty.toLowerCase()}`}>
              {recipe.difficulty}
            </span>
            <span className="badge rating">⭐ {recipe.rating}</span>
            {recipe.vegetarian && <span className="badge vegetarian">🌿 Veg</span>}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
            <button
              className={`btn-meal ${isSaved ? "saved" : ""}`}
              onClick={() => onToggleMealPlan(recipe)}
            >
              {isSaved ? "✓ Remove from Meal Plan" : "+ Add to Meal Plan"}
            </button>
            <button className="btn-print" onClick={() => window.print()}>
              🖨 Print Recipe
            </button>
          </div>
        </div>
      </div>

      <div className="detail-sections">
        <section>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Instructions</h2>
          <ol>
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <section className="reviews-section">
        <h2>Reviews ({reviews.length})</h2>
        {reviews.map((rev) => (
          <div key={rev.id} className="review-item">
            <strong>{rev.user}</strong>
            <span className="review-rating"> ⭐ {rev.rating}</span>
            <p>{rev.comment}</p>
          </div>
        ))}
        <ReviewForm onAddReview={handleAddReview} />
      </section>
    </div>
  );
}

export default RecipeDetail;
