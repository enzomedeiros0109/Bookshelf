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