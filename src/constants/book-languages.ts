export const bookLanguages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
] as const;

export type BookLanguage = (typeof bookLanguages)[number]["value"];

export function isBookLanguage(value: unknown): value is BookLanguage {
  return bookLanguages.some((language) => language.value === value);
}

export function getBookLanguage(value: unknown): BookLanguage {
  return isBookLanguage(value) ? value : "en";
}
