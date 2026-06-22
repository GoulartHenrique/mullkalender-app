// Maps German bin names from the API to the display names and colors
// used in the app.
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
  month: string;
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

// Turns a day number + "Juni 2026" string into a real date like "2026-06-23"
function toIsoDate(day: number, monthIndex: number, year: number): string {
  const date = new Date(Date.UTC(year, monthIndex, day));
  return date.toISOString().split("T")[0];
}

// SWE API bug: new month days keep old month's label. Fixed here.
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
      // First day, just trust the label
      currentMonthIndex = labelMonthIndex;
      currentYear = labelYear;
    } else if (day.day < previousDayNumber) {
      // Day number dropped, so I moved into a new month
      currentMonthIndex += 1;
      if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear += 1;
      }
    } else if (labelMonthIndex !== currentMonthIndex || labelYear !== currentYear) {
      // Label actually changed on its own
      currentMonthIndex = labelMonthIndex;
      currentYear = labelYear;
    }

    previousDayNumber = day.day;
    resolved.push({ day, isoDate: toIsoDate(day.day, currentMonthIndex, currentYear) });
  }

  return resolved;
}

// Turns the day-by-day API response into one entry per waste type,
// each with its list of pickup dates.
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
        frequency: "", // API doesn't give us this
      };
    })
    // Soonest pickup first
    .sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
}