import { demoUpload, DEMO_CITIES, DEMO_COUNTRIES } from "@/app/components/shared/demoLocations";
import { SettingsSaveControls } from "@/app/components/shared/SettingsSaveControls";
import { demoDelay } from "@/app/components/shared/useDemoState";
import { useDemoSettingsForm } from "@/app/components/shared/useDemoSettingsForm";
import { UserProfileTabView } from "@/crd/components/user/settings/UserProfileTabView";
import { useState } from "react";
import { DEMO_USER_PROFILE } from "./demoUser";

export function UserProfileTab() {
  const form = useDemoSettingsForm("user.profile", DEMO_USER_PROFILE);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { values } = form;

  return (
    <>
      <UserProfileTabView
        values={values}
        countries={DEMO_COUNTRIES}
        cityOptions={DEMO_CITIES}
        loading={false}
        disabled={form.saving}
        onChange={form.onChange}
        onReferencesChange={(rows) =>
          form.onChange({
            references: rows.map((row, index) => ({
              id: row.id ?? `temp-${index}`,
              name: row.name,
              uri: row.uri,
              description: row.description ?? "",
              recognized: false,
            })),
          })
        }
        onReferenceFileUpload={demoUpload}
        onUpdateRecognizedReference={(kind, uri) =>
          form.onChange({
            recognizedReferences: {
              ...values.recognizedReferences,
              [kind]: uri ? { id: `ref-${kind}`, name: kind, uri, description: "", recognized: true } : null,
            },
          })
        }
        onUploadAvatar={(file) => {
          setUploadingAvatar(true);
          demoDelay(() => {
            form.commit({ avatar: { ...values.avatar, uri: URL.createObjectURL(file) } });
            setUploadingAvatar(false);
          });
        }}
        uploadingAvatar={uploadingAvatar}
        onImageUpload={demoUpload}
      />
      <SettingsSaveControls
        state={form.barState}
        isDirty={form.isDirty}
        onSave={form.save}
        onDiscard={form.discard}
      />
    </>
  );
}
