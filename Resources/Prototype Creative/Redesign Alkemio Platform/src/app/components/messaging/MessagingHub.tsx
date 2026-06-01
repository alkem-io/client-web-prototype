import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, Plus, PanelRightClose, Layers, SquareArrowOutUpRight, MessageCircle, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ConversationList } from "./ConversationList";
import { ChatView } from "./ChatView";
import { NewConversationFlow } from "./NewConversationFlow";
import { CONVERSATIONS, type Conversation } from "./messagingData";
import { useDesignVariant } from "@/app/contexts/DesignVariantContext";
import { useSpaceChatDrawer } from "@/app/contexts/SpaceChatDrawerContext";
import { useMessagingHub } from "@/app/contexts/MessagingHubContext";

type HubView = "list" | "chat" | "new";

interface MessagingHubProps {
  open: boolean;
  onClose: () => void;
}

export function MessagingHub({ open, onClose }: MessagingHubProps) {
  const [view, setView] = useState<HubView>("list");
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { variant } = useDesignVariant();
  const navigate = useNavigate();
  const drawer = useSpaceChatDrawer();
  const messagingHub = useMessagingHub();

  const handleSelectConversation = useCallback(
    (conv: Conversation) => {
      // Variant B: Space channels navigate to the Space and open the drawer
      if (variant === "B" && conv.type === "space" && conv.spaceSlug) {
        drawer.openDrawer(conv.spaceSlug);
        navigate(`/space/${conv.spaceSlug}`);
        onClose();
        return;
      }
      // Variant C: Space channels navigate to the Space's CHAT tab
      if (variant === "C" && conv.type === "space" && conv.spaceSlug) {
        navigate(`/space/${conv.spaceSlug}/chat`);
        onClose();
        return;
      }
      // Variant D: Space channels open inline (same as A) — no navigation
      setActiveConversation(conv);
      setView("chat");
    },
    [variant, drawer, navigate, onClose]
  );

  const handleBack = useCallback(() => {
    setView("list");
    setActiveConversation(null);
  }, []);

  const handleNewMessage = useCallback(() => {
    setView("new");
  }, []);

  const handleNewConversationOpen = useCallback(
    (conv: Conversation) => {
      handleSelectConversation(conv);
    },
    [handleSelectConversation]
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Reset to list view when the hub is closed
  useEffect(() => {
    if (!open) {
      setView("list");
      setActiveConversation(null);
      setSearchQuery("");
    }
  }, [open]);

  // Auto-open a specific conversation when triggered from the ChatRail
  useEffect(() => {
    if (open && messagingHub.initialConversationId) {
      const conv = CONVERSATIONS.find(
        (c) => c.id === messagingHub.initialConversationId
      );
      if (conv) {
        handleSelectConversation(conv);
      }
      messagingHub.clearInitialConversation();
    }
  }, [open, messagingHub.initialConversationId, handleSelectConversation, messagingHub]);

  const totalUnread = CONVERSATIONS.reduce((s, c) => s + c.unread, 0);

  const variantLabel =
    variant === "A"
      ? "Overlay Panel"
      : variant === "B"
      ? "Persistent Drawer"
      : variant === "C"
      ? "Full Tab"
      : variant === "D"
      ? "Expanded Widget"
      : null;

  const handleVisitSpace = useCallback(() => {
    if (activeConversation?.type === "space" && activeConversation.spaceSlug) {
      navigate(`/space/${activeConversation.spaceSlug}`);
      onClose();
    }
  }, [activeConversation, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed inset-0 z-[60]",
              variant === "D" ? "" : "md:pointer-events-none"
            )}
            style={{ background: variant === "D" ? "transparent" : "rgba(0,0,0,0.08)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={variant === "D"
              ? { opacity: 0, scale: 0.9, y: 30 }
              : { x: "100%" }
            }
            animate={variant === "D"
              ? { opacity: 1, scale: 1, y: 0 }
              : { x: 0 }
            }
            exit={variant === "D"
              ? { opacity: 0, scale: 0.9, y: 30 }
              : { x: "100%" }
            }
            transition={variant === "D"
              ? { type: "spring", damping: 24, stiffness: 300 }
              : { type: "spring", damping: 28, stiffness: 300 }
            }
            className={cn(
              "fixed z-[61] flex flex-col",
              variant === "D" ? "" : "top-0 right-0"
            )}
            style={variant === "D"
              ? {
                  bottom: 24,
                  right: 24,
                  width: "min(380px, calc(100vw - 48px))",
                  height: "min(560px, calc(100dvh - 120px))",
                  borderRadius: 16,
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
                  fontFamily: "'Inter', sans-serif",
                  transformOrigin: "bottom right",
                }
              : {
                  width: "min(380px, 100vw)",
                  height: "100dvh",
                  background: "var(--background)",
                  borderLeft: "1px solid var(--border)",
                  boxShadow: "-8px 0 30px rgba(0,0,0,0.08)",
                  fontFamily: "'Inter', sans-serif",
                }
            }
            role="dialog"
            aria-label="Messaging Hub"
          >
            {/* ── Panel Header ──────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: variant === "D" ? "10px 14px" : "14px 16px",
                borderBottom: "1px solid var(--border)",
                background: "var(--card)",
                ...(variant === "D" ? { borderRadius: "16px 16px 0 0" } : {}),
              }}
            >
              <div className="flex items-center gap-2">
                <h2
                  style={{
                    fontSize: variant === "D" ? "var(--text-sm)" : "var(--text-base)",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    margin: 0,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Messages
                </h2>
                {totalUnread > 0 && view === "list" && (
                  <span
                    className="rounded-full flex items-center justify-center"
                    style={{
                      minWidth: variant === "D" ? 18 : 20,
                      height: variant === "D" ? 18 : 20,
                      padding: "0 5px",
                      fontSize: variant === "D" ? "10px" : "11px",
                      fontWeight: 700,
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {totalUnread}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {view === "list" && (
                  <button
                    onClick={handleNewMessage}
                    className="p-1.5 rounded-md transition-colors"
                    style={{ color: "var(--foreground)" }}
                    title="New Message"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Plus style={{ width: variant === "D" ? 16 : 18, height: variant === "D" ? 16 : 18 }} />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: "var(--muted-foreground)" }}
                  title={variant === "D" ? "Minimize" : "Close"}
                  aria-label={variant === "D" ? "Minimize messages widget" : "Close messages"}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {variant === "D" ? (
                    <Minus style={{ width: 16, height: 16 }} />
                  ) : (
                    <X style={{ width: 18, height: 18 }} />
                  )}
                </button>
              </div>
            </div>

            {/* ── Variant mode indicator ────────────────────────────────── */}
            {variantLabel && view === "list" && variant !== "D" && (
              <div
                className="flex items-center gap-2 shrink-0"
                style={{
                  padding: "8px 16px",
                  background:
                    variant === "B" || variant === "C"
                      ? "color-mix(in srgb, var(--primary) 6%, transparent)"
                      : "var(--secondary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {variant === "A" ? (
                  <Layers
                    style={{
                      width: 13,
                      height: 13,
                      color: "var(--muted-foreground)",
                    }}
                  />
                ) : variant === "C" ? (
                  <SquareArrowOutUpRight
                    style={{
                      width: 13,
                      height: 13,
                      color: "var(--primary)",
                    }}
                  />
                ) : (
                  <PanelRightClose
                    style={{
                      width: 13,
                      height: 13,
                      color: "var(--primary)",
                    }}
                  />
                )}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color:
                      variant === "B" || variant === "C"
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {variant === "A"
                    ? "Space channels open as overlay panels"
                    : variant === "B"
                    ? "Space channels open as persistent drawers in-Space"
                    : "Space channels open as a full tab in-Space"}
                </span>
              </div>
            )}

            {/* ── Body ──────────────────────────────────────────────────── */}
            <div className={cn(
              "flex-1 min-h-0 flex flex-col overflow-hidden",
              variant === "D" && "rounded-b-[16px]"
            )}>
              {view === "list" && (
                <div
                  className="flex-1 flex flex-col overflow-hidden"
                  style={{ paddingTop: variant === "D" ? 8 : 12 }}
                >
                  <ConversationList
                    conversations={CONVERSATIONS}
                    onSelect={handleSelectConversation}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    spaceChannelNavigates={variant === "B" || variant === "C"}
                    spaceNavigateLabel={
                      variant === "C"
                        ? "Open in Chat tab"
                        : variant === "B"
                        ? "Open in Space drawer"
                        : undefined
                    }
                  />
                </div>
              )}

              {view === "chat" && activeConversation && (
                <ChatView
                  conversation={activeConversation}
                  onBack={handleBack}
                  compact={variant === "D"}
                  onVisitSpace={
                    variant === "D" && activeConversation.type === "space"
                      ? handleVisitSpace
                      : undefined
                  }
                />
              )}

              {view === "new" && (
                <NewConversationFlow
                  onBack={handleBack}
                  onOpenConversation={handleNewConversationOpen}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}