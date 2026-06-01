import { cn } from "@/lib/utils";
import { useLanguage } from "@/app/contexts/LanguageContext";

export function Footer({ className }: { className?: string }) {
  const { t, currentLanguage } = useLanguage();

  return (
    <footer className={cn("py-8 px-6 border-t border-border bg-card mt-auto", className)}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Alkemio</span>
          <span>© 2026</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-foreground transition-colors">{t("footer.terms")}</a>
          <a href="#" className="hover:text-foreground transition-colors">{t("footer.privacy")}</a>
          <a href="#" className="hover:text-foreground transition-colors">{t("footer.docs")}</a>
          <a href="#" className="hover:text-foreground transition-colors">{t("footer.support")}</a>
        </div>
        <div className="flex items-center gap-2">
           <span>{currentLanguage.nativeLabel}</span>
        </div>
      </div>
    </footer>
  );
}