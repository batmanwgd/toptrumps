export interface Skills {
  hyperdriveRating: number;
  length: number;
  costInCredits: number;
  cargoCapacity: number;
}

export interface ClosedCard {
  type: 'closed';
}

export interface OpenCard {
  type: 'open';
  name: string;
  skills: Skills;
  open: boolean;
  roll: boolean;
}

export type Card = OpenCard | ClosedCard;

export interface Player {
  name: string;
  topCard: Card;
}
