import LibraryList from "@/components/books/library-list";

const Favorites = () => (
  <LibraryList title="Favorites" filter={{ favoritesOnly: true }} />
);

export default Favorites;
