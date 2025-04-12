import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
      >
        English
      </Button>
      <Button
        variant={language === 'sw' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('sw')}
      >
        Swahili
      </Button>
    </div>
  );
};
