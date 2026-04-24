import PriceCard from "./PriceCard";

function CryptoList({ coins, loading, prevPrices, favorites, onToggleFavorite, currency }) {
  if (loading) {
    return (
      <div className="crypto-grid">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-block circle"></div>
            <div className="skeleton-lines">
              <div className="skeleton-block line wide"></div>
              <div className="skeleton-block line"></div>
              <div className="skeleton-block line short"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (coins.length === 0) {
    return <p className="no-results">No coins found.</p>;
  }

  return (
    <div className="crypto-grid">
      {coins.map((coin) => (
        <PriceCard
          key={coin.id}
          coin={coin}
          prevPrice={prevPrices[coin.id]}
          isFavorite={favorites.includes(coin.id)}
          onToggleFavorite={onToggleFavorite}
          currency={currency}
        />
      ))}
    </div>
  );
}

export default CryptoList;
