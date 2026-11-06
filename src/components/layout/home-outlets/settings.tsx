import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Globe, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/auth-context";
import { bookLanguages, getBookLanguage, isBookLanguage } from "@/constants/book-languages";
import { supabase } from "@/lib/supabase-client";
import { emailSchema, type EmailSchema } from "@/schemas/email-schema";
import { displayNameSchema, type DisplayNameFields } from "@/schemas/settings-schema";

const nameChangeLimitQueryKey = (userId: string | undefined) => [
  "name-change-limit",
  userId,
];

const Settings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const currentDisplayName = String(
    user?.user_metadata?.display_name ?? user?.user_metadata?.full_name ?? "",
  );
  const preferredLanguage = getBookLanguage(
    user?.user_metadata?.preferred_language,
  );
  const [selectedLanguage, setSelectedLanguage] = useState(preferredLanguage);
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [now, setNow] = useState(Date.now());

  const nameChangeLimitQuery = useQuery({
    queryKey: nameChangeLimitQueryKey(user?.id),
    queryFn: async () => {
      if (!user?.id) throw new Error("User is not logged in");

      const { data, error } = await supabase
        .from("user_name_change_limits")
        .select("last_changed_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      return data?.last_changed_at ?? null;
    },
    enabled: Boolean(user?.id),
  });

  const nameForm = useForm<DisplayNameFields>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { displayName: currentDisplayName },
  });
  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    reset: resetNameForm,
    watch: watchName,
    clearErrors: clearNameErrors,
    setError: setNameError,
    formState: { errors: nameErrors, isSubmitting: isSavingName },
  } = nameForm;

  const passwordForm = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: user?.email ?? "" },
  });
  const {
    register: registerPasswordEmail,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    setError: setPasswordError,
    formState: { errors: passwordErrors, isSubmitting: isSendingPasswordEmail },
  } = passwordForm;

  useEffect(() => {
    resetNameForm({ displayName: currentDisplayName });
  }, [currentDisplayName, resetNameForm]);

  useEffect(() => {
    setSelectedLanguage(preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    resetPasswordForm({ email: user?.email ?? "" });
  }, [resetPasswordForm, user?.email]);

  useEffect(() => {
    if (!nameChangeLimitQuery.data) return;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [nameChangeLimitQuery.data]);

  const lastNameChangedAt = nameChangeLimitQuery.data;
  const nameAvailableAt = lastNameChangedAt
    ? Date.parse(lastNameChangedAt) + 24 * 60 * 60 * 1000
    : null;
  const cooldownRemainingMs = nameAvailableAt
    ? Math.max(0, nameAvailableAt - now)
    : 0;
  const isNameCooldownActive = cooldownRemainingMs > 0;
  const watchedName = watchName("displayName").trim();
  const isNameUnchanged = watchedName === currentDisplayName.trim();

  const onSaveName: SubmitHandler<DisplayNameFields> = async ({ displayName }) => {
    if (!user) return;

    clearNameErrors("root");
    setNameSaved(false);
    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        full_name: displayName,
      },
    });

    if (error) {
      setNameError("root", { type: "server", message: error.message });
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: nameChangeLimitQueryKey(user.id),
    });
    setNameSaved(true);
  };

  const onSendPasswordEmail: SubmitHandler<EmailSchema> = async ({ email }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/forgot-password/new-password`,
    });

    if (error) {
      setPasswordError("root", { type: "server", message: error.message });
      return;
    }

    navigate("/forgot-password/check-email", { state: { email } });
  };

  const onLanguageChange = async (value: string | null) => {
    if (!user || !isBookLanguage(value) || value === selectedLanguage) return;

    const previousLanguage = selectedLanguage;
    setSelectedLanguage(value);
    setLanguageError(null);
    setIsSavingLanguage(true);

    const { error } = await supabase.auth.updateUser({
      data: { preferred_language: value },
    });

    setIsSavingLanguage(false);

    if (error) {
      setSelectedLanguage(previousLanguage);
      setLanguageError(error.message);
    }
  };

  const formatRemainingTime = (milliseconds: number) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-4xl font-bold">Settings</h1>

      <section className="flex flex-col gap-3 rounded-md border p-4">
        <div>
          <h2 className="text-xl font-semibold">Display name</h2>
          <p className="text-sm text-muted-foreground">
            You can change your display name once every 24 hours.
          </p>
        </div>

        <form onSubmit={handleNameSubmit(onSaveName)} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1">
            <label htmlFor="display-name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="display-name"
              {...registerName("displayName")}
              type="text"
              autoComplete="name"
              maxLength={120}
              className="w-full rounded-md border bg-background px-3 py-2"
            />
            {nameErrors.displayName && (
              <p role="alert" className="text-sm text-destructive">
                {nameErrors.displayName.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={
              isSavingName ||
              isNameCooldownActive ||
              nameChangeLimitQuery.isLoading ||
              isNameUnchanged
            }
            className="self-end rounded-md bg-accent px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingName ? <LoaderCircle className="size-5 animate-spin" /> : "Save changes"}
          </button>
        </form>

        {isNameCooldownActive && nameAvailableAt && (
          <p className="text-sm text-muted-foreground">
            You can change your name in {formatRemainingTime(cooldownRemainingMs)}
            {" "}(on {new Date(nameAvailableAt).toLocaleString()}).
          </p>
        )}
        {nameChangeLimitQuery.isError && (
          <p role="alert" className="text-sm text-destructive">
            Could not load the name change timer. The database will still enforce the 24-hour limit.
          </p>
        )}
        {nameErrors.root?.message && (
          <p role="alert" className="text-sm text-destructive">
            {nameErrors.root.message}
          </p>
        )}
        {nameSaved && (
          <p role="status" className="text-sm text-muted-foreground">
            Display name updated.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-md border p-4">
        <div>
          <h2 className="text-xl font-semibold">Change password</h2>
          <p className="text-sm text-muted-foreground">
            We’ll send a verification link to your account email.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit(onSendPasswordEmail)} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-1">
            <label htmlFor="password-reset-email" className="text-sm font-medium">
              Account email
            </label>
            <input
              id="password-reset-email"
              {...registerPasswordEmail("email")}
              type="email"
              readOnly
              className="w-full rounded-md border bg-muted px-3 py-2"
            />
            {passwordErrors.email && (
              <p role="alert" className="text-sm text-destructive">
                {passwordErrors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSendingPasswordEmail || !user?.email}
            className="self-end rounded-md bg-accent px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSendingPasswordEmail ? <LoaderCircle className="size-5 animate-spin" /> : "Send verification email"}
          </button>
        </form>
        {passwordErrors.root?.message && (
          <p role="alert" className="text-sm text-destructive">
            {passwordErrors.root.message}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-md border p-4">
        <div>
          <h2 className="text-xl font-semibold">Search language</h2>
          <p className="text-sm text-muted-foreground">
            Choose the language used to filter search results.
          </p>
        </div>

        <Select
          value={selectedLanguage}
          onValueChange={(value) => void onLanguageChange(value)}
          disabled={isSavingLanguage}
        >
          <SelectTrigger className="w-full max-w-64">
            <Globe />
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {bookLanguages.map((language) => (
                <SelectItem key={language.value} value={language.value}>
                  {language.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {isSavingLanguage && (
          <p className="text-sm text-muted-foreground">Saving language...</p>
        )}
        {languageError && (
          <p role="alert" className="text-sm text-destructive">
            {languageError}
          </p>
        )}
      </section>
    </div>
  );
};

export default Settings;
