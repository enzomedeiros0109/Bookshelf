BEGIN;

ALTER TABLE public.user_books
  ADD COLUMN completed_at timestamptz,
  ADD CONSTRAINT user_books_completed_at_requires_read
    CHECK (completed_at IS NULL OR status = 'read');

CREATE INDEX user_books_reading_goal_lookup_idx
  ON public.user_books (user_id, completed_at)
  WHERE status = 'read';

CREATE TABLE public.user_reading_goals (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_year integer NOT NULL,
  goal_books integer NOT NULL DEFAULT 0 CHECK (goal_books >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, goal_year)
);

ALTER TABLE public.user_reading_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_reading_goals_select_own
  ON public.user_reading_goals
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY user_reading_goals_insert_own
  ON public.user_reading_goals
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY user_reading_goals_update_own
  ON public.user_reading_goals
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

GRANT SELECT, INSERT, UPDATE
  ON public.user_reading_goals
  TO authenticated;

COMMIT;
