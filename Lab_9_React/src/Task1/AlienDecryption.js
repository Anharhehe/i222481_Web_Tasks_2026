import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import './AlienDecryption.css';

// 8 pairs of alien signals (symbols + text labels)
const SIGNAL_SYMBOLS = ['👽', '🛸', '🌌', '⚡', '🔮', '🌀', '💫', '🪐'];

function buildShuffledDeck() {
  // Duplicate each signal to form 8 pairs → 16 cards
  const paired = [...SIGNAL_SYMBOLS, ...SIGNAL_SYMBOLS];

  // Fisher-Yates shuffle
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }

  return paired.map((signal, index) => ({
    id: index,
    signal,
    isFlipped: false,
    isMatched: false,
  }));
}

function AlienDecryption() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // prevent >2 flips

  // Initialise deck
  const initGame = useCallback(() => {
    setCards(buildShuffledDeck());
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setTime(0);
    setTimerActive(false);
    setGameOver(false);
    setIsLocked(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer — starts on first flip, stops on game over
  useEffect(() => {
    if (!timerActive || gameOver) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, gameOver]);

  // Compare flipped cards
  useEffect(() => {
    if (flippedCards.length !== 2) return;

    const [first, second] = flippedCards;

    if (first.signal === second.signal) {
      // MATCH
      const newMatched = [...matchedCards, first.id, second.id];
      setMatchedCards(newMatched);
      setScore((prev) => prev + 100);
      setCards((prev) =>
        prev.map((c) =>
          c.id === first.id || c.id === second.id ? { ...c, isMatched: true } : c
        )
      );
      setFlippedCards([]);

      // Check completion
      if (newMatched.length === SIGNAL_SYMBOLS.length * 2) {
        setTimerActive(false);
        setGameOver(true);
      }
    } else {
      // MISMATCH — hide after 1 second (useEffect / setTimeout)
      setIsLocked(true);
      const timeout = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
          )
        );
        setScore((prev) => Math.max(0, prev - 10));
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [flippedCards]); // intentionally omit matchedCards to avoid re-run loop

  const handleCardClick = (cardId) => {
    if (isLocked || flippedCards.length >= 2) return;

    // Start timer on first card click
    if (!timerActive && matchedCards.length === 0 && flippedCards.length === 0) {
      setTimerActive(true);
    }

    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards((prev) => [...prev, clickedCard]);
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const timeBonus = gameOver ? Math.max(0, 500 - time * 5) : 0;
  const finalScore = gameOver ? score + timeBonus : score;

  return (
    <div className="alien-wrap">
      <div className="alien-header">
        <h2 className="alien-title">&#128125; Alien Signal Decryption Interface</h2>
        <p className="alien-subtitle">
          Reveal and match identical alien signals to decrypt the transmission.
        </p>
      </div>

      {/* HUD */}
      <div className="alien-hud">
        <div className="hud-item">
          <span className="hud-label">&#9203; Time</span>
          <span className="hud-value">{formatTime(time)}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">&#11088; Score</span>
          <span className="hud-value">{score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">&#128279; Matched</span>
          <span className="hud-value">
            {matchedCards.length / 2} / {SIGNAL_SYMBOLS.length}
          </span>
        </div>
        <button className="btn-reset" onClick={initGame}>
          &#8635; New Game
        </button>
      </div>

      {/* Game Over Banner */}
      {gameOver && (
        <div className="game-over-banner">
          <h3>&#127881; Decryption Complete!</h3>
          <div className="score-breakdown">
            <span>Match Score: <strong>{score - timeBonus > 0 ? score - timeBonus : 0}</strong></span>
            <span>Time Bonus: <strong>+{timeBonus}</strong></span>
            <span>Completion Time: <strong>{formatTime(time)}</strong></span>
            <span className="final-score">Final Score: <strong>{finalScore}</strong></span>
          </div>
          <button className="btn-reset btn-reset--large" onClick={initGame}>
            Play Again
          </button>
        </div>
      )}

      {/* 4×4 Card Grid */}
      <div className="card-grid">
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default AlienDecryption;
