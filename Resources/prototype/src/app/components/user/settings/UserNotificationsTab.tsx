import { Bot, Building2, Globe, Layers, type LucideIcon, ShieldCheck, User, Volume2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { demoDelay, type LooseT, useDemoState } from "@/app/components/shared/useDemoState";
import { NewActivitySettingsSection } from "@/ahead/NewActivitySettingsSection";
import type { SettingsSectionIconColor } from "@/crd/components/common/SettingsSection";
import {
  type ChannelType,
  UserNotificationsTabView,
} from "@/crd/components/user/settings/UserNotificationsTabView";

type Channels = Record<ChannelType, boolean>;

const GROUP_ROWS: Record<string, string[]> = {
  space: [
    "communicationUpdates",
    "collaborationCalloutPublished",
    "collaborationCalloutReaction",
    "collaborationCalloutPostContributionComment",
    "collaborationCalloutContributionCreated",
    "collaborationCalloutComment",
    "communityCalendarEvents",
    "collaborationPollVoteCastOnOwnPoll",
    "collaborationPollVoteCastOnPollIVotedOn",
    "collaborationPollModifiedOnPollIVotedOn",
    "collaborationPollVoteAffectedByOptionChange",
  ],
  spaceAdmin: [
    "communityApplicationReceived",
    "communityNewMember",
    "communityInvitationResponse",
    "collaborationCalloutContributionCreated",
    "communicationMessageReceived",
    "userEmailChanged",
    "collaborationCalloutFormResponseReceived",
  ],
  user: [
    "commentReply",
    "mentioned",
    "messageReceived",
    "conversationMessageDirect",
    "conversationMessageGroup",
    "membershipInvitationReceived",
    "membershipCommunityJoined",
    "membershipOrganizationAssociateInvitationReceived",
    "membershipOrganizationAssociateApplicationDecided",
  ],
  platform: ["forumDiscussionComment", "forumDiscussionCreated"],
  organization: [
    "adminMentioned",
    "adminMessageReceived",
    "adminSpaceCommunityInvitation",
    "adminAssociateInvitationResponse",
    "adminAssociateApplicationReceived",
    "adminAssociateJoined",
  ],
  virtualContributor: ["adminSpaceCommunityInvitation"],
};

/** Chat messages already appear live in the chat panel, so in-app stays off for them, as in production. */
const IN_APP_LOCKED = new Set(["user.conversationMessageDirect", "user.conversationMessageGroup"]);

const GROUP_ICON: Record<string, { icon: LucideIcon; color: SettingsSectionIconColor }> = {
  space: { icon: Layers, color: "purple" },
  spaceAdmin: { icon: ShieldCheck, color: "amber" },
  user: { icon: User, color: "blue" },
  platform: { icon: Globe, color: "green" },
  organization: { icon: Building2, color: "orange" },
  virtualContributor: { icon: Bot, color: "green" },
};

const DEFAULT_CHANNELS: Channels = { inApp: true, email: true, push: false };

export function UserNotificationsTab() {
  const { t: typedT } = useTranslation("crd-contributorSettings");
  const t = typedT as unknown as LooseT;
  const [channels, setChannels] = useDemoState<Record<string, Channels>>("user.notifications", {});
  const [sounds, setSounds] = useDemoState("user.notificationSounds", { chatMessage: true, inAppNotification: false });
  const [pushSubscribed, setPushSubscribed] = useDemoState("user.pushSubscribed", false);
  const [pushLoading, setPushLoading] = useState(false);

  const groups = Object.entries(GROUP_ROWS).map(([groupId, properties]) => {
    const { icon: Icon, color } = GROUP_ICON[groupId];
    return {
      groupId,
      title: t(`user.notifications.groups.${groupId}.title`),
      description: t(`user.notifications.groups.${groupId}.description`),
      icon: <Icon className="size-4" />,
      iconColor: color,
      rows: properties.map((property) => {
        const id = `${groupId}.${property}`;
        const locked = IN_APP_LOCKED.has(id);
        const current = channels[id] ?? DEFAULT_CHANNELS;
        return {
          property,
          label: t(`user.notifications.rows.${groupId}.${property}`),
          channels: locked ? { ...current, inApp: false } : current,
          inAppLockedCaption: locked ? t("user.notifications.inAppLockedChat") : undefined,
        };
      }),
    };
  });

  return (
    <div className="space-y-6">
      <UserNotificationsTabView
        loading={false}
        pushAvailable={true}
        pushSubscribed={pushSubscribed}
        pushLoading={pushLoading}
        pushPermissionDenied={false}
        pushRequiresPwa={false}
        appMode={false}
        onPushMasterToggle={() => {
          setPushLoading(true);
          demoDelay(() => {
            setPushSubscribed((previous) => !previous);
            setPushLoading(false);
          });
        }}
        groups={groups}
        soundGroup={{
          groupId: "sound",
          title: t("user.notifications.groups.sound.title"),
          description: t("user.notifications.groups.sound.description"),
          icon: <Volume2 className="size-4" />,
          iconColor: "blue",
          rows: (["chatMessage", "inAppNotification"] as const).map((property) => ({
            property,
            label: t(`user.notifications.rows.sound.${property}`),
            enabled: sounds[property],
          })),
        }}
        onToggle={(groupId, property, channel, next) =>
          setChannels((previous) => {
            const id = `${groupId}.${property}`;
            return { ...previous, [id]: { ...(previous[id] ?? DEFAULT_CHANNELS), [channel]: next } };
          })
        }
        onToggleSound={(property, next) => setSounds({ ...sounds, [property]: next })}
      />
      <NewActivitySettingsSection />
    </div>
  );
}
