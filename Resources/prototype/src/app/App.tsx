import { LanguageProvider } from "./contexts/LanguageContext";
import { MessagingHubProvider } from "./contexts/MessagingHubContext";
import { SearchProvider } from "./contexts/SearchContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <TooltipProvider delayDuration={500}>
      <LanguageProvider>
        <MessagingHubProvider>
          <SearchProvider>
            <RouterProvider router={router} />
          </SearchProvider>
        </MessagingHubProvider>
      </LanguageProvider>
    </TooltipProvider>
  );
}