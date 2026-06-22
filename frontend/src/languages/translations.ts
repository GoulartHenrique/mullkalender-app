
import { de } from "./de";
import { en } from "./en";

export type Language = "de" | "en";

export const translations = {
  de,
  en,
} as const;