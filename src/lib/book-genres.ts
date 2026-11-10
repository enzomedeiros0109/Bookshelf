function getPathGenres(path: string) {
  return path
    .split("/")
    .map((genre) => genre.trim())
    .filter(Boolean);
}

export function getIndividualGenres(genrePaths: readonly string[] | null | undefined) {
  const genres = new Map<string, string>();

  for (const path of genrePaths ?? []) {
    for (const genre of getPathGenres(path)) {
      const key = genre.toLowerCase();
      if (!genres.has(key)) genres.set(key, genre);
    }
  }

  return [...genres.values()];
}

export function getMostFrequentGenre(genrePaths: readonly string[] | null | undefined) {
  const counts = new Map<string, { genre: string; count: number }>();

  for (const path of genrePaths ?? []) {
    const countedInPath = new Set<string>();

    for (const genre of getPathGenres(path)) {
      const key = genre.toLowerCase();
      if (countedInPath.has(key)) continue;
      countedInPath.add(key);

      const current = counts.get(key);
      if (current) {
        current.count += 1;
      } else {
        counts.set(key, { genre, count: 1 });
      }
    }
  }

  let mostFrequent: { genre: string; count: number } | undefined;
  for (const value of counts.values()) {
    if (!mostFrequent || value.count > mostFrequent.count) {
      mostFrequent = value;
    }
  }

  return mostFrequent?.genre ?? null;
}
