import { X, Hash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatView } from "./ChatView";
import { CONVERSATIONS, type Conversation } from "./messagingData";

interface SpaceChatPanelProps {
  open: boolean;
  onClose: () => void;
  spaceSlug: string;
  /** If provided, clicking "View in Messages" opens the Hub to this conversation */
  onViewInHub?: () => void;
}

export function SpaceChatPanel({
  open,
  onClose,
  spaceSlug,
  onViewInHub,
}: SpaceChatPanelProps) {
  // Find the matching Space channel
  const channel: Conversation | undefined = CONVERSATIONS.find(
    (c) => c.type === "space" && c.spaceSlug === spaceSlug
  );

  // Fallback channel if no exact match
  const fallbackChannel: Conversation = channel ?? {
    id: `space-${spaceSlug}`,
    type: "space",
    name: spaceSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    avatar: "",
    initials: spaceSlug.substring(0, 2).toUpperCase(),
    avatarColor: "#6366f1",
    lastMessage: "",
    timeLabel: "",
    unread: 0,
    muted: false,
    memberCount: 0,
    spaceSlug,
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Subtle backdrop — dims the Space content slightly */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[55]"
            style={{ background: "rgba(0,0,0,0.06)" }}
            onClick={onClose}
          />

          {/* Side panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 z-[56] flex flex-col"
            style={{
              top: 64, // below header
              width: "min(400px, 100vw)",
              height: "calc(100dvh - 64px)",
              background: "var(--background)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "-6px 0 24px rgba(0,0,0,0.08)",
              fontFamily: "'Inter', sans-serif",
            }}
            role="dialog"
            aria-label={`${fallbackChannel.name} chat panel`}
          >
            <ChatView
              conversation={fallbackChannel}
              onBack={onClose}
              onViewInHub={onViewInHub}
              compact
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
