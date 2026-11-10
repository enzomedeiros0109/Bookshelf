import { Pencil } from "lucide-react";

type Props = {
  year: number;
  displayedBooksRead: number | string;
  displayedGoalBooks: number | string;
  progressPercent: number;
  progressMessage: string;
  hasError: boolean;
  isLoading: boolean;
  onEditGoal: () => void;
};

const AppSideBarFooter = ({
  year,
  displayedBooksRead,
  displayedGoalBooks,
  progressPercent,
  progressMessage,
  hasError,
  isLoading,
  onEditGoal,
}: Props) => {
  return (
    <div className="flex flex-col gap-2 border-t p-2 font-bold">
      <div className="flex justify-between">
        <h2 className="text-sm font-sans text-white brightness-60">READING GOAL</h2>
        <button
          type="button"
          aria-label="Edit reading goal"
          disabled={isLoading}
          onClick={onEditGoal}
          className="cursor-pointer rounded-sm p-1 hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Pencil className="size-4 shrink-0" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold">{displayedBooksRead}</p>
          <p className="text-xl">/</p>
          <p className="text-base text-white brightness-50">{displayedGoalBooks} books</p>
        </div>
        <p className="text-white brightness-60">{year}</p>
      </div>
      <div
        role="progressbar"
        aria-label={`${year} reading goal progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        className="h-2 w-full overflow-hidden rounded-full bg-accent/20"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p
        role={hasError ? "alert" : undefined}
        className={`text-sm ${hasError ? "text-destructive" : "text-white brightness-60"}`}
      >
        {progressMessage}
      </p>
    </div>
  );
};

export default AppSideBarFooter;
