import { useState } from "react";
import { demoDelay, useDemoState } from "@/app/components/shared/useDemoState";
import { UserSettingsTabView } from "@/crd/components/user/settings/UserSettingsTabView";
import { DEMO_LANGUAGES } from "./demoUser";

export function UserGeneralSettingsTab() {
  const [allowMessages, setAllowMessages] = useDemoState("user.allowMessages", true);
  const [language, setLanguage] = useDemoState("user.language", "en");
  const [communicationSaving, setCommunicationSaving] = useState(false);
  const [languageSaving, setLanguageSaving] = useState(false);

  return (
    <UserSettingsTabView
      loading={false}
      allowOtherUsersToSendMessages={allowMessages}
      communicationSaving={communicationSaving}
      onToggleAllowMessages={(next) => {
        setCommunicationSaving(true);
        demoDelay(() => {
          setAllowMessages(next);
          setCommunicationSaving(false);
        });
      }}
      currentLanguage={language}
      availableLanguages={DEMO_LANGUAGES}
      languageSaving={languageSaving}
      onLanguageChange={(next) => {
        setLanguageSaving(true);
        demoDelay(() => {
          setLanguage(next);
          setLanguageSaving(false);
        });
      }}
    />
  );
}
