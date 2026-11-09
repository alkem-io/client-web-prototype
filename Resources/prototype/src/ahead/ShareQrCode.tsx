import { Check, Copy, Download, Info, Maximize2, Minimize2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/crd/lib/utils";
import { Button } from "@/crd/primitives/button";

/**
 * ShareQrCode — a QR code for the link in every share dialog (alkemio#2222).
 *
 * WHAT PRODUCTION WOULD GAIN
 * Anyone sharing an item can hand it to a room: a small code sits beside
 * "Copy QR code", "Download image" and "Show larger". Clicking the code (or
 * Show larger) makes it fill the dialog, big enough to scan from the back of a
 * room when projected; clicking again shrinks it back. The code is navy with
 * rounded squares and the Alkemio logo in the centre, at the highest error
 * correction, so the logo never stops it scanning (tested up to 26% logo; this
 * uses 22%). Dots were tried and dropped: they stop reading reliably this small.
 *
 * Download saves a PNG named after the item. A reminder underneath says only
 * people with access can open it; it is hidden when the item is public. The
 * address itself stays in the dialog's link field, which is the text
 * alternative for the image.
 *
 * WHAT PRODUCTION NEEDS TO ADD
 * Nothing structural: `ShareDialog` already renders `children` below the link,
 * and `ShareButton` passes them through. The ask is to render this in every
 * share dialog, plus the item's access (public or not) at each call site, and
 * these strings in `crd-common` (they live here until then).
 *
 * Open question, not built: which link to show when an item has both a members
 * link and a public one (alkemio#2225). The review board recommends a switch.
 */

const STRINGS = {
  en: {
    label: "QR code for {{title}}",
    copy: "Copy QR code",
    copied: "Copied",
    download: "Download image",
    larger: "Show larger",
    smaller: "Show smaller",
    reminder: "Only people with access to this page can open this link or QR code.",
  },
  nl: {
    label: "QR-code voor {{title}}",
    copy: "QR-code kopiëren",
    copied: "Gekopieerd",
    download: "Afbeelding downloaden",
    larger: "Groter tonen",
    smaller: "Kleiner tonen",
    reminder: "Alleen mensen met toegang tot deze pagina kunnen deze link of QR-code openen.",
  },
  de: {
    label: "QR-Code für {{title}}",
    copy: "QR-Code kopieren",
    copied: "Kopiert",
    download: "Bild herunterladen",
    larger: "Größer anzeigen",
    smaller: "Kleiner anzeigen",
    reminder: "Nur Personen mit Zugriff auf diese Seite können diesen Link oder QR-Code öffnen.",
  },
  es: {
    label: "Código QR de {{title}}",
    copy: "Copiar código QR",
    copied: "Copiado",
    download: "Descargar imagen",
    larger: "Ver más grande",
    smaller: "Ver más pequeño",
    reminder: "Solo las personas con acceso a esta página pueden abrir este enlace o código QR.",
  },
  fr: {
    label: "Code QR pour {{title}}",
    copy: "Copier le code QR",
    copied: "Copié",
    download: "Télécharger l'image",
    larger: "Agrandir",
    smaller: "Réduire",
    reminder: "Seules les personnes ayant accès à cette page peuvent ouvrir ce lien ou ce code QR.",
  },
  bg: {
    label: "QR код за {{title}}",
    copy: "Копирай QR кода",
    copied: "Копирано",
    download: "Изтегли изображението",
    larger: "Покажи по-голям",
    smaller: "Покажи по-малък",
    reminder: "Само хора с достъп до тази страница могат да отворят тази връзка или QR код.",
  },
} as const;

const COPIED_FEEDBACK_MS = 2000;
const NAVY = "#1d384a";
const LOGO_FRACTION = 0.22;
const QUIET_ZONE = 4;
const PNG_SIZE = 1024;

const LOGO = `<path d="M63.7 0H0V61.1H63.7V0Z" fill="#09BCD4"/><path d="M29.2 25.1C28.1 26.9 26.4 28.1 24.4 28.5H24.3C22.5 29 20.8 30.1 19.8 31.8C18.8 33.5 18.6 35.4 19 37.2C19.6 39.1 19.5 41.3 18.4 43.2C16.3 46.7 11.9 47.8 8.4 45.7C4.9 43.6 3.8 39.2 5.9 35.7C6.5 34.7 7.3 33.9 8.2 33.3C9 33 10 32.6 11 32.4C12.7 31.9 14.2 30.8 15.2 29.2C15.7 28.3 16 27.4 16.2 26.5C16.3 25.6 16.3 24.7 16.1 23.8C15.4 21.9 15.6 19.7 16.7 17.8C18.7 14.3 23.2 13.2 26.7 15.3C30.1 17.2 31.2 21.7 29.2 25.1Z" fill="#fff"/><path d="M58.9 39.8C58.9 43.8 55.7 47 51.7 47C49.6 47 47.7 46.1 46.4 44.7C45.1 43.4 43.3 42.5 41.3 42.5C39.4 42.5 37.6 43.3 36.3 44.5C35 46 33.1 47 30.9 47C26.9 47 23.7 43.8 23.7 39.8C23.7 35.9 26.9 32.6 30.9 32.6C33.1 32.6 35.1 33.6 36.4 35.2C37.7 36.4 39.4 37.1 41.2 37.1C42.2 37.1 43.1 36.9 44 36.5C44.8 36.1 45.6 35.6 46.2 35C47.5 33.5 49.5 32.5 51.6 32.5C55.7 32.6 58.9 35.8 58.9 39.8Z" fill="#fff"/><path d="M41.6 28.6C45.5764 28.6 48.8 25.3764 48.8 21.4C48.8 17.4235 45.5764 14.2 41.6 14.2C37.6235 14.2 34.4 17.4235 34.4 21.4C34.4 25.3764 37.6235 28.6 41.6 28.6Z" fill="#fff"/>`;

/** Rounded navy squares, rounded eyes, logo in the centre. `margin` is the white edge in squares. */
function drawQrSvg(url: string, margin: number): string {
  const { size: n, data } = QRCode.create(url, { errorCorrectionLevel: "H" }).modules;
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < n && y < n && Boolean(data[y * n + x]);
  const inEye = (x: number, y: number) => (x < 8 && y < 8) || (x >= n - 8 && y < 8) || (x < 8 && y >= n - 8);
  const rounded = (x: number, y: number, s: number, r: number) =>
    `M${x + r} ${y}h${s - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${s - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${s - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${s - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;

  let eyes = "";
  for (const [ex, ey] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
    const X = ex + margin;
    const Y = ey + margin;
    eyes += rounded(X, Y, 7, 2) + rounded(X + 1, Y + 1, 5, 1.2) + rounded(X + 2, Y + 2, 3, 0.9);
  }

  // Each square rounds only the corners that have no neighbour, so runs stay joined.
  let body = "";
  const r = 0.5;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!on(x, y) || inEye(x, y)) continue;
      const X = x + margin;
      const Y = y + margin;
      const up = on(x, y - 1);
      const down = on(x, y + 1);
      const left = on(x - 1, y);
      const right = on(x + 1, y);
      const tl = !up && !left;
      const tr = !up && !right;
      const br = !down && !right;
      const bl = !down && !left;
      body +=
        `M${X + (tl ? r : 0)} ${Y}H${X + 1 - (tr ? r : 0)}${tr ? `a${r} ${r} 0 0 1 ${r} ${r}` : ""}` +
        `V${Y + 1 - (br ? r : 0)}${br ? `a${r} ${r} 0 0 1 -${r} ${r}` : ""}` +
        `H${X + (bl ? r : 0)}${bl ? `a${r} ${r} 0 0 1 -${r} -${r}` : ""}` +
        `V${Y + (tl ? r : 0)}${tl ? `a${r} ${r} 0 0 1 ${r} -${r}` : ""}z`;
    }
  }

  const total = n + margin * 2;
  const logoWidth = LOGO_FRACTION * n;
  const scale = logoWidth / 63.7;
  const logoHeight = 61.1 * scale;
  const centre = total / 2;
  const pad = 0.8;
  const f = (v: number) => +v.toFixed(3);
  const logo =
    `<rect x="${f(centre - logoWidth / 2 - pad)}" y="${f(centre - logoHeight / 2 - pad)}" width="${f(logoWidth + pad * 2)}" height="${f(logoHeight + pad * 2)}" rx="1" fill="#fff"/>` +
    `<g transform="translate(${f(centre - logoWidth / 2)} ${f(centre - logoHeight / 2)}) scale(${f(scale)})">${LOGO}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}"><rect width="${total}" height="${total}" fill="#fff"/><path fill="${NAVY}" d="${body}"/><path fill="${NAVY}" fill-rule="evenodd" d="${eyes}"/>${logo}</svg>`;
}

function toPngBlob(svg: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = PNG_SIZE;
      canvas.height = PNG_SIZE;
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("No canvas"));
      context.drawImage(image, 0, 0, PNG_SIZE, PNG_SIZE);
      canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error("No PNG"))), "image/png");
    };
    image.onerror = reject;
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

function toFileName(title: string): string {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "alkemio"}-qr.png`;
}

function toAbsoluteUrl(url: string): string {
  try {
    return new URL(url, window.location.origin).toString();
  } catch {
    return url;
  }
}

export type ShareQrCodeProps = {
  /** The same link the dialog shows; relative links are made absolute, as the dialog does. */
  url: string;
  /** The item's name: read out for the image and used for the downloaded file's name. */
  title: string;
  /** Public items skip the access reminder. */
  isPublic?: boolean;
};

export function ShareQrCode({ url, title, isPublic = false }: ShareQrCodeProps) {
  const { i18n } = useTranslation();
  const strings = STRINGS[(i18n.language?.slice(0, 2) as keyof typeof STRINGS) ?? "en"] ?? STRINGS.en;
  const [large, setLarge] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fullUrl = toAbsoluteUrl(url);
  const bareSvg = useMemo(() => drawQrSvg(fullUrl, 0), [fullUrl]);
  const imageSvg = useMemo(() => drawQrSvg(fullUrl, QUIET_ZONE), [fullUrl]);
  const label = strings.label.replace("{{title}}", title);
  const canCopyImage = typeof ClipboardItem !== "undefined" && Boolean(navigator.clipboard?.write);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
    },
    []
  );

  const handleCopy = async () => {
    try {
      // Safari only accepts the image when the promise goes straight into the ClipboardItem.
      await navigator.clipboard.write([new ClipboardItem({ "image/png": toPngBlob(imageSvg) })]);
      setCopied(true);
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        copyTimeoutRef.current = null;
        setCopied(false);
      }, COPIED_FEEDBACK_MS);
    } catch {
      // Clipboard denied: Download image still works.
    }
  };

  const handleDownload = async () => {
    const blob = await toPngBlob(imageSvg);
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = toFileName(title);
    link.click();
    URL.revokeObjectURL(href);
  };

  const SizeIcon = large ? Minimize2 : Maximize2;

  return (
    <div className={cn("grid gap-4", large ? "grid-cols-1 gap-3" : "grid-cols-[176px_minmax(0,1fr)] items-start")}>
      <button
        type="button"
        onClick={() => setLarge(value => !value)}
        aria-expanded={large}
        aria-label={`${label}. ${large ? strings.smaller : strings.larger}`}
        className={cn(
          "block aspect-square w-full cursor-zoom-in rounded-md border border-border bg-white p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          large && "cursor-zoom-out p-3"
        )}
      >
        <span
          aria-hidden="true"
          className="block size-full [&>svg]:block [&>svg]:size-full"
          // The SVG is drawn here from the link, never from user content.
          dangerouslySetInnerHTML={{ __html: bareSvg }}
        />
      </button>

      <div className={cn("grid gap-2", large && "grid-cols-2")}>
        {canCopyImage && (
          <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="w-full">
            {copied ? <Check className="size-4 mr-1" aria-hidden="true" /> : <Copy className="size-4 mr-1" aria-hidden="true" />}
            {copied ? strings.copied : strings.copy}
          </Button>
        )}
        <Button type="button" variant="outline" size="sm" onClick={handleDownload} className={cn("w-full", large && !canCopyImage && "col-span-2")}>
          <Download className="size-4 mr-1" aria-hidden="true" />
          {strings.download}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLarge(value => !value)}
          aria-expanded={large}
          className={cn("w-full", large && "col-span-2")}
        >
          <SizeIcon className="size-4 mr-1" aria-hidden="true" />
          {large ? strings.smaller : strings.larger}
        </Button>
        {!isPublic && (
          <p className={cn("flex items-start gap-2 text-caption text-muted-foreground", large && "col-span-2")}>
            <Info className="size-3.5 mt-0.5 shrink-0" aria-hidden="true" />
            {strings.reminder}
          </p>
        )}
      </div>
    </div>
  );
}
