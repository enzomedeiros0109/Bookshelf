import LibraryList from "./library-list";

const WantToRead = () => (
  <LibraryList title="Want to Read" filter={{ status: "want_to_read" }} />
);

export default WantToRead;
