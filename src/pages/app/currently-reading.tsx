import LibraryList from "@/components/books/library-list";

const CurrentlyReading = () => (
  <LibraryList title="Currently Reading" filter={{ status: "reading" }} />
);

export default CurrentlyReading;
