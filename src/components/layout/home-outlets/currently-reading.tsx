import LibraryList from "./library-list";

const CurrentlyReading = () => (
  <LibraryList title="Currently Reading" filter={{ status: "reading" }} />
);

export default CurrentlyReading;
