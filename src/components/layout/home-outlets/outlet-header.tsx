import SortBy from "../sort-by";

type Props = {
  title: string;
  count: number;
  isLoading?: boolean;
};

const OutletHeader = ({ title, count, isLoading = false }: Props) => {
  const bookCount = `${count} ${count === 1 ? "Book" : "Books"}`;

  return (
    <div className="flex items-end justify-between">
      <div className="flex items-end gap-4">
        <h1 className="text-start text-4xl font-bold">{title}</h1>
        <p className="text-base text-muted-foreground">
          {isLoading ? "Loading" : bookCount}
        </p>
      </div>
      <SortBy />
    </div>
  );
};

export default OutletHeader;
