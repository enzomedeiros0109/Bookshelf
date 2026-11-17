import LibraryList from "./library-list";

const Favorites = () => (
  <LibraryList title="Favorites" filter={{ favoritesOnly: true }} />
);

export default Favorites;
