import { useNavigate } from "react-router";
import { InnovationHubHome } from "@/crd/components/innovationHub/InnovationHubHome";
import { toSpaceCard, type MockSpaceCard } from "@/app/mappers/spaceCard";
import { toPackCard, toVirtualContributorCard } from "@/app/mappers/innovationHub";

const hubData = {
  slug: "vng-innovation-hub",
  name: "VNG Innovation Hub",
  tagline: "innovatie met en door de gemeentes",
  bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  description: `De <strong>open innovatiehub</strong> voor <strong>samenwerking tussen en voor de gemeentes</strong> in Nederland.<br/>Hier vind je communities die werken aan nieuwe vormen van publieke dienstverlening die aansluiten bij de leefwereld van mensen.<br/>Een plek waar de <strong>overheid, markt, wetenschap</strong> en <strong>samenleving</strong> samen kunnen werken aan <em>maatschappelijke missies</em>.`
};

const hubSpaces: MockSpaceCard[] = [
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  },
];

/* ─── VNG Template Packs ─── */
const hubPacks = [
  {
    id: "p1",
    name: "Gemeentelijk Innovatie Pack",
    description: "Templates voor het opzetten van innovatieprojecten binnen gemeenten: van idee tot implementatie.",
    templateCount: 8,
    image: "https://images.unsplash.com/photo-1554103210-26d928978fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "GI",
    color: "bg-blue-100 text-blue-700",
    tags: ["innovatie", "gemeenten", "processen"]
  },
  {
    id: "p2",
    name: "Digitale Transformatie Toolkit",
    description: "Alles voor de digitale transformatie: roadmaps, assessments en implementatieplannen.",
    templateCount: 12,
    image: "https://images.unsplash.com/photo-1631203924388-644782a70944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "DT",
    color: "bg-green-100 text-green-700",
    tags: ["digitaal", "transformatie", "strategie"]
  },
  {
    id: "p3",
    name: "Burgerparticipatie Methoden",
    description: "Bewezen methoden voor het betrekken van inwoners bij beleidsontwikkeling.",
    templateCount: 6,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "BP",
    color: "bg-purple-100 text-purple-700",
    tags: ["participatie", "inwoners", "beleid"]
  },
  {
    id: "p4",
    name: "Data Governance Framework",
    description: "Kaders en templates voor verantwoord databeheer en data-ethiek binnen de overheid.",
    templateCount: 5,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    initials: "DG",
    color: "bg-orange-100 text-orange-700",
    tags: ["data", "governance", "ethiek"]
  },
];

/* ─── VNG Virtual Contributors ─── */
const hubVCs = [
  {
    id: "vc1",
    name: "VNG Kennisassistent",
    description: "AI-assistent gespecialiseerd in gemeentelijke regelgeving, VNG-resoluties en best practices.",
    avatar: null,
    initials: "VK",
    tags: ["kennisbank", "regelgeving"]
  },
  {
    id: "vc2",
    name: "Subsidie Navigator",
    description: "Helpt gemeenten bij het vinden en aanvragen van relevante subsidies en fondsen.",
    avatar: null,
    initials: "SN",
    tags: ["subsidies", "financiering"]
  },
  {
    id: "vc3",
    name: "Data Analyst Bot",
    description: "Automatische analyse van gemeentelijke datasets en generatie van inzichten en rapportages.",
    avatar: null,
    initials: "DA",
    tags: ["data", "analyse", "rapportage"]
  },
  {
    id: "vc4",
    name: "Inkoop Adviseur",
    description: "Ondersteunt bij aanbestedingen en inkooptrajecten conform gemeentelijke richtlijnen.",
    avatar: null,
    initials: "IA",
    tags: ["inkoop", "aanbesteding"]
  },
  {
    id: "vc5",
    name: "Communicatie Coach",
    description: "Helpt bij het schrijven van heldere inwonercommunicatie en beleidsteksten.",
    avatar: null,
    initials: "CC",
    tags: ["communicatie", "tekst"]
  },
  {
    id: "vc6",
    name: "Privacy Officer Bot",
    description: "Adviseert over AVG-compliance, DPIA's en privacybeleid voor gemeentelijke systemen.",
    avatar: null,
    initials: "PO",
    tags: ["privacy", "AVG", "compliance"]
  },
];

/* ─── Innovation Hub Page ─── */
/**
 * Innovation hub — production's `@/crd/components/innovationHub/InnovationHubHome`.
 *
 * CRD owns the banner, the hub header with its description, and the three
 * curated sections (Spaces, Innovation Packs, Virtual Contributors), each of
 * which hides itself when empty. This file is the prototype's fixtures plus the
 * mapping to CRD's exported card types.
 *
 * Nothing was lost in the conversion: the page's search box, privacy filter and
 * 12-at-a-time batching over the Spaces list all exist inside CRD's
 * `HubSpacesSection` — same batch size, same filter states. The prototype had
 * reimplemented them, which is exactly the duplication this branch removes.
 */
export default function InnovationHubPage() {
  const navigate = useNavigate();

  return (
    <InnovationHubHome
      data={{
        name: hubData.name,
        tagline: hubData.tagline,
        description: hubData.description,
        bannerImageUrl: hubData.bannerImage,
        bannerColor: "#1d384a",
        bannerAlt: `${hubData.name} banner`,
        settingsUrl: `/innovation-hub/${hubData.slug}/settings`,
        allSpacesUrl: "/spaces",
      }}
      spaces={hubSpaces.map(space => toSpaceCard(space))}
      packs={hubPacks.map(toPackCard)}
      virtualContributors={hubVCs.map(toVirtualContributorCard)}
      onSettingsClick={() => navigate(`/innovation-hub/${hubData.slug}/settings`)}
    />
  );
}
