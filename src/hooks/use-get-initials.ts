export function getInitials(name?: string | null): string {
    if (!name?.trim()) return '?';

    return name
      .trim()
      .split(/\s+/)
      .map(word => word[0].toUpperCase())
      .join('');
  }