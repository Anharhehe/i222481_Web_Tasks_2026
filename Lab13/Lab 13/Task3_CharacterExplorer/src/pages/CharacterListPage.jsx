import CharacterList from "../components/CharacterList";

function CharacterListPage({ favorites, onToggleFavorite }) {
  return (
    <div className="page">
      <h1>Rick &amp; Morty Characters</h1>
      <p className="subtitle">Explore all characters from the Rick and Morty universe</p>
      <CharacterList favorites={favorites} onToggleFavorite={onToggleFavorite} />
    </div>
  );
}

export default CharacterListPage;
