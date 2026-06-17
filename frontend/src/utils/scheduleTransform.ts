// Maps German bin type names (as returned by the SWE Erfurt API) to the
// display names and colors already used across the app's UI.
const BIN_TYPE_CONFIG: Record<string, { displayName: string; color: string }> = {
  "Bio": { displayName: "Biotonne", color: "#a0522d" },
  "Papier": { displayName: "Papiertonne", color: "#60a5fa" },
  "Gelber Sack": { displayName: "Gelber Sack", color: "#facc15" },
  "gelbe Tonne": { displayName: "Gelber Sack", color: "#facc15" },
  "Restmüll": { displayName: "Restmüll", color: "#9ca3af" },
};

interface CollectionDay {
  day: number;
  weekday: string;
  month: string; // e.g. "Juni 2026"
  weekNumber: string;
  binTypes: string[];
}

interface WasteEntry {
  type: string;
  color: string;
  dates: string[];
  frequency: string;
}

const GERMAN_MONTHS: Record<string, number> = {
  "Januar": 0, "Februar": 1, "März": 2, "April": 3, "Mai": 4, "Juni": 5,
  "Juli": 6, "August": 7, "September": 8, "Oktober": 9, "November": 10, "Dezember": 11,
};

// Converts a CollectionDay (day number + "Juni 2026" string) into a full
// ISO date string (e.g. "2026-06-23"), since the API only gives us the
// day number and a German month/year label, not a ready-made date.
function toIsoDate(day: number, monthIndex: number, year: number): string {
  const date = new Date(Date.UTC(year, monthIndex, day));
  return date.toISOString().split("T")[0];
}

/**
 * Resolves the correct month/year for each CollectionDay, working around
 * a bug in the upstream SWE Erfurt API: when a calendar week spans a
 * month boundary (e.g. "KW 27" running from June 29 to July 5), the days
 * that fall in the new month are still labeled with the *previous*
 * month's name. Since the API always returns days in chronological
 * order, we detect a rollover whenever the day number drops compared to
 * the previous entry (e.g. 26 followed by 1) and advance the month
 * (and year, if rolling past December) accordingly.
 */
function resolveCalendarDates(days: CollectionDay[]): { day: CollectionDay; isoDate: string }[] {
  let currentMonthIndex: number | null = null;
  let currentYear: number | null = null;
  let previousDayNumber = 0;

  const resolved: { day: CollectionDay; isoDate: string }[] = [];

  for (const day of days) {
    const [monthName, yearStr] = day.month.trim().split(" ");
    const labelMonthIndex = GERMAN_MONTHS[monthName];
    const labelYear = parseInt(yearStr, 10);

    if (labelMonthIndex === undefined || isNaN(labelYear)) continue;

    if (currentMonthIndex === null || currentYear === null) {
      // First entry — trust the label as-is, nothing to compare against yet.
      currentMonthIndex = labelMonthIndex;
      currentYear = labelYear;
    } else if (day.day < previousDayNumber) {
      // Day number went backwards (e.g. 26 -> 1): the week crossed into a
      // new month, but the upstream label is stale. Advance the month
      // ourselves instead of trusting day.month.
      currentMonthIndex += 1;
      if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear += 1;
      }
    } else if (labelMonthIndex !== currentMonthIndex || labelYear !== currentYear) {
      // The label itself moved forward (no rollover glitch this time) —
      // trust it, since this means the upstream label was actually updated.
      currentMonthIndex = labelMonthIndex;
      currentYear = labelYear;
    }

    previousDayNumber = day.day;
    resolved.push({ day, isoDate: toIsoDate(day.day, currentMonthIndex, currentYear) });
  }

  return resolved;
}

/**
 * Transforms the raw CollectionDay[] returned by /api/schedule/lookup
 * (one entry per calendar day, with the bin types collected that day)
 * into the WasteEntry[] shape the existing UI expects (one entry per
 * bin type, with all its upcoming collection dates).
 */
export function transformToScheduleEntries(days: CollectionDay[]): WasteEntry[] {
  const grouped: Record<string, string[]> = {};
  const resolvedDays = resolveCalendarDates(days);

  for (const { day, isoDate } of resolvedDays) {
    for (const rawBinType of day.binTypes) {
      const config = BIN_TYPE_CONFIG[rawBinType];
      const displayName = config?.displayName ?? rawBinType;

      if (!grouped[displayName]) grouped[displayName] = [];
      grouped[displayName].push(isoDate);
    }
  }

  return Object.entries(grouped)
    .map(([type, dates]) => {
      const config = Object.values(BIN_TYPE_CONFIG).find((c) => c.displayName === type);
      return {
        type,
        color: config?.color ?? "#ffffff",
        dates: dates.sort(),
        frequency: "", // not provided by the SWE API; left blank intentionally
      };
    })
    // Sort waste types by their next upcoming date, so the soonest
    // collection always appears first (matches the "Nächste Abholung" badge logic)
    .sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
}