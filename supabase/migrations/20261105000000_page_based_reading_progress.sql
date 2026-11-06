BEGIN;

ALTER TABLE public.user_books
  RENAME COLUMN progress TO pages_read;

UPDATE public.user_books
SET pages_read = 0;

ALTER TABLE public.user_books
  DROP CONSTRAINT IF EXISTS user_books_progress_range;

ALTER TABLE public.user_books
  ADD COLUMN total_pages integer,
  ADD CONSTRAINT user_books_pages_read_nonnegative
    CHECK (pages_read >= 0),
  ADD CONSTRAINT user_books_total_pages_positive
    CHECK (total_pages IS NULL OR total_pages > 0),
  ADD CONSTRAINT user_books_pages_read_within_total
    CHECK (
      (total_pages IS NULL AND pages_read = 0)
      OR (total_pages IS NOT NULL AND pages_read <= total_pages)
    );

COMMIT;
