export interface HouseNumberOption {
  hnrId: number;
  label: string;
}

export interface StreetOption {
  _id: string;
  name: string;
  strId: number;
  houseNumbers: HouseNumberOption[];
}