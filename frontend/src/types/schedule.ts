export interface WasteEntry {
  type: string;
  color: string;
  dates: string[];
  frequency: string;
}

export interface ScheduleData {
  street: string;
  houseNumber: string;
  district: string;
  schedule: WasteEntry[];
}