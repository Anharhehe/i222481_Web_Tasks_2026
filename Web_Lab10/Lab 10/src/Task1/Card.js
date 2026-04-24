import React from 'react';
import './AlienDecryption.css';

/**
 * Card Component
 * Props:
 *  - card: { id, signal, isFlipped, isMatched }
 *  - onClick: function
 */
function Card({ card, onClick }) {
  const handleClick = () => {
    if (!card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={`card${card.isFlipped || card.isMatched ? ' card--flipped' : ''}${card.isMatched ? ' card--matched' : ''}`}
      onClick={handleClick}
      role="button"
      aria-label={card.isFlipped || card.isMatched ? `Signal ${card.signal}` : 'Hidden signal'}
    >
      <div className="card__inner">
        <div className="card__back">&#63743;</div>
        <div className="card__front">{card.signal}</div>
      </div>
    </div>
  );
}

export default Card;
