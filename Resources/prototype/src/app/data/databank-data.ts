/**
 * Mock data for the "Databank praktijkvoorbeelden" tab of the GemeenteDelers
 * space: nine example initiatives, each one a subspace.
 *
 * Ported from the hi-fi mockup "Versie 4: Lees meer als pill" (the CARDS
 * array), copy unchanged. Images were exported from that mockup into
 * `public/databank/`. No backend: in production these fields would come from
 * each subspace's About (name, tagline, banner, What/Why/Who, references),
 * its lead organisation, its tags and its classification values.
 */

export type DatabankBlock =
  | { kind: 'paragraph'; text: string }
  | { kind: 'labelValue'; label: string; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'video'; title: string; thumbnailUrl: string };

export type DatabankSection = {
  title: 'Wat' | 'Waarom' | 'Wie';
  blocks: DatabankBlock[];
};

export type DatabankInitiative = {
  id: string;
  name: string;
  tagline: string;
  /** The subspace this initiative lives in. */
  url: string;
  imageUrl: string;
  lead: { name: string; logoUrl: string };
  tags: string[];
  classifications: { label: string; values: string[] }[];
  sections: DatabankSection[];
  links: { name: string; url: string }[];
};

/** Facet groups in the order the sidebar shows them. Tags are free-form;
 *  the rest are classification labels. */
export const DATABANK_FACET_GROUPS = ['Tags', 'Thema', 'Global Goals', 'VNG 2030 thema', 'NDS-prioriteit'] as const;

export const DATABANK_SPACE = {
  title: 'Gemeentedelers',
  tagline: 'Wat werkt, delen we samen',
  bannerUrl: '/databank/banner.png',
  bannerAlt: 'GemeenteDelers banner: Van wedstrijd naar beweging. 300+ praktijkvoorbeelden van gemeenten, voor gemeenten',
  /** Width / height of the exported banner (1563 × 261). */
  bannerAspectRatio: 1563 / 261,
  welcome:
    '### Welkom in de GemeenteDelers-community\n\nDeze omgeving is dé plek waar gemeenten praktijkvoorbeelden met elkaar delen: wat werkte, waarom, en hoe je het zelf kunt hergebruiken.',
  leads: [
    { id: 'ellen-evers', name: 'Ellen Evers', initials: 'EE', avatarUrl: '/databank/lead-ellen-evers.png', location: 'Enschede', type: 'person' as const },
    { id: 'vng-kenniscentrum', name: 'VNG Kenniscentrum Innovatie', initials: 'VK', avatarUrl: '/databank/lead-vng-kenniscentrum.png', location: 'NL', type: 'org' as const },
  ],
};

export const DATABANK_INITIATIVES: DatabankInitiative[] = [
  {
    "id": "arnhem-aan-tafel",
    "name": "Arnhem Aan Tafel Kookboek",
    "tagline": "Een kookboek dat de energietransitie en duurzame voeding verbindt aan 'gewone mensen dingen'",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/arnhem-aan-tafel",
    "imageUrl": "/databank/arnhem-aan-tafel.png",
    "lead": {
      "name": "Gemeente Arnhem",
      "logoUrl": "/databank/arnhem-aan-tafel-logo.png"
    },
    "tags": [
      "2021"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Energietransitie"
        ]
      },
      {
        "label": "VNG 2030 thema",
        "values": [
          "Klimaat en energie"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Arnhem wil de bestaande meerjaren campagne en stadsbeweging ‘Arnhem Aan’(energietransitie) relevant maken voor een bredere èn inclusievere doelgroep. Enthousiasmeren, handelingsperspectief laten zien voor iedere Arnhemmer. In het huishouden/keuken daar gebeurt het!"
          },
          {
            "kind": "labelValue",
            "label": "Programma:",
            "text": "2021"
          },
          {
            "kind": "paragraph",
            "text": "Een duurzaam kookboek voor en door Arnhemmers. Het boek is bedoeld om een extra stimulans te geven aan de toch al levendige Arnhemse stadsbeweging als het gaat om duurzaam leven en koken. In het boek staan 30 heerlijke en eerlijke recepten. Wijken door heel Arnhem komen er in voor, zowel in beeld als met recepten van thuiskoks en chefs van Arnhemse restaurants. Bij elke thuiskok en chef staat de wijk vermeld, zo kun je makkelijk op de kaart zien wat er in een wijk speelt. Ook staan energieweetjes en (voedsel en energie-)besparingstips in het boek."
          },
          {
            "kind": "paragraph",
            "text": "De recepten worden als content wekelijks gepost op de Facebook- en Instagram pagina van ‘Arnhem Aan’, de overkoepelende bredere meer-jaren stadscampagne dat een communicatiemedium is ten behoeve van het Energietransitie Raadsprogramma 2020 – 2030"
          },
          {
            "kind": "paragraph",
            "text": "Met koks en recepten uit de Turkse, Marokkaanse, Nederlandse, Antilliaanse en nog meer keukens, zijn alle Arnhemmers vertegenwoordigd. Dat wil zeggen het is inclusief."
          },
          {
            "kind": "paragraph",
            "text": "De gekozen insteek is praktisch: het is een echt receptenboek (bladerbaar, ‘aanrechtblad-formaat’). Daardoor is het interessant voor een groter publiek dan diegenen die al op een of ander manier met de energietransitie bezig zijn."
          },
          {
            "kind": "paragraph",
            "text": "De ‘tone of voice’ is positief en niet belerend. Het gaat primair om koken. Door beeldgebruik en begeleidende teksten wordt met enthousiasme de al aanwezige coherente stadsbeweging uitgedragen (‘Arnhem Aan’). Ook organisaties als stadslandbouw en moestuinen krijgen aandacht en worden gelinked aan de huishoudens in de wijken (local for local). Door de focus op het koken, de tafel en de keuken te leggen ervaart men dat iedereen dagelijkse op een makkelijke manier bezig kan zijn met verduurzamen, lokale producten, energie besparen en voorkomen van voedselverspilling (handelingsperspectief)."
          },
          {
            "kind": "paragraph",
            "text": "In plaats van de gebruikelijke communicatie ‘energietransitie’ is het boek een middel om inwoners te verbinden aan dit thema met ‘gewone mensen dingen’."
          },
          {
            "kind": "paragraph",
            "text": "Het taalgebruik is op B1 niveau en door een lezerspanel (voor laag-geletterdheid) op niveau gebracht."
          },
          {
            "kind": "paragraph",
            "text": "Gemeentelijke thema’s: inclusiviteit, meedoen in de stad, energietransitie, energiearmoede, voorkomen voedselverspilling, stadslandbouw en wijkgericht werken."
          },
          {
            "kind": "paragraph",
            "text": "De boeken zijn opgeleverd juni 2021 met een goed bezocht event op een stadslandbouw-boerderij. De lokale media, De Gelderlander, heeft uitgebreid aandacht besteed (spread op zaterdag). Inmiddels zijn bijna 4.000 boeken door de stad gedistribueerd via ‘De Groene Rijders’ o.a. gratis te verkrijgen bij de deelnemende partijen en andere publieke locaties zoals de Voedselbank, Buurtcentra etc.."
          },
          {
            "kind": "paragraph",
            "text": "Er is ook een samenwerking tot stand gekomen tussen de partijen die een bijdrage hebben geleverd aan het boek. Deze samenwerking heeft Koninklijke Horeca afdeling Arnhem, Renkum geïnspireerd om een vervolgplan te maken rondom stadsdistributie en duurzame voeding."
          },
          {
            "kind": "paragraph",
            "text": "Het idee, concept en format van het boek is beschreven in een projectplan. Zowel dit als de ontwerpen kunnen gemakkelijk worden hergebruikt. Concept=Kookboek met recepten gemaakt voor en door de inwoners en restaurants."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Arnhem wil de bestaande meerjaren campagne en stadsbeweging ‘Arnhem Aan’(energietransitie) relevant maken voor een bredere èn inclusievere doelgroep. Enthousiasmeren, handelingsperspectief laten zien voor iedere Arnhemmer."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan energietransitie en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          },
          {
            "kind": "labelValue",
            "label": "Deelnemende gemeente:",
            "text": "Arnhem"
          }
        ]
      }
    ],
    "links": [
      {
        "name": "Arnhem Aan Tafel Kookboek - VNG praktijkvoorbeelden",
        "url": "https://vng.nl/praktijkvoorbeelden/arnhem-aan-tafel-kookboek"
      },
      {
        "name": "Warmte van en voor de buren",
        "url": "https://vng.nl/praktijkvoorbeelden/warmte-van-en-voor-de-buren"
      },
      {
        "name": "Slim Strandnet: het elektriciteitsnet van de toekomst",
        "url": "https://vng.nl/praktijkvoorbeelden/slim-strandnet-het-elektriciteitsnet-van-de-toekomst"
      },
      {
        "name": "Klusbus Eindhoven",
        "url": "https://vng.nl/praktijkvoorbeelden/klusbus-eindhoven"
      },
      {
        "name": "Erfgoed Deal: inspiratie en voorbeelden voor ruimtelijke transities",
        "url": "https://vng.nl/praktijkvoorbeelden/erfgoed-deal-inspiratie-en-voorbeelden-voor-ruimtelijke-transities"
      },
      {
        "name": "Website VNG GemeenteDelers",
        "url": "https://vng.nl/gemeentedelers"
      }
    ]
  },
  {
    "id": "warmte",
    "name": "Warmte van en voor de buren",
    "tagline": "Warmte uit het eigen rioolwater, opgewaardeerd in wijkwarmtecentrales tot 70 graden voor slecht geïsoleerde woningen",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/warmte",
    "imageUrl": "/databank/warmte.png",
    "lead": {
      "name": "Gemeente Deventer",
      "logoUrl": "/databank/warmte-logo.png"
    },
    "tags": [
      "2025",
      "Kanshebber"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Dienstverlening en bedrijfsvoering van gemeenten",
          "Energietransitie",
          "Energiesystemen",
          "Verduurzaming gebouwde omgeving",
          "Dienstverlening aan inwoners en ondernemers"
        ]
      },
      {
        "label": "VNG 2030 thema",
        "values": [
          "Klimaat en energie"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Het kerndoel van de gemeente Deventer is bewoners een duurzame en betaalbare energievoorziening te geven. En dit moet ook nog uitlegbaar zijn aan bewoners."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Via aquathermie (warmte uit rioolwater) wordt duurzame warmte geleverd (ook rioolwater van de wijk zelf). In meerdere wijkwarmtecentrales wordt deze warmte naar 70 graden gebracht (= betaalbare warmte voor oudere volkswijken met slecht geïsoleerde woningen)."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan dienstverlening en bedrijfsvoering van gemeenten, energietransitie en energiesystemen en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          }
        ]
      }
    ],
    "links": []
  },
  {
    "id": "masterclass-klooien",
    "name": "Masterclass Klooien en Prutsen",
    "tagline": "Een masterclass van een maand waarin collega's leren vastgeroeste vraagstukken heel anders aan te pakken",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/masterclass-klooien",
    "imageUrl": "/databank/masterclass-klooien.png",
    "lead": {
      "name": "Gemeente Heusden",
      "logoUrl": "/databank/masterclass-klooien-logo.png"
    },
    "tags": [
      "2020"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Ruimte, wonen en mobiliteit",
          "Bouwregelgeving"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Collega's op weg helpen om innovatief en 'out of the box' naar (maatschappelijke) opgaven te kijken."
          },
          {
            "kind": "video",
            "title": "Masterclass Klooien en Prutsen",
            "thumbnailUrl": "/databank/video-masterclass-klooien.jpg"
          },
          {
            "kind": "labelValue",
            "label": "Programma:",
            "text": "2020"
          },
          {
            "kind": "subheading",
            "text": "Herbruikbaar"
          },
          {
            "kind": "paragraph",
            "text": "Een masterclass helpt je anders denken, ander kijken naar zaken, buiten je comfort treden. Het heeft een kop en een start en in een maand tijd je kunt er ambassadeurs mee kweken voor je organisatie. De werkwijze kun je in ieder gemeente toepassen. Je moet openstaan voor nieuwe innovatieve minder voor handliggende paden."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Vastgeroeste routines leveren vastgeroeste oplossingen op. Deze masterclass geeft medewerkers in korte tijd een andere manier van kijken, zodat alledaagse opgaven — van zwerfafval tot basisregistratie — met nieuwe ogen worden aangepakt."
          },
          {
            "kind": "subheading",
            "text": "Doel"
          },
          {
            "kind": "paragraph",
            "text": "Collega's hebben geleerd om op een hele andere manier naar vraagstukken te kijken. Tijdens de masterclass zijn de onderwerpen zwerfafval, informatievragen klant, basisregistratie adressen en gebouwen en speeltoestellen aan bod gekomen. Op deze 4 onderwerpen zijn oplossingen bedacht die niet voor de hand liggen en heel doeltreffend lijken."
          },
          {
            "kind": "paragraph",
            "text": "Een vraagstuk zoals: hoe om te gaan met grote hoeveelheid speeltoestellen en geringe onderhoudsbudget leidde tot het idee van een nieuw 'speelconcept voor jong en oud, gekoppeld aan andere beleidsvelden en vermengd met de digitale wereld van de jongeren'"
          },
          {
            "kind": "paragraph",
            "text": "Door als gemeente uit je comfortzone te stappen zie en verken je oplossingen die je normaal gesproken niet kunt bedenken Zo kom je op hele mooie concepten, denk je niet vanuit de beperkende kaders. De geleerde werkwijze 'Klooien en prutsen' (innovatief denken) wordt nu verder op andere vraagstukken zoals datagedreven werken en omgevingswet toegepast."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor gemeentelijke professionals die collega’s willen leren anders naar vraagstukken te kijken, en voor teams die innovatie niet als project maar als werkhouding willen ontwikkelen. Ook bruikbaar voor wie ambassadeurs voor vernieuwing zoekt binnen de eigen organisatie."
          },
          {
            "kind": "labelValue",
            "label": "Deelnemende gemeente:",
            "text": "Heusden"
          }
        ]
      }
    ],
    "links": [
      {
        "name": "Masterclass Klooien en Prutsen - VNG praktijkvoorbeelden",
        "url": "https://vng.nl/praktijkvoorbeelden/masterclass-klooien-en-prutsen"
      },
      {
        "name": "Project FIETS",
        "url": "https://vng.nl/praktijkvoorbeelden/project-fiets"
      },
      {
        "name": "Klimaatpanel Utrecht zorgt voor verbinding inwoners en gemeente",
        "url": "https://vng.nl/praktijkvoorbeelden/klimaatpanel-utrecht-zorgt-voor-verbinding-inwoners-en-gemeente"
      },
      {
        "name": "Loslaten en vastpakken in het Singelpark",
        "url": "https://vng.nl/praktijkvoorbeelden/loslaten-en-vastpakken-in-het-singelpark"
      },
      {
        "name": "Erfgoed Deal: inspiratie en voorbeelden voor ruimtelijke transities",
        "url": "https://vng.nl/praktijkvoorbeelden/erfgoed-deal-inspiratie-en-voorbeelden-voor-ruimtelijke-transities"
      },
      {
        "name": "Website GemeenteDelers",
        "url": "https://vng.nl/gemeentedelers"
      }
    ]
  },
  {
    "id": "jouw-maatje",
    "name": "MAAT: raadsinformatie vinden met AI",
    "tagline": "MAAT doorzoekt met AI ook de video- en audiofragmenten van raadsvergaderingen, niet alleen de documenten",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/jouw-maatje",
    "imageUrl": "/databank/jouw-maatje.png",
    "lead": {
      "name": "Gemeente Enschede",
      "logoUrl": "/databank/jouw-maatje-logo.png"
    },
    "tags": [
      "2025"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Dienstverlening en bedrijfsvoering van gemeenten"
        ]
      },
      {
        "label": "Global Goals",
        "values": [
          "SDG 9 — Industry, Innovation and Infrastructure",
          "SDG 10 — Reduced Inequalities",
          "SDG 11 — Sustainable Cities and Communities",
          "SDG 16 — Peace, Justice and Strong Institutions"
        ]
      },
      {
        "label": "NDS-prioriteit",
        "values": [
          "Artificiële Intelligentie"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Onderzoek van Nieuwsuur toont aan dat bijna de helft(!) van de Nederlandse gemeenten haar inwoners gebrekkig informeert. Ook raadsleden kunnen moeilijk de relevante informatie vinden om hun controlerende taak goed uit te voeren. Met MAAT kan dit verbeterd worden!MAAT is een AI-gebaseerde tool voor het vinden van relevante informatie. Met behulp van Artificial Intelligence (AI) doorzoekt MAAT documenten, video- en audiofragmenten van (raads-)vergaderingen. Door de AI in MAAT worden niet alleen exacte matches gevonden zoals bij normale zoekfunctionaliteiten in raadsinformatiesystemen, maar ook contextueel relevante informatie (b.v. synoniemen). Ook worden automatisch transcripten gemaakt van vergaderingen, zodat precies teruggevonden en beluisterd kan worden wanneer iets gezegd is. Via een handige interface maakt een inwoner of raadslid hiervan een tijdlijn of dossier en exporteert deze. Binnen het dossier kan met generatieve AI automatisch een samenvatting gemaakt worden en/of specifieke vragen beantwoord worden. Kortom: een handig verlengstuk voor raadsleden en griffies om hun taken uit te voeren en een tool die gemeenten naar het juiste niveau van WOO tilt naar haar inwoners!"
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Deze casus is succesvol omdat MAAT het probleem zoals beschreven door Nieuwsuur oplost. MAAT is een innovatieve oplossing voor een veelvoorkomend probleem binnen gemeenteraden: het efficiënt en volledig vinden van raadsinformatie."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan dienstverlening en bedrijfsvoering van gemeenten en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          }
        ]
      }
    ],
    "links": []
  },
  {
    "id": "wijkgerichte-armoede",
    "name": "Wijkgerichte Armoede Aanpak in Laak (WAAL)",
    "tagline": "45 loketten, kerken, moskeeën en buurthuizen in één netwerk, zodat een bewoner meteen bij het juiste loket komt",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/wijkgerichte-armoede",
    "imageUrl": "/databank/wijkgerichte-armoede.png",
    "lead": {
      "name": "Gemeente 's-Gravenhage",
      "logoUrl": "/databank/wijkgerichte-armoede-logo.png"
    },
    "tags": [
      "2025"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Sociaal domein breed"
        ]
      },
      {
        "label": "VNG 2030 thema",
        "values": [
          "Bestaanszekerheid"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Armoede bestrijden lukt niet alleen. In Laak wordt veel ondernomen door meer dan 50 verschillende organisaties en loketten (van de gemeente), vaak zonder elkaars medeweten. In dit project brengt de gemeente al deze organisaties en hun activiteiten samen om samen meer impact te maken. Doordat elkaar te leren kennen en te vinden, wordt het makkelijker om de bewoners in de wijk (sneller) door te verwijzen zodat zij van de juiste en meer hulp gebruik kunnen maken. Doordat de gemeente elkaars bewonersnetwerk en krachten kan verbinden, zijn ze samen (beter) in staat om de nog onbekende bewoners te vinden en te helpen door samen activiteiten te organiseren, waar geen organisatie alleen toe in staat is. Zoals wijkbingo's (georganiseerd door 20+ van de aangesloten organisaties)."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Na een succesvolle pilot in het voorjaar van 2023 is het wijknetwerk nu een ankerpunt in de wijk. Inmiddels zijn er meer dan 15 kennisbijeenkomsten en bewonersactiviteiten georganiseerd om: \\- elkaar (beter) te leren kennen, \\- samen een beter begrip te krijgen over de bewoners in nood in de wijk en \\- bewoners met noodvragen direct bij het juiste loket te krijgen (mbv de groepsapp) \\- (on)bekende bewoners 'in beweging' te krijgen om hulp te aanvaarden."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan sociaal domein breed en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          }
        ]
      }
    ],
    "links": []
  },
  {
    "id": "voorschoolse",
    "name": "Voorschoolse Educatie in Beeld: Innovatieve Monitoring",
    "tagline": "Gegevens van jeugdgezondheidszorg en kinderopvang veilig gekoppeld zonder inzage, om het bereik van de voorschool te meten",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/voorschoolse",
    "imageUrl": "/databank/voorschoolse.png",
    "lead": {
      "name": "Gemeente Rotterdam",
      "logoUrl": "/databank/voorschoolse-logo.png"
    },
    "tags": [
      "2025"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Onderwijs"
        ]
      },
      {
        "label": "Global Goals",
        "values": [
          "SDG 1 — No Poverty",
          "SDG 3 — Good Health and Well-being",
          "SDG 4 — Quality Education",
          "SDG 10 — Reduced Inequalities",
          "SDG 11 — Sustainable Cities and Communities",
          "SDG 16 — Peace, Justice and Strong Institutions"
        ]
      },
      {
        "label": "VNG 2030 thema",
        "values": [
          "Kansengelijkheid/jeugd"
        ]
      },
      {
        "label": "NDS-prioriteit",
        "values": [
          "Data"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Meer dan 4600 peuters (1 op de 3) hebben een risico op ontwikkelachterstand in Rotterdam. Uit onderzoek blijkt dat deze achterstand nauwelijks wordt ingehaald in het basisonderwijs. De belangrijkste interventie, deelname aan voorschoolse educatie (VE), moet in peuterjaren plaatsvinden. De gemeente Rotterdam heeft hiervoor een innovatieve oplossing ontwikkeld om peuters te volgen en ondersteunen bij de educatieve ontwikkeling."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Hiermee kunnen gevoelige gegevens van Centrum Jeugd en Gezin veilig worden gecombineerd met informatie van kinderdagverblijven. De gemeente kan onderzoek doen zonder de gegevens van deze peuters in te zien."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan onderwijs en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          }
        ]
      }
    ],
    "links": []
  },
  {
    "id": "antwoord-op-maat",
    "name": "Antwoord op maat",
    "tagline": "De vraag van de inwoner meteen bij de plek brengen waar het goede antwoord ligt — zonder tussenstappen",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/antwoord-op-maat",
    "imageUrl": "/databank/antwoord-op-maat.png",
    "lead": {
      "name": "Gemeente Utrechtse Heuvelrug",
      "logoUrl": "/databank/antwoord-op-maat-logo.png"
    },
    "tags": [
      "2021"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Dienstverlening en bedrijfsvoering van gemeenten",
          "Dienstverlening aan inwoners en ondernemers"
        ]
      },
      {
        "label": "VNG 2030 thema",
        "values": [
          "Bedrijfsvoering & gemeentediensten"
        ]
      },
      {
        "label": "NDS-prioriteit",
        "values": [
          "Centrale (digitale) dienstverlening"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "De vraag van de inwoner zo snel mogelijk brengen bij de plek waar het goede antwoord is"
          },
          {
            "kind": "labelValue",
            "label": "Programma:",
            "text": "2021"
          },
          {
            "kind": "paragraph",
            "text": "Gemeente Utrechtse Heuvelrug wil door metingen en de ervaringen vanuit de bewoner/gebruiker hun werkprocessen anders inrichten en verbeteren. Zo is het mogelijk om een beter dienstverlening aan te bieden en door primair verbetering van de informatieverstrekking in het proces/werkwijzen, dat minimaal 25% minder telefoontjes bij het KCC binnenkomen."
          },
          {
            "kind": "paragraph",
            "text": "Bekend is waar mensen 'afhaken' en dat kan verbeterd worden. Als de burgers al op de website een antwoord op hun vragen kunnen krijgen, hoeven zij niet meer naar het KCC te bellen. Burgers worden naar de vakafdeling of de vakmedewerker doorgeleid."
          },
          {
            "kind": "paragraph",
            "text": "Voordelen zijn: niet meer één centrale ingang, maar ook decentrale ingangen. Situatie afhankelijk, vooraf al ingeregeld en toegankelijk. Alles is steeds in continue verbetering. Nabije overheid door nabije medewerkers."
          },
          {
            "kind": "paragraph",
            "text": "Er wordt regelmatig gemeten. Niet op basis van van wat je kunt meten, maar wat je nodig hebt om te weten. Dat verschuift gaandeweg, aan de hand van je eigen ontwikkeling. Het model die gebruikt wordt is voor anderen beschikbaar."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "De vraag van de inwoner zo snel mogelijk brengen bij de plek waar het goede antwoord is"
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan dienstverlening en bedrijfsvoering van gemeenten en dienstverlening aan inwoners en ondernemers en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          },
          {
            "kind": "labelValue",
            "label": "Deelnemende gemeente:",
            "text": "Utrechtse Heuvelrug"
          }
        ]
      }
    ],
    "links": [
      {
        "name": "Antwoord op maat - VNG praktijkvoorbeelden",
        "url": "https://vng.nl/praktijkvoorbeelden/antwoord-op-maat"
      },
      {
        "name": "Nieuwkomers naar Werk",
        "url": "https://vng.nl/praktijkvoorbeelden/nieuwkomers-naar-werk"
      },
      {
        "name": "De Zomerklas, een sprong vooruit!",
        "url": "https://vng.nl/praktijkvoorbeelden/de-zomerklas-een-sprong-vooruit"
      },
      {
        "name": "Beweeg Beleef Platform",
        "url": "https://vng.nl/praktijkvoorbeelden/beweeg-beleef-platform"
      },
      {
        "name": "Warmte van en voor de buren",
        "url": "https://vng.nl/praktijkvoorbeelden/warmte-van-en-voor-de-buren"
      },
      {
        "name": "Website VNG GemeenteDelers",
        "url": "https://vng.nl/gemeentedelers"
      }
    ]
  },
  {
    "id": "toegangsproces",
    "name": "Toegangsproces met de integrale kijk",
    "tagline": "Eén plek waar inwoners toegang hebben tot alle verschillende ondersteuningsmogelijkheden",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/toegangsproces",
    "imageUrl": "/databank/toegangsproces.png",
    "lead": {
      "name": "Gemeente Oosterhout",
      "logoUrl": "/databank/toegangsproces-logo.png"
    },
    "tags": [
      "2020"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Sociaal domein breed",
          "Project Toegang"
        ]
      },
      {
        "label": "VNG 2030 thema",
        "values": [
          "Bedrijfsvoering & gemeentediensten"
        ]
      },
      {
        "label": "NDS-prioriteit",
        "values": [
          "Centrale (digitale) dienstverlening"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Het verbetertraject toegang sociaal domein heeft als doel het inzichtelijk maken van de vrije toegang (voorliggende voorzieningen) en de gemeentelijke toegang en de inzet vanuit verschillende partijen hierin."
          },
          {
            "kind": "labelValue",
            "label": "Programma:",
            "text": "2020"
          },
          {
            "kind": "paragraph",
            "text": "Het verbetertraject toegang heeft geresulteerd in het wegzetten van een integrale frontoffice waarbij triage belangrijk is. Door dit op te nemen in de nieuwe visie op het sociaal domein en de visie op dienstverlening maakt dat er veel draagkracht is. Alles is gericht op goede ondersteuning voor de burgers."
          },
          {
            "kind": "subheading",
            "text": "Voordelen"
          },
          {
            "kind": "list",
            "items": [
              "De ervaring is dat burgers weten waar ze moeten zijn",
              "1 telefoonnummer waar ze terecht kunnen met al hun vragen over ondersteuning of begeleiding.",
              "WMO, Jeugd en Participatie werkt samen.",
              "Er is een grote bereikbaarheid en professionaliteit.",
              "Meer vragen gaan terug naar de voorliggende voorzieningen."
            ]
          },
          {
            "kind": "paragraph",
            "text": "Door het aanleggen van een goed management rapportage systeem ziet je sneller trends en ontwikkelingen waardoor aanpassing van het inzet mogelijk is. Hierdoor is de werkverdeling in balans en wordt de expertise op peil gehouden."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Het verbetertraject toegang sociaal domein heeft als doel het inzichtelijk maken van de vrije toegang (voorliggende voorzieningen) en de gemeentelijke toegang en de inzet vanuit verschillende partijen hierin."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan sociaal domein breed en project toegang en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          },
          {
            "kind": "labelValue",
            "label": "Deelnemende gemeente:",
            "text": "Oosterhout"
          }
        ]
      }
    ],
    "links": [
      {
        "name": "Toegangsproces met de integrale kijk - VNG praktijkvoorbeelden",
        "url": "https://vng.nl/praktijkvoorbeelden/toegangsproces-met-de-integrale-kijk"
      },
      {
        "name": "Zo borgt Meierijstad toegankelijkheid in de openbare ruimte",
        "url": "https://vng.nl/praktijkvoorbeelden/zo-borgt-meierijstad-toegankelijkheid-in-de-openbare-ruimte"
      },
      {
        "name": "Amersfoorts Toiletbeleid: kennisclip",
        "url": "https://vng.nl/praktijkvoorbeelden/amersfoorts-toiletbeleid-kennisclip"
      },
      {
        "name": "Groepsactiviteiten verbinden jongeren én hun ouders",
        "url": "https://vng.nl/praktijkvoorbeelden/groepsactiviteiten-verbinden-jongeren-en-hun-ouders"
      },
      {
        "name": "Vasthoudendheid als sleutel",
        "url": "https://vng.nl/praktijkvoorbeelden/vasthoudendheid-als-sleutel"
      },
      {
        "name": "Website VNG GemeenteDelers",
        "url": "https://vng.nl/gemeentedelers"
      }
    ]
  },
  {
    "id": "privacyvriendelijke",
    "name": "Privacyvriendelijke authenticatie",
    "tagline": "IRMA-app maakt inzichtelijk welke persoonsgegevens organisaties vragen voor het verlenen van een dienst aan burgers",
    "url": "https://acc-alkem.io/gemeentedelers/challenges/privacyvriendelijke",
    "imageUrl": "/databank/privacyvriendelijke.png",
    "lead": {
      "name": "Gemeente Nijmegen",
      "logoUrl": "/databank/privacyvriendelijke-logo.png"
    },
    "tags": [
      "2020"
    ],
    "classifications": [
      {
        "label": "Thema",
        "values": [
          "Informatiesamenleving",
          "Dienstverlening en bedrijfsvoering van gemeenten",
          "Dienstverlening aan inwoners en ondernemers"
        ]
      },
      {
        "label": "VNG 2030 thema",
        "values": [
          "Bedrijfsvoering & gemeentediensten"
        ]
      },
      {
        "label": "NDS-prioriteit",
        "values": [
          "Digitale weerbaarheid en autonomie"
        ]
      }
    ],
    "sections": [
      {
        "title": "Wat",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Nijmegen werkt met de IRMA-app (I Reveal My Attributes) waarmee digitale gegevens toegankelijker worden en burgers meer controle hebben over hun digitale identiteit."
          },
          {
            "kind": "labelValue",
            "label": "Programma:",
            "text": "2020"
          },
          {
            "kind": "subheading",
            "text": "Wat houdt IRMA in"
          },
          {
            "kind": "paragraph",
            "text": "Iedereen in Nederland kan zijn persoonsgegevens uit het basisregister downloaden naar de app IRMA. Die app:"
          },
          {
            "kind": "list",
            "items": [
              "minimaliseert persoonlijk gegevensgebruik (aanduiding 18+ in plaats van het BSN)",
              "stelt burgers in staat hun BRP-gegevens te gebruiken (regie op gegevens)",
              "is ook bij andere dan semi/overheid-organisaties bruikbaar."
            ]
          },
          {
            "kind": "paragraph",
            "text": "IRMA maakt voor burgers inzichtelijk welke gegevens een organisatie vraagt voor het verlenen van een dienst en het delen vraagt een actieve handeling. Er hoeft niet meer te worden verstrekt dan minimaal nodig is en organisaties hoeven minder persoonsgevoelige informatie op te slaan, verwerken en beheren. Voor organisaties betekent het een nieuwe betrouwbare en eenvoudige manier om burgers te kunnen authenticeren."
          },
          {
            "kind": "subheading",
            "text": "Interessant voor andere gemeenten"
          },
          {
            "kind": "paragraph",
            "text": "Voor het uitgeven van BRP-gegevens aan burgers is open source software ontwikkeld die eenvoudig en zonder kosten door andere organisaties is te gebruiken. De uitgifte wordt nu centraal gedaan zodat andere gemeenten geen eigen uitgifteproces hoeven in te richten en zich kunnen concentreren op de dienstverlening aan hun inwoners."
          }
        ]
      },
      {
        "title": "Waarom",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Wat houdt IRMA in Iedereen in Nederland kan zijn persoonsgegevens uit het basisregister downloaden naar de app IRMA."
          }
        ]
      },
      {
        "title": "Wie",
        "blocks": [
          {
            "kind": "paragraph",
            "text": "Voor professionals bij gemeenten die werken aan informatiesamenleving, dienstverlening en bedrijfsvoering van gemeenten en dienstverlening aan inwoners en ondernemers en dit voorbeeld in hun eigen organisatie willen hergebruiken, en voor inwoners en partners die er direct baat bij hebben."
          },
          {
            "kind": "labelValue",
            "label": "Deelnemende gemeente:",
            "text": "Nijmegen"
          }
        ]
      }
    ],
    "links": [
      {
        "name": "Privacyvriendelijke authenticatie door regie op eigen BRP-gegevens - VNG praktijkvoorbeelden",
        "url": "https://vng.nl/praktijkvoorbeelden/privacyvriendelijke-authenticatie-door-regie-op-eigen-brp-gegevens"
      },
      {
        "name": "Nieuwkomers naar Werk",
        "url": "https://vng.nl/praktijkvoorbeelden/nieuwkomers-naar-werk"
      },
      {
        "name": "De Zomerklas, een sprong vooruit!",
        "url": "https://vng.nl/praktijkvoorbeelden/de-zomerklas-een-sprong-vooruit"
      },
      {
        "name": "Beweeg Beleef Platform",
        "url": "https://vng.nl/praktijkvoorbeelden/beweeg-beleef-platform"
      },
      {
        "name": "Warmte van en voor de buren",
        "url": "https://vng.nl/praktijkvoorbeelden/warmte-van-en-voor-de-buren"
      },
      {
        "name": "Website VNG GemeenteDelers",
        "url": "https://vng.nl/gemeentedelers"
      }
    ]
  }
];
