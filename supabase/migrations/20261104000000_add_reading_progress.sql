BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_books'
      AND column_name = 'is_Favorite'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'user_books'
        AND column_name = 'is_favorite'
    ) THEN
      RAISE EXCEPTION 'Both is_Favorite and is_favorite exist on public.user_books';
    END IF;

    ALTER TABLE public.user_books
      RENAME COLUMN "is_Favorite" TO is_favorite;
  END IF;
END
$$;

ALTER TABLE public.user_books
  ADD COLUMN IF NOT EXISTS progress integer;

UPDATE public.user_books
SET progress = 0
WHERE progress IS NULL;

UPDATE public.user_books
SET is_favorite = false
WHERE is_favorite IS NULL;

ALTER TABLE public.user_books
  ALTER COLUMN progress SET DEFAULT 0,
  ALTER COLUMN progress SET NOT NULL,
  ALTER COLUMN status DROP NOT NULL,
  ALTER COLUMN is_favorite SET DEFAULT false,
  ALTER COLUMN is_favorite SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.user_books'::regclass
      AND conname = 'user_books_progress_range'
  ) THEN
    ALTER TABLE public.user_books
      ADD CONSTRAINT user_books_progress_range
      CHECK (progress BETWEEN 0 AND 100);
  END IF;
END
$$;

DROP POLICY IF EXISTS user_books_delete_own ON public.user_books;

CREATE POLICY user_books_delete_own
  ON public.user_books
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

COMMIT;
