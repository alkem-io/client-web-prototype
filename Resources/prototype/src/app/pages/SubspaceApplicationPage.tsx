import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SubspaceApplicationDialog } from "@/app/components/dialogs/SubspaceApplicationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import type { ApplicationFormConfig } from "@/app/components/dialogs/SubspaceApplicationDialog";

const DUTCH_MUNICIPALITIES = [
  { id: "amsterdam", label: "Amsterdam" },
  { id: "rotterdam", label: "Rotterdam" },
  { id: "den-haag", label: "Den Haag" },
  { id: "utrecht", label: "Utrecht" },
  { id: "eindhoven", label: "Eindhoven" },
  { id: "groningen", label: "Groningen" },
  { id: "almere", label: "Almere" },
  { id: "arnhem", label: "Arnhem" },
  { id: "zwolle", label: "Zwolle" },
  { id: "apeldoorn", label: "Apeldoorn" },
  { id: "breda", label: "Breda" },
  { id: "nijmegen", label: "Nijmegen" },
  { id: "maastricht", label: "Maastricht" },
  { id: "dordrecht", label: "Dordrecht" },
  { id: "haarlem", label: "Haarlem" },
  { id: "leiden", label: "Leiden" },
  { id: "delft", label: "Delft" },
  { id: "tilburg", label: "Tilburg" },
  { id: "'s-hertogenbosch", label: "'s-Hertogenbosch" },
];

const FORM_CONFIG: ApplicationFormConfig = {
  id: "form-1",
  spaceId: "alkemio-space",
  isActive: true,
  questions: [
    {
      id: "title",
      type: "short-text",
      label: "Naam van de innovatie",
      description: "Wat is de naam van de innovatie die u in wilt dienen?",
      required: true,
      order: 1,
      constraints: { maxLength: 100 },
    },
    {
      id: "initiating-municipality",
      type: "multi-select-list",
      label: "Uw gemeente",
      description: "Welke gemeente is aanvrager? (Zoeken op naam)",
      required: true,
      order: 2,
      constraints: {
        maxSelections: 1,
        items: DUTCH_MUNICIPALITIES,
      },
    },
    {
      id: "first-lead",
      type: "auto-fill-profile",
      label: "Contactpersoon",
      description: "Wie is de contactpersoon?",
      required: true,
      order: 3,
      constraints: { fields: ["name", "email", "organization"] },
    },
    {
      id: "second-lead",
      type: "user-picker",
      label: "Tweede contactpersoon",
      description: "Optioneel: nog een contactpersoon",
      required: false,
      order: 4,
      constraints: { maxSelections: 1 },
    },
    {
      id: "supporting-municipalities",
      type: "multi-select-list",
      label: "Andere deelnemende gemeenten",
      description: "Welke andere gemeenten nemen deel? (Zoeken op naam)",
      required: false,
      order: 5,
      constraints: {
        allowManualEntry: false,
        items: DUTCH_MUNICIPALITIES,
      },
    },
    {
      id: "vision-wie",
      type: "long-text",
      label: "WIE?",
      description: "Omschrijf (in maximaal 250 woorden) het doel en de doelgroep van de innovatie, op welke manier de innovatie voor een oplossing of verbetering zorgt, en in welke mate dat doel in uw gemeente al is bereikt.",
      required: true,
      order: 6,
      constraints: { maxLength: 500, maxWords: 250 },
    },
    {
      id: "vision-waarvoor",
      type: "long-text",
      label: "WAARVOOR?",
      description: "Vertel (in maximaal 250 woorden) waar en in hoeverre de casus na de opschaling bijdraagt aan de doelen van de VNG. Dit kan bijvoorbeeld aan de hand van de verenigingsstrategie, de Digitale agenda en/of de omkeringsthema's.",
      required: true,
      order: 6,
      constraints: { maxLength: 500, maxWords: 250 },
    },
    {
      id: "vision-waarom",
      type: "long-text",
      label: "WAAROM?",
      description: "Geef (in maximaal 250 woorden) de aanleiding voor het indienen van dit opschalingsvoorstel. Beschrijf wat de toegevoegde waarde is van de innovatie als die zou zijn opgeschaald. Wat maakt de beoogde opschaling zo belangrijk?",
      required: true,
      order: 6,
      constraints: { maxLength: 500, maxWords: 250 },
    },
    {
      id: "vision-hoe",
      type: "long-text",
      label: "HOE?",
      description: "Beschrijf (in maximaal 250 woorden) op hoofdlijnen wat er naar uw mening moet gebeuren om de casus door te ontwikkelen naar gebruik door tenminste 30 gemeenten. Geef een indicatie van de complexiteit, de benodigde partijen, de gewenste rol van VNG, de investering (en hoe deze te financieren) en de te verwachten doorlooptijd.",
      required: true,
      order: 6,
      constraints: { maxLength: 500, maxWords: 250 },
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function SubspaceApplicationPage() {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

  const formTitle = useMemo(() => {
    return searchParams.get("title") || "Aanmelden programma GROEI";
  }, [searchParams]);

  const handleSuccess = () => {
    setOpen(false);
    setSuccessOpen(true);
  };

  const handleRedirect = () => {
    const redirectUrl = searchParams.get("redirect") || "https://alkem.io/intakeproceskci/challenges/aanvraagindienen?phase=1a1e2566-66c0-49be-95f9-741cb206f123";
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SubspaceApplicationDialog
        open={open}
        onOpenChange={setOpen}
        formConfig={FORM_CONFIG}
        spaceName={formTitle}
        currentUser={{
          id: "user-1",
          name: "Huidige gebruiker",
          email: "user@example.com",
          organization: "Gemeente",
        }}
        onSuccess={handleSuccess}
      />

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aanvraag ontvangen</DialogTitle>
            <DialogDescription>
              Dank u voor het indienen van uw aanvraag. Wij nemen contact met u op.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setSuccessOpen(false)}>
              Sluiten
            </Button>
            <Button className="flex-1" onClick={handleRedirect}>
              Terug naar platform
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 left-4 right-4 mx-auto max-w-md bg-amber-50 border border-amber-200 rounded-lg p-3 text-center text-sm text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
        ⚠️ This is a mock-up demo
      </div>
    </div>
  );
}
