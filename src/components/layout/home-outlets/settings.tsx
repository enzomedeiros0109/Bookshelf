import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
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
import {
  bookLanguages,
  getBookLanguage,
  isBookLanguage,
} from "@/constants/book-languages";
import { supabase } from "@/lib/supabase-client";

const Settings = () => {
  const { user } = useAuthContext();
  const preferredLanguage = getBookLanguage(
    user?.user_metadata?.preferred_language,
  );
  const [selectedLanguage, setSelectedLanguage] = useState(preferredLanguage);
  const [languageError, setLanguageError] = useState<string | null>(null);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);

  useEffect(() => {
    setSelectedLanguage(preferredLanguage);
  }, [preferredLanguage]);

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

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-4xl font-bold">Settings</h1>

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
