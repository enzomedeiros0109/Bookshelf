import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays } from "lucide-react";
import { getReadingStatsBooks, getReadingStatsYears } from "@/api/supabase";
import { useAuthContext } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const genreColors = ["#e8873f", "#8da77d", "#82a5c4", "#bd98c9", "#f3e1c9", "#c47b57"];
const monthNames = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat(undefined, { month: "long" }).format(new Date(2024, month, 1)),
);

function normalizeCategory(mainCategory: string | null) {
  const parts = (mainCategory ?? "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1 && parts[0].toLowerCase() === "fiction") {
    parts.shift();
  }

  return parts.join(" / ") || "Unclassified";
}

const Charts = () => {
  const { user } = useAuthContext();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const yearsQuery = useQuery({
    queryKey: ["reading-stats-years", user?.id],
    queryFn: getReadingStatsYears,
    enabled: Boolean(user?.id),
  });
  const booksQuery = useQuery({
    queryKey: ["reading-stats-books", user?.id, selectedYear],
    queryFn: () => getReadingStatsBooks(selectedYear),
    enabled: Boolean(user?.id),
  });

  const availableYears = useMemo(() => {
    const years = new Set<number>([currentYear]);
    for (const readingYear of yearsQuery.data ?? []) {
      if (!readingYear.completedAt) continue;
      const date = new Date(readingYear.completedAt);
      if (!Number.isNaN(date.getTime())) years.add(date.getFullYear());
    }
    return [...years].sort((left, right) => right - left);
  }, [yearsQuery.data, currentYear]);

  const completedBooks = booksQuery.data ?? [];
  const undatedBooksCount = (yearsQuery.data ?? []).filter((book) => !book.completedAt).length;
  const isStatsLoading = yearsQuery.isLoading || booksQuery.isLoading;
  const statsError = yearsQuery.error ?? booksQuery.error;
  const hasStatsError = yearsQuery.isError || booksQuery.isError;

  const monthlyData = useMemo(() => {
    const monthlyCounts = Array.from({ length: 12 }, (_, month) => ({
      month: monthNames[month],
      monthLabel: monthNames[month].slice(0, 3),
      books: 0,
    }));

    for (const book of completedBooks) {
      if (!book.completedAt) continue;
      const month = new Date(book.completedAt).getMonth();
      monthlyCounts[month].books += 1;
    }

    return monthlyCounts;
  }, [completedBooks]);

  const genreData = useMemo(() => {
    const counts = new Map<string, number>();
    for (const book of completedBooks) {
      const category = normalizeCategory(book.mainCategory);
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }

    const unclassifiedCount = counts.get("Unclassified") ?? 0;
    const otherCount = counts.get("Other") ?? 0;
    const rankedCategories = [...counts.entries()]
      .filter(([name]) => name !== "Unclassified" && name !== "Other")
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
    const topCategories = rankedCategories.slice(0, 4);
    const remainderCount = rankedCategories.slice(4).reduce((total, [, count]) => total + count, otherCount);
    const slices = topCategories.map(([name, books], index) => ({
      name,
      books,
      color: genreColors[index],
    }));

    if (remainderCount > 0) {
      slices.push({ name: "Other", books: remainderCount, color: genreColors[4] });
    }
    if (unclassifiedCount > 0) {
      slices.push({ name: "Unclassified", books: unclassifiedCount, color: genreColors[5] });
    }

    const total = slices.reduce((sum, slice) => sum + slice.books, 0);
    return slices.map((slice) => ({
      ...slice,
      percent: total > 0 ? Math.round((slice.books / total) * 100) : 0,
    }));
  }, [completedBooks]);

  const chartConfig = {
    books: { label: "Books", color: "#e8873f" },
  };

  return (
    <div className="flex min-h-full flex-col gap-5 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Your Reading Stats</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Discover your reading habits at a glance.
          </p>
        </div>
        <Select
          value={String(selectedYear)}
          onValueChange={(value) => {
            if (value) setSelectedYear(Number(value));
          }}
        >
          <SelectTrigger aria-label="Select year" className="min-w-24">
            <CalendarDays aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {availableYears.map((year) => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </header>

      {hasStatsError && (
        <p role="alert" className="text-sm text-destructive">
          {statsError instanceof Error ? statsError.message : "Could not load reading statistics."}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-xl border border-[#eadbc9] bg-background shadow-none ring-0">
          <CardHeader>
            <CardTitle className="text-lg">Genres Read</CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Loading reading data...</div>
            ) : hasStatsError ? (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Reading data is unavailable.</div>
            ) : genreData.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-center text-sm text-muted-foreground">
                No books marked Read in {selectedYear}.
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <ChartContainer config={chartConfig} className="h-64 min-w-0 flex-1">
                  <PieChart accessibilityLayer>
                    <Pie data={genreData} dataKey="books" nameKey="name" cx="50%" cy="50%" outerRadius="82%" stroke="var(--background)" strokeWidth={2}>
                      {genreData.map((slice) => (
                        <Cell key={slice.name} fill={slice.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ChartContainer>
                <ul className="grid w-full grid-cols-1 gap-2 sm:w-40">
                  {genreData.map((slice) => (
                    <li key={slice.name} className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex min-w-0 items-center gap-2">
                        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                        <span className="truncate">{slice.name}</span>
                      </span>
                      <span className="shrink-0 tabular-nums">{slice.percent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[#eadbc9] bg-background shadow-none ring-0">
          <CardHeader>
            <CardTitle className="text-lg">Books Read by Month</CardTitle>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Loading reading data...</div>
            ) : hasStatsError ? (
              <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">Reading data is unavailable.</div>
            ) : completedBooks.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-center text-sm text-muted-foreground">
                No books completed in {selectedYear}.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={monthlyData} margin={{ top: 16, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="monthLabel" tickLine={false} axisLine stroke="var(--border)" tick={{ fontSize: 10, fill: "var(--foreground)" }} interval={0} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--foreground)" }} />
                  <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.month ?? ""} />
                  <Bar dataKey="books" fill="var(--color-books)" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    <LabelList dataKey="books" position="top" fill="var(--foreground)" fontSize={11} />
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {undatedBooksCount > 0 && !isStatsLoading && !hasStatsError && (
        <p className="text-xs text-muted-foreground">
          {undatedBooksCount} read {undatedBooksCount === 1 ? "book has" : "books have"} no completion date and {undatedBooksCount === 1 ? "is" : "are"} excluded from yearly charts.
        </p>
      )}
    </div>
  );
};

export default Charts;
