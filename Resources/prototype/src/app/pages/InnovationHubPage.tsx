import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router";
import { Settings, Search, X, ChevronDown, SlidersHorizontal, FolderOpen } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { SpaceCard, SpaceCardSkeleton, type SpaceCardData } from "@/app/components/space/SpaceCard";
import AlkemioSymbolSquare from "@/imports/AlkemioSymbolSquare";

/* ─── Sample Data (VNG Innovation Hub) ─── */
const hubData = {
  slug: "vng-innovation-hub",
  name: "VNG Innovation Hub",
  tagline: "innovatie met en door de gemeentes",
  bannerImage: "/banners/vng-innovation-hub.png",
  description: `De <strong>open innovatiehub</strong> voor <strong>samenwerking tussen en voor de gemeentes</strong> in Nederland.<br/>Hier vind je communities die werken aan nieuwe vormen van publieke dienstverlening die aansluiten bij de leefwereld van mensen.<br/>Een plek waar de <strong>overheid, markt, wetenschap</strong> en <strong>samenleving</strong> samen kunnen werken aan <em>maatschappelijke missies</em>.`,
};

const hubSpaces: SpaceCardData[] = [
  {
    id: "1",
    slug: "digitale-leefomgeving",
    name: "Digitale Leefomgeving",
    description: "De Digital Twin Community NL!",
    bannerImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "DL",
    avatarColor: "#1d384a",
    isPrivate: false,
    tags: ["digital twin", "3d"],
    memberCount: 42,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=1", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
      { name: "IP", avatar: "https://i.pravatar.cc/40?img=3", type: "org" },
    ],
  },
  {
    id: "2",
    slug: "totaal-driedimensionaal",
    name: "Totaal Driedimensionaal (T3...)",
    description: "Praktische oplossingen voor het in 3D inwinnen, registreren en gebruiken van...",
    bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "T3",
    avatarColor: "#2d6a4f",
    isPrivate: false,
    tags: ["geo-basisregistrat...", "BAG"],
    memberCount: 28,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=5", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "3",
    slug: "dutch-societal-innovation-hub",
    name: "Dutch Societal Innovation ...",
    description: "De maatschappij vraagt erom dat het anders gaat en wij zetten samen de eers...",
    bannerImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "DS",
    avatarColor: "#4a1d6a",
    isPrivate: false,
    tags: ["innovation"],
    memberCount: 15,
    leads: [
      { name: "User1", avatar: "https://i.pravatar.cc/40?img=10", type: "person" },
      { name: "User2", avatar: "https://i.pravatar.cc/40?img=12", type: "person" },
      { name: "User3", avatar: "https://i.pravatar.cc/40?img=14", type: "person" },
    ],
  },
  {
    id: "4",
    slug: "slimme-mobiliteit",
    name: "Slimme Mobiliteit",
    description: "Samen werken aan slimme en duurzame mobiliteitsoplossingen voor gemeenten...",
    bannerImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "SM",
    avatarColor: "#1a5276",
    isPrivate: false,
    tags: ["mobiliteit", "smart city"],
    memberCount: 34,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=15", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "5",
    slug: "open-data-gemeenten",
    name: "Open Data Gemeenten",
    description: "Het delen en hergebruiken van open data tussen gemeenten voor betere dienst...",
    bannerImage: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "OD",
    avatarColor: "#117a65",
    isPrivate: false,
    tags: ["open data", "transparantie"],
    memberCount: 56,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=20", type: "person" },
      { name: "User2", avatar: "https://i.pravatar.cc/40?img=22", type: "person" },
    ],
  },
  {
    id: "6",
    slug: "energietransitie",
    name: "Energietransitie",
    description: "Gemeenten op weg naar een duurzame energievoorziening: warmtenetten, zon en...",
    bannerImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "ET",
    avatarColor: "#b7950b",
    isPrivate: false,
    tags: ["energie", "duurzaamheid"],
    memberCount: 63,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=25", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
      { name: "User3", avatar: "https://i.pravatar.cc/40?img=27", type: "person" },
    ],
  },
  {
    id: "7",
    slug: "digitale-inclusie",
    name: "Digitale Inclusie",
    description: "Zorgen dat alle inwoners mee kunnen doen in de digitale samenleving...",
    bannerImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "DI",
    avatarColor: "#6c3483",
    isPrivate: true,
    tags: ["inclusie", "toegankelijkheid"],
    memberCount: 21,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=30", type: "person" },
    ],
  },
  {
    id: "8",
    slug: "omgevingswet-implementatie",
    name: "Omgevingswet Implementatie",
    description: "Samenwerking rondom de invoering van de Omgevingswet en digitale dienstverlening...",
    bannerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "OI",
    avatarColor: "#1b4f72",
    isPrivate: false,
    tags: ["omgevingswet", "regelgeving"],
    memberCount: 47,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=33", type: "person" },
      { name: "User2", avatar: "https://i.pravatar.cc/40?img=35", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "9",
    slug: "cybersecurity-gemeenten",
    name: "Cybersecurity Gemeenten",
    description: "Kennisdeling en samenwerking op het gebied van informatiebeveiliging...",
    bannerImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "CG",
    avatarColor: "#1c2833",
    isPrivate: true,
    tags: ["security", "privacy"],
    memberCount: 38,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=40", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "10",
    slug: "smart-cities-nl",
    name: "Smart Cities NL",
    description: "Innovatieve technologie voor slimme steden en gemeenten in Nederland...",
    bannerImage: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "SC",
    avatarColor: "#2e86c1",
    isPrivate: false,
    tags: ["smart city", "IoT"],
    memberCount: 52,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=42", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "11",
    slug: "datagedreven-beleid",
    name: "Datagedreven Beleid",
    description: "Data-analyse inzetten voor effectiever gemeentelijk beleid en besluitvorming...",
    bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "DB",
    avatarColor: "#1a5276",
    isPrivate: false,
    tags: ["data", "beleid"],
    memberCount: 31,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=44", type: "person" },
    ],
  },
  {
    id: "12",
    slug: "burgerparticipatie",
    name: "Burgerparticipatie",
    description: "Nieuwe vormen van inwonerbetrokkenheid bij gemeentelijke besluitvorming...",
    bannerImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "BP",
    avatarColor: "#7d3c98",
    isPrivate: false,
    tags: ["participatie", "democratie"],
    memberCount: 44,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=46", type: "person" },
      { name: "User2", avatar: "https://i.pravatar.cc/40?img=48", type: "person" },
    ],
  },
  {
    id: "13",
    slug: "circulaire-economie",
    name: "Circulaire Economie",
    description: "Transitie naar een circulaire economie in gemeenten: afvalreductie en hergebruik...",
    bannerImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "CE",
    avatarColor: "#1e8449",
    isPrivate: false,
    tags: ["circulair", "duurzaamheid"],
    memberCount: 29,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=50", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "14",
    slug: "wonen-en-bouwen",
    name: "Wonen en Bouwen",
    description: "Samenwerking aan de woningcrisis: innovatieve bouwoplossingen en vergunningsprocessen...",
    bannerImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "WB",
    avatarColor: "#b9770e",
    isPrivate: false,
    tags: ["wonen", "bouw"],
    memberCount: 67,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=52", type: "person" },
    ],
  },
  {
    id: "15",
    slug: "digitale-dienstverlening",
    name: "Digitale Dienstverlening",
    description: "Betere digitale dienstverlening aan inwoners en ondernemers...",
    bannerImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "DD",
    avatarColor: "#2874a6",
    isPrivate: false,
    tags: ["dienstverlening", "digitaal"],
    memberCount: 55,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=54", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "16",
    slug: "klimaatadaptatie",
    name: "Klimaatadaptatie",
    description: "Gemeenten voorbereiden op klimaatverandering: hittestress, wateroverlast en droogte...",
    bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "KA",
    avatarColor: "#1abc9c",
    isPrivate: false,
    tags: ["klimaat", "adaptatie"],
    memberCount: 41,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=56", type: "person" },
    ],
  },
  {
    id: "17",
    slug: "ai-in-de-gemeente",
    name: "AI in de Gemeente",
    description: "Verantwoorde inzet van kunstmatige intelligentie bij gemeentelijke processen...",
    bannerImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "AI",
    avatarColor: "#5b2c6f",
    isPrivate: true,
    tags: ["AI", "automatisering"],
    memberCount: 36,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=58", type: "person" },
      { name: "User2", avatar: "https://i.pravatar.cc/40?img=60", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "18",
    slug: "gezonde-leefomgeving",
    name: "Gezonde Leefomgeving",
    description: "Bevorderen van een gezonde woon- en leefomgeving in gemeenten...",
    bannerImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "GL",
    avatarColor: "#27ae60",
    isPrivate: false,
    tags: ["gezondheid", "leefomgeving"],
    memberCount: 23,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=62", type: "person" },
    ],
  },
  {
    id: "19",
    slug: "open-source-gemeenten",
    name: "Open Source Gemeenten",
    description: "Samenwerking aan open source software voor en door gemeenten...",
    bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "OS",
    avatarColor: "#2c3e50",
    isPrivate: false,
    tags: ["open source", "software"],
    memberCount: 48,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=64", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "20",
    slug: "jeugdzorg-innovatie",
    name: "Jeugdzorg Innovatie",
    description: "Vernieuwing in de jeugdzorg: betere hulpverlening en preventie...",
    bannerImage: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "JI",
    avatarColor: "#e74c3c",
    isPrivate: false,
    tags: ["jeugdzorg", "sociaal domein"],
    memberCount: 32,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=66", type: "person" },
    ],
  },
  {
    id: "21",
    slug: "blockchain-overheid",
    name: "Blockchain & Overheid",
    description: "Toepassingen van blockchain-technologie bij gemeentelijke processen...",
    bannerImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "BO",
    avatarColor: "#6c3483",
    isPrivate: true,
    tags: ["blockchain", "technologie"],
    memberCount: 18,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=68", type: "person" },
    ],
  },
  {
    id: "22",
    slug: "schuldhulpverlening",
    name: "Schuldhulpverlening",
    description: "Innovatieve aanpak van schuldenproblematiek door gemeenten...",
    bannerImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "SH",
    avatarColor: "#d35400",
    isPrivate: false,
    tags: ["sociaal domein", "schulden"],
    memberCount: 27,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=70", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
  {
    id: "23",
    slug: "verkeer-en-vervoer",
    name: "Verkeer en Vervoer",
    description: "Slimme oplossingen voor verkeersdoorstroming en openbaar vervoer...",
    bannerImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "VV",
    avatarColor: "#154360",
    isPrivate: false,
    tags: ["verkeer", "mobiliteit"],
    memberCount: 39,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=72", type: "person" },
    ],
  },
  {
    id: "24",
    slug: "groene-gemeenten",
    name: "Groene Gemeenten",
    description: "Vergroening van de openbare ruimte en biodiversiteit in gemeenten...",
    bannerImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "GG",
    avatarColor: "#196f3d",
    isPrivate: false,
    tags: ["groen", "biodiversiteit"],
    memberCount: 35,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=74", type: "person" },
      { name: "User2", avatar: "https://i.pravatar.cc/40?img=76", type: "person" },
    ],
  },
  {
    id: "25",
    slug: "publieke-waarden-digitalisering",
    name: "Publieke Waarden & Digitalisering",
    description: "Ethische digitalisering met oog voor publieke waarden en mensenrechten...",
    bannerImage: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "PW",
    avatarColor: "#7b241c",
    isPrivate: false,
    tags: ["ethiek", "digitalisering"],
    memberCount: 22,
    leads: [
      { name: "User", avatar: "https://i.pravatar.cc/40?img=78", type: "person" },
      { name: "VNG", avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/VNG_logo.svg/40px-VNG_logo.svg.png", type: "org" },
    ],
  },
];

/* ─── Innovation Hub Page ─── */
const BATCH_SIZE = 12;
type PrivacyFilter = "all" | "public" | "private";

export default function InnovationHubPage() {
  const isAdmin = true; // For prototype purposes
  const [searchQuery, setSearchQuery] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyFilter>("all");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredSpaces = useMemo(() => {
    let result = [...hubSpaces];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (privacyFilter === "public") result = result.filter((s) => !s.isPrivate);
    if (privacyFilter === "private") result = result.filter((s) => s.isPrivate);

    return result;
  }, [searchQuery, privacyFilter]);

  const displayedSpaces = filteredSpaces.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSpaces.length;
  const activeFilterCount = privacyFilter !== "all" ? 1 : 0;

  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + BATCH_SIZE);
      setIsLoadingMore(false);
    }, 600);
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setPrivacyFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Banner (same as Space variant 1: grid-based, aspect 6/1) ── */}
      <div
        className="w-full"
        style={{ marginTop: "-64px", paddingLeft: 32, paddingRight: 32 }}
      >
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10">
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "6 / 1", width: "100%" }}
            >
              <img
                src={hubData.bannerImage}
                alt={hubData.name}
                className="w-full h-full object-cover"
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Bar (title + tagline below banner, like SpaceHeader) ── */}
      <div
        className="w-full"
        style={{ paddingLeft: 32, paddingRight: 32, paddingTop: 32, paddingBottom: 24 }}
      >
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h1
                className="text-foreground font-bold tracking-tight"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2 }}
              >
                {hubData.name}
              </h1>
              {isAdmin && (
                <Link
                  to={`/innovation-hub/${hubData.slug}/settings`}
                  className="p-2 rounded-lg transition-colors hover:bg-accent"
                  style={{ color: "var(--muted-foreground)" }}
                  title="Hub settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>
              )}
            </div>
            <p
              className="text-muted-foreground italic"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.4 }}
            >
              {hubData.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content area (12-col grid, col-start-2 col-span-10) ── */}
      <div className="w-full pb-12" style={{ paddingLeft: 32, paddingRight: 32 }}>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10 flex flex-col gap-8">

      {/* ── Description Block ── */}
      <div>
        <div
          className="text-caption"
          style={{
            color: "var(--muted-foreground)",
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: hubData.description }}
        />
      </div>

      {/* ── Spaces Section ── */}
      <div>
        {/* Search & Filter Bar (same as Explore Spaces) */}
        <div
          className="flex flex-col sm:flex-row gap-3"
          style={{ marginBottom: 24 }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: 14,
                width: 16,
                height: 16,
                color: "var(--muted-foreground)",
              }}
            />
            <Input
              placeholder="Search spaces..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(BATCH_SIZE);
              }}
              className="text-body"
              style={{
                paddingLeft: 40,
                height: 40,
                background: "var(--input-background)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--foreground)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setVisibleCount(BATCH_SIZE);
                }}
                className="absolute top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
                style={{ right: 10, color: "var(--muted-foreground)" }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>

          {/* Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 text-control"
                style={{
                  height: 40,
                  borderRadius: "var(--radius)",
                  color: activeFilterCount > 0 ? "var(--primary)" : "var(--foreground)",
                  borderColor: activeFilterCount > 0 ? "var(--primary)" : "var(--border)",
                }}
              >
                <SlidersHorizontal style={{ width: 14, height: 14 }} />
                Filters
                {activeFilterCount > 0 && (
                  <Badge
                    className="text-badge font-normal"
                    style={{
                      padding: "0 5px",
                      height: 18,
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      borderRadius: "999px",
                      marginLeft: 2,
                    }}
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ minWidth: 200 }}>
              <DropdownMenuLabel
                className="text-badge font-bold uppercase"
                style={{
                  letterSpacing: "0.08em",
                  color: "var(--muted-foreground)",
                }}
              >
                Privacy
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={privacyFilter === "all"}
                onCheckedChange={() => setPrivacyFilter("all")}
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={privacyFilter === "public"}
                onCheckedChange={() => setPrivacyFilter("public")}
              >
                Public only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={privacyFilter === "private"}
                onCheckedChange={() => setPrivacyFilter("private")}
              >
                Private only
              </DropdownMenuCheckboxItem>
              {activeFilterCount > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div style={{ padding: "4px 8px" }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="w-full justify-start gap-2 text-control"
                      style={{
                        color: "var(--destructive)",
                        height: 32,
                      }}
                    >
                      <X style={{ width: 12, height: 12 }} />
                      Clear all filters
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active filter chips */}
        {(activeFilterCount > 0 || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 16 }}>
            {searchQuery && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer text-caption font-normal"
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "var(--secondary)",
                  color: "var(--secondary-foreground)",
                }}
                onClick={() => setSearchQuery("")}
              >
                Search: &quot;{searchQuery}&quot;
                <X style={{ width: 10, height: 10 }} />
              </Badge>
            )}
            {privacyFilter !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer text-caption font-normal"
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "var(--secondary)",
                  color: "var(--secondary-foreground)",
                }}
                onClick={() => setPrivacyFilter("all")}
              >
                {privacyFilter === "public" ? "Public" : "Private"}
                <X style={{ width: 10, height: 10 }} />
              </Badge>
            )}
          </div>
        )}

        {/* Results count */}
        <div
          className="flex items-center justify-between"
          style={{ marginBottom: 16 }}
        >
          <p
            className="text-body"
            style={{ color: "var(--muted-foreground)" }}
          >
            Showing{" "}
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
              {displayedSpaces.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
              {filteredSpaces.length}
            </span>{" "}
            spaces
          </p>
        </div>

        {/* Space Card Grid */}
        {displayedSpaces.length > 0 ? (
          <>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {displayedSpaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}

              {isLoadingMore &&
                Array.from({ length: Math.min(BATCH_SIZE, filteredSpaces.length - visibleCount) }).map(
                  (_, i) => <SpaceCardSkeleton key={`skel-${i}`} />
                )}
            </div>

            {/* Load More */}
            {hasMore && !isLoadingMore && (
              <div
                className="flex flex-col items-center"
                style={{ marginTop: 32 }}
              >
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  className="gap-2 text-control"
                  style={{
                    height: 40,
                    paddingLeft: 24,
                    paddingRight: 24,
                    borderRadius: "var(--radius)",
                  }}
                >
                  <ChevronDown style={{ width: 16, height: 16 }} />
                  Load more spaces
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{
              padding: "64px 24px",
              border: "1px dashed var(--border)",
              borderRadius: "calc(var(--radius) + 4px)",
              background: "var(--muted)",
            }}
          >
            <FolderOpen
              style={{
                width: 40,
                height: 40,
                color: "var(--muted-foreground)",
                opacity: 0.5,
                marginBottom: 12,
              }}
            />
            <h3
              className="text-subheader font-semibold"
              style={{
                color: "var(--foreground)",
                marginBottom: 4,
              }}
            >
              No spaces found
            </h3>
            <p
              className="text-body"
              style={{
                color: "var(--muted-foreground)",
                maxWidth: 360,
                marginBottom: 16,
              }}
            >
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="gap-2 text-control"
            >
              <X style={{ width: 14, height: 14 }} />
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* ── CTA Banner ── */}
      <div>
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ color: "var(--muted-foreground)" }}
        >
          <div className="shrink-0 w-4 h-4">
            <AlkemioSymbolSquare />
          </div>
          <p style={{ fontSize: "var(--text-caption)" }}>
            Interested in other Spaces?{" "}
            <Link
              to="/spaces"
              className="underline underline-offset-2 hover:opacity-80"
              style={{ color: "var(--muted-foreground)" }}
            >
              Browse all Spaces on Alkemio
            </Link>
          </p>
        </div>
      </div>

          </div>
        </div>
      </div>

      {/* ── Footer ── */}
    </div>
  );
}
