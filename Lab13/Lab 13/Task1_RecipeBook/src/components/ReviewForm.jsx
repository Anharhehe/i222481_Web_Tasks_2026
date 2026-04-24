import { useState } from "react";

function ReviewForm({ onAddReview }) {
  const [user, setUser] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  function handleSubmit(e) {
    e.preventDefault();
    if (!user.trim() || !comment.trim()) return;
    onAddReview({ user: user.trim(), comment: comment.trim(), rating: Number(rating) });
    setUser("");
    setComment("");
    setRating(5);
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Add a Review</h4>
      <input
        type="text"
        placeholder="Your name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        required
      />
      <textarea
        placeholder="Your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <label>
        Rating:&nbsp;
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
}

export default ReviewForm;
