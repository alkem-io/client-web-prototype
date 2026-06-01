import { LanguageProvider } from "./contexts/LanguageContext";
import { SpaceChatDrawerProvider } from "./contexts/SpaceChatDrawerContext";
import { DesignVariantProvider } from "./contexts/DesignVariantContext";
import { MessagingHubProvider } from "./contexts/MessagingHubContext";
import { SearchProvider } from "./contexts/SearchContext";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <LanguageProvider>
      <DesignVariantProvider>
        <SpaceChatDrawerProvider>
          <MessagingHubProvider>
            <SearchProvider>
              <RouterProvider router={router} />
            </SearchProvider>
          </MessagingHubProvider>
        </SpaceChatDrawerProvider>
      </DesignVariantProvider>
    </LanguageProvider>
  );
}
