const languageNames = new Intl.DisplayNames(["en"], {
  type: "language",
  fallback: "none",
});

export function getLanguage(code: string | null | undefined): string {
  if (!code) return "Unknown";

  try {
    return languageNames.of(code) ?? "Unknown";
  } catch {
    return "Unknown";
  }
}

export function getInitials(name?: string | null): string {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join("");
}
