import { useState, type FormEvent } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "./logo"

type Props = {
   year: number;
   goalBooks: number;
   isSaving: boolean;
   saveError: string | null;
   onClose: () => void;
   onSave: (goalBooks: number) => void;
};

const ReadingGoalDialog = ({ year, goalBooks, isSaving, saveError, onClose, onSave }: Props) => {
   const [goalInput, setGoalInput] = useState(String(goalBooks))
   const [goalInputError, setGoalInputError] = useState<string | null>(null)

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const goalValue = Number(goalInput)

      if (goalInput.trim() === "" || !Number.isInteger(goalValue) || goalValue < 0) {
         setGoalInputError("Enter a non-negative whole number.")
         return
      }

      setGoalInputError(null)
      onSave(goalValue)
   }

   return (
      <div
         role="dialog"
         aria-labelledby="reading-goal-title"
         aria-describedby="reading-goal-description"
         onKeyDown={(event) => {
            if (event.key === "Escape") onClose()
         }}
         className="absolute bottom-full left-2 z-50 mb-2 w-[calc(100%-1rem)] rounded-2xl border border-border bg-background p-4 text-foreground shadow-lg"
      >
         <div className="mb-4 flex items-center justify-between gap-2">
            <Logo iconsize="size-4" textsize="text-xl" />
            <button
               type="button"
               aria-label="Close reading goal dialog"
               onClick={onClose}
               className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
               <X className="size-5" />
            </button>
         </div>
         <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
               <h2 id="reading-goal-title" className="font-heading text-2xl font-semibold tracking-tight">
                  Set your reading goal
               </h2>
               <p id="reading-goal-description" className="text-sm text-muted-foreground">
                  Choose how many books you want to read in {year}.
               </p>
            </div>
            <div className="space-y-2">
               <Label htmlFor="reading-goal" className="text-sm font-medium">
                  Books this year
               </Label>
               <Input
                  id="reading-goal"
                  type="number"
                  min={0}
                  step={1}
                  value={goalInput}
                  onChange={(event) => {
                     setGoalInput(event.target.value)
                     setGoalInputError(null)
                  }}
                  disabled={isSaving}
                  className="h-10 rounded-xl px-3 text-lg"
               />
            </div>
            {(goalInputError || saveError) && (
               <p role="alert" className="text-sm text-destructive">
                  {goalInputError ?? saveError}
               </p>
            )}
            <div className="flex justify-end gap-2 pt-1">
               <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={onClose}
                  className="h-9 cursor-pointer border-border px-3 text-sm text-accent hover:bg-accent/10 hover:text-accent"
               >
                  Cancel
               </Button>
               <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-9 cursor-pointer bg-accent px-3 text-sm text-accent-foreground hover:bg-accent/90"
               >
                  {isSaving ? "Saving..." : "Save goal"}
               </Button>
            </div>
         </form>
      </div>
   )
}

export default ReadingGoalDialog
