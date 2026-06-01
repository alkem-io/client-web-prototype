import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  MessageSquare,
  MessageCircle,
  Bell,
  Globe,
  Check,
  UserPlus,
  Clock,
  Menu,
  Sparkles,
  Network,
  User,
  Layout,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useLanguage, LANGUAGES } from "@/app/contexts/LanguageContext";
import { useDesignVariant, DESIGN_VARIANTS } from "@/app/contexts/DesignVariantContext";
import { MessagingHub } from "@/app/components/messaging/MessagingHub";
import { useMessagingHub } from "@/app/contexts/MessagingHubContext";
import { useSearch } from "@/app/contexts/SearchContext";
import { CONVERSATIONS } from "@/app/components/messaging/messagingData";

// Known space slug → display name map
const SPACE_NAME_MAP: Record<string, string> = {
  "innovation-hub": "Innovation Hub",
  "sustainability-lab": "Sustainability Lab",
  "urban-mobility": "Urban Mobility Lab",
  "ocean-health": "Ocean Health Initiative",
  "circular-economy": "Circular Economy",
  "digital-inclusion": "Digital Inclusion",
};

/** Detect if the user is currently inside a /space/:slug route */
function useCurrentSpaceFromUrl(): { slug: string; name: string } | null {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/space\/([^/]+)/);
  if (!match) return null;
  const slug = match[1];
  return { slug, name: SPACE_NAME_MAP[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
}

// Mock Notifications Data
const notifications = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    action: "commented on",
    target: "Sustainability Goals 2024",
    time: "2m ago",
    read: false,
    type: "comment"
  },
  {
    id: 2,
    author: "Marc Johnson",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150",
    action: "invited you to",
    target: "Urban Mobility Lab",
    time: "1h ago",
    read: false,
    type: "invite"
  },
  {
    id: 3,
    author: "Alkemio Bot",
    avatar: "", 
    action: "mentioned you in",
    target: "Platform Updates Q1",
    time: "5h ago",
    read: true,
    type: "mention"
  }
];

export function Header({ className, onMenuClick }: { className?: string, onMenuClick?: () => void }) {
  const [showMessages, setShowMessages] = useState(false);
  const [showMessagingHub, setShowMessagingHub] = useState(false);
  const [headerSearchValue, setHeaderSearchValue] = useState("");
  const [searchScope, setSearchScope] = useState<"all" | "space">("all");
  const unreadCount = notifications.filter(n => !n.read).length;
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { variant, setVariant } = useDesignVariant();
  const messagingHub = useMessagingHub();
  const { openSearch } = useSearch();
  const currentSpace = useCurrentSpaceFromUrl();

  const msgUnreadTotal = CONVERSATIONS.reduce((s, c) => s + c.unread, 0);

  // For Variant A, use the shared context so the ChatRail can also control the Hub.
  // For other variants, keep the local state.
  const isHubOpen = variant === "A" ? messagingHub.isHubOpen : showMessagingHub;
  const setHubOpen = variant === "A"
    ? (open: boolean) => { open ? messagingHub.openHub() : messagingHub.closeHub(); }
    : setShowMessagingHub;

  const handleMessageClick = () => {
    if (variant === "A") {
      messagingHub.toggleHub();
    } else if (variant === "B" || variant === "C" || variant === "D") {
      setShowMessagingHub((prev) => !prev);
    } else {
      setShowMessages(true);
    }
  };

  const handleHeaderSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && headerSearchValue.trim()) {
      e.preventDefault();
      const scope = currentSpace && searchScope === "space" ? currentSpace.slug : "all";
      openSearch(headerSearchValue.trim(), scope);
      setHeaderSearchValue("");
    }
  };

  return (
    <>
      <header className={cn("h-16 border-b border-border bg-background sticky top-0 z-50 px-6 flex items-center justify-between", className)}>
        <div className="flex items-center gap-4 flex-1">
          <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 hover:bg-accent rounded-md">
            <Menu className="w-5 h-5" />
          </button>
          <div
            className="relative w-full max-w-md hidden md:flex items-center h-10 overflow-hidden transition-all"
            style={{
              background: "var(--secondary)",
              borderRadius: "9999px",
            }}
          >
            {/* Inline scope selector — only rendered when inside a space */}
            {currentSpace && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 shrink-0 h-full px-3 transition-colors whitespace-nowrap outline-none"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: "var(--font-weight-medium)" as any,
                      background: searchScope === "space"
                        ? "var(--primary)"
                        : "transparent",
                      color: searchScope === "space"
                        ? "var(--primary-foreground)"
                        : "var(--muted-foreground)",
                      borderRight: "1px solid var(--border)",
                      borderRadius: "9999px 0 0 9999px",
                    }}
                    aria-label="Search scope"
                  >
                    <Globe style={{ width: 14, height: 14, flexShrink: 0 }} />
                    <span className="hidden lg:inline truncate" style={{ maxWidth: 120 }}>
                      {searchScope === "all" ? "All" : currentSpace.name}
                    </span>
                    <span className="lg:hidden">
                      {searchScope === "all" ? "All" : "Space"}
                    </span>
                    <ChevronDown style={{ width: 11, height: 11, opacity: 0.6, flexShrink: 0 }} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-0 overflow-hidden">
                  <div
                    className="px-3 py-2"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: "var(--muted)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        color: "var(--muted-foreground)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Search scope
                    </span>
                  </div>
                  <div className="py-1">
                    <DropdownMenuItem
                      onClick={() => setSearchScope("all")}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 cursor-pointer",
                        searchScope === "all" && "bg-accent"
                      )}
                    >
                      <Globe style={{ width: 15, height: 15, color: "var(--muted-foreground)", flexShrink: 0 }} />
                      <div className="flex flex-col min-w-0">
                        <span
                          style={{
                            fontSize: "var(--text-sm)",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: searchScope === "all" ? 600 : "var(--font-weight-normal)" as any,
                            color: "var(--foreground)",
                          }}
                        >
                          All Spaces
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontFamily: "'Inter', sans-serif",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          Search the entire platform
                        </span>
                      </div>
                      {searchScope === "all" && (
                        <Check className="ml-auto shrink-0" style={{ width: 14, height: 14, color: "var(--primary)" }} />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSearchScope("space")}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2.5 cursor-pointer",
                        searchScope === "space" && "bg-accent"
                      )}
                    >
                      <Search style={{ width: 15, height: 15, color: "var(--muted-foreground)", flexShrink: 0 }} />
                      <div className="flex flex-col min-w-0">
                        <span
                          className="truncate"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: searchScope === "space" ? 600 : "var(--font-weight-normal)" as any,
                            color: "var(--foreground)",
                          }}
                        >
                          {currentSpace.name}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontFamily: "'Inter', sans-serif",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          Search only this space
                        </span>
                      </div>
                      {searchScope === "space" && (
                        <Check className="ml-auto shrink-0" style={{ width: 14, height: 14, color: "var(--primary)" }} />
                      )}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Search icon + input — fills remaining width */}
            <div className="flex items-center flex-1 min-w-0">
              <Search
                className="shrink-0 ml-3"
                style={{ width: 15, height: 15, color: "var(--muted-foreground)" }}
              />
              <input
                type="text"
                placeholder="Search and press Enter…"
                value={headerSearchValue}
                onChange={(e) => setHeaderSearchValue(e.target.value)}
                onKeyDown={handleHeaderSearchKeyDown}
                className="flex-1 min-w-0 h-full bg-transparent outline-none px-2.5"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--foreground)",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
          </div>
          {/* Mobile search button — opens overlay with empty input for mobile users */}
          <button
            onClick={() => openSearch()}
            className="md:hidden p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Messages trigger — hidden for Variant A (uses ChatRail), Variant D (uses floating bubble), and Variant E (no messaging system) */}
          {variant !== "A" && variant !== "D" && variant !== "E" && (
            <button 
              onClick={handleMessageClick}
              className="relative p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors outline-none focus:bg-accent"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {(variant === "A" || variant === "B" || variant === "C") && msgUnreadTotal > 0 ? (
                <span
                  className="absolute flex items-center justify-center rounded-full border border-background"
                  style={{
                    top: 4,
                    right: 2,
                    minWidth: 16,
                    height: 16,
                    padding: "0 4px",
                    fontSize: "9px",
                    fontWeight: 700,
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {msgUnreadTotal}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-background" style={{ background: "var(--primary)" }}></span>
              )}
            </button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors outline-none focus:bg-accent">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-background"></span>
                )}
              </button>
            </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96 p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <h3 className="font-semibold text-[length:var(--text-sm)]">Notifications</h3>
              <Button variant="ghost" size="sm" className="h-auto px-2 text-[length:var(--text-xs)] text-primary hover:text-primary/80">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={cn(
                        "flex gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-0",
                        !notification.read && "bg-primary/5 hover:bg-primary/10"
                      )}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <Avatar className="w-8 h-8 md:w-10 md:h-10 border border-border">
                          <AvatarImage src={notification.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-[length:var(--text-xs)]">
                            {notification.author.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {notification.type === 'invite' && (
                           <div className="absolute -mt-3 -ml-1 rounded-full p-0.5 border border-background" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                             <UserPlus className="w-2.5 h-2.5" />
                           </div>
                        )}
                        {notification.type === 'comment' && (
                           <div className="absolute -mt-3 -ml-1 rounded-full p-0.5 border border-background" style={{ background: 'var(--chart-2)', color: 'var(--primary-foreground)' }}>
                             <MessageSquare className="w-2.5 h-2.5" />
                           </div>
                        )}
                        {notification.type === 'mention' && (
                           <div className="absolute -mt-3 -ml-1 rounded-full p-0.5 border border-background" style={{ background: 'var(--destructive)', color: 'var(--destructive-foreground)' }}>
                             <Check className="w-2.5 h-2.5" />
                           </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-[length:var(--text-sm)] leading-snug text-foreground">
                          <span className="font-semibold">{notification.author}</span>
                          {" "}{notification.action}{" "}
                          <span className="font-medium text-foreground/80">{notification.target}</span>
                        </p>
                        <p className="text-[length:var(--text-xs)] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 mt-1.5">
                           <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-[length:var(--text-sm)]">No new notifications</p>
                </div>
              )}
            </div>
            <div className="p-2 border-t bg-muted/30 text-center">
              <Button variant="ghost" size="sm" className="w-full text-[length:var(--text-xs)] h-8" asChild>
                <Link to="/user/alex-rivera/settings/notifications">
                  Manage Settings
                </Link>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors outline-none focus:bg-accent"
              title="Language"
            >
              <Globe className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-0 overflow-hidden">
            <div className="px-4 py-2.5 border-b" style={{ background: "var(--muted)", borderColor: "var(--border)" }}>
              <span className="font-semibold text-[length:var(--text-sm)]" style={{ color: "var(--foreground)" }}>Language</span>
            </div>
            <div className="py-1">
              {LANGUAGES.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer",
                    language === lang.code && "bg-accent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center justify-center shrink-0 rounded-sm overflow-hidden"
                      style={{
                        width: 22,
                        height: 16,
                        fontSize: "11px",
                        fontWeight: 700,
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                        border: "1px solid var(--border)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {lang.flag}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[length:var(--text-sm)]" style={{ color: "var(--foreground)" }}>{lang.nativeLabel}</span>
                      {lang.nativeLabel !== lang.label && (
                        <span className="text-[length:var(--text-xs)]" style={{ color: "var(--muted-foreground)" }}>{lang.label}</span>
                      )}
                    </div>
                  </div>
                  {language === lang.code && (
                    <Check className="w-4 h-4 shrink-0" style={{ color: "var(--primary)" }} />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border hidden md:block"></div>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 hover:bg-accent/50 p-1.5 rounded-full pr-3 transition-colors cursor-pointer">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-[length:var(--text-sm)]">
                <span className="font-medium leading-none">Alex Contributor</span>
                <span className="text-[length:var(--text-xs)] text-muted-foreground">Portfolio Owner</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-[length:var(--text-xs)] uppercase tracking-wider text-muted-foreground">Switch App</DropdownMenuLabel>
            <div className="px-1 py-1">
                <div className="flex items-center justify-between px-2 py-1.5 rounded-sm bg-accent/50 cursor-default">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-medium text-[length:var(--text-sm)]">Alkemio</span>
                    </div>
                    <Check className="w-3 h-3 text-primary" />
                </div>
                <div 
                    className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => navigate('/analytics')}
                >
                    <Network className="w-4 h-4" />
                    <span className="font-medium text-[length:var(--text-sm)]">Ecosystem Analytics</span>
                </div>
            </div>
            <DropdownMenuSeparator />
            {/* Messaging A/B Test Variant Switcher */}
            <DropdownMenuLabel className="text-[length:var(--text-xs)] uppercase tracking-wider text-muted-foreground">Messaging Variant</DropdownMenuLabel>
            <div className="px-1 py-1">
              <div className="flex flex-wrap gap-1">
                {DESIGN_VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.id)}
                    className={cn(
                      "flex items-center justify-center rounded-md transition-colors text-[length:var(--text-xs)] font-medium",
                      variant === v.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-muted-foreground hover:bg-accent/80 hover:text-foreground"
                    )}
                    style={{
                      width: 36,
                      height: 28,
                      fontFamily: "'Inter', sans-serif",
                    }}
                    title={v.description}
                  >
                    {v.id}
                  </button>
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[length:var(--text-xs)] uppercase tracking-wider text-muted-foreground">My Account</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/user/alex-rivera" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/design-system" className="cursor-pointer">
                <Layout className="mr-2 h-4 w-4" />
                <span>Design System</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

      {/* Variant A, B, C, D: Unified Messaging Hub — E has no Hub */}
      {(variant === "A" || variant === "B" || variant === "C" || variant === "D") && (
        <MessagingHub open={isHubOpen} onClose={() => setHubOpen(false)} />
      )}

      {/* Variant D: Floating chat bubble when widget is closed */}
      {variant === "D" && (
        <AnimatePresence>
          {!isHubOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHubOpen(true)}
              className="fixed z-[50] flex items-center justify-center rounded-full"
              style={{
                bottom: 24,
                right: 24,
                width: 56,
                height: 56,
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--elevation-sm), 0 2px 6px rgba(0,0,0,0.1)",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={`Open messages${msgUnreadTotal > 0 ? ` (${msgUnreadTotal} unread)` : ""}`}
              title="Messages"
            >
              <MessageCircle style={{ width: 24, height: 24 }} />

              {msgUnreadTotal > 0 && (
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    top: -2,
                    right: -2,
                    minWidth: 20,
                    height: 20,
                    padding: "0 5px",
                    fontSize: "10px",
                    fontWeight: 700,
                    background: "var(--destructive)",
                    color: "var(--destructive-foreground)",
                    border: "2px solid var(--background)",
                    lineHeight: 1,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {msgUnreadTotal}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      )}
    </>
  );
}