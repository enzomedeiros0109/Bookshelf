import SortBy from "@/components/layout/sort-by";

type Props = {
  title: string;
  count: number;
  isLoading?: boolean;
};

const OutletHeader = ({ title, count, isLoading = false }: Props) => {
  const bookCount = `${count} ${count === 1 ? "Book" : "Books"}`;

  return (
    <div className="flex items-end justify-between">
      <div className="flex gap-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg self-end text-muted-foreground">
          {isLoading ? "Loading" : bookCount}
        </p>
      </div>
      <SortBy />
    </div>
  );
};

export default OutletHeader;
