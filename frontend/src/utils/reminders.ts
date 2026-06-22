interface WasteEntry {
  type: string;
  color: string;
  dates: string[];
  frequency: string;
}

export interface UpcomingReminder {
  type: string;
  color: string;
  date: string; // ISO date of the next pickup
  daysUntil: number; // 0 = today, 1 = tomorrow, etc.
}

// Returns the waste types coming up in the next N days,
// based on each type's nearest pickup date.
export function getUpcomingReminders(
  schedule: WasteEntry[],
  daysBefore: number,
  today: Date = new Date()
): UpcomingReminder[] {
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const reminders: UpcomingReminder[] = [];

  for (const entry of schedule) {
    if (entry.dates.length === 0) continue;

    // dates[] is already sorted, so dates[0] is the next pickup
    const nextDateStr = entry.dates[0];
    const nextDate = new Date(nextDateStr + "T00:00:00");

    const daysUntil = Math.round(
      (nextDate.getTime() - todayMidnight.getTime()) / 86400000
    );

    if (daysUntil >= 0 && daysUntil <= daysBefore) {
      reminders.push({
        type: entry.type,
        color: entry.color,
        date: nextDateStr,
        daysUntil,
      });
    }
  }

  return reminders.sort((a, b) => a.daysUntil - b.daysUntil);
}