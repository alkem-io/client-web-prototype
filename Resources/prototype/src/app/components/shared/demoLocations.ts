import type { CityOption } from "@/crd/components/common/CityAutocompleteInput";

/** A short list for the demo. Production's full list lives outside the design system. */
export const DEMO_COUNTRIES = [
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
];

export const DEMO_CITIES: CityOption[] = [
  { id: "NL.amsterdam", name: "Amsterdam", countryCode: "NL", countryName: "Netherlands" },
  { id: "NL.den-haag", name: "Den Haag", countryCode: "NL", countryName: "Netherlands" },
  { id: "NL.utrecht", name: "Utrecht", countryCode: "NL", countryName: "Netherlands" },
  { id: "DE.berlin", name: "Berlin", countryCode: "DE", countryName: "Germany" },
  { id: "ES.madrid", name: "Madrid", countryCode: "ES", countryName: "Spain" },
  { id: "US.san-francisco", name: "San Francisco", countryCode: "US", countryName: "United States" },
];

/** Stands in for a file upload: the picked file becomes its own local address. */
export const demoUpload = async (file: File) => URL.createObjectURL(file);
