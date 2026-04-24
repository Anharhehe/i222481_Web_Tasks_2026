function Settings({ currency, onCurrencyChange, favorites }) {
  const currencies = ["usd", "eur", "gbp", "pkr"];

  return (
    <div className="page">
      <h1>Settings</h1>

      <div className="settings-card">
        <h2>Currency</h2>
        <p>Select your preferred display currency:</p>
        <div className="currency-options">
          {currencies.map((c) => (
            <button
              key={c}
              className={`btn-currency ${currency === c ? "active" : ""}`}
              onClick={() => onCurrencyChange(c)}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-card">
        <h2>Favorites</h2>
        {favorites.length === 0 ? (
          <p className="no-results">No favorite coins yet. Star a coin from the dashboard.</p>
        ) : (
          <ul className="fav-list">
            {favorites.map((id) => (
              <li key={id} className="fav-item">⭐ {id}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Settings;
