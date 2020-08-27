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
  rolling: boolean;
}

export type Card = OpenCard | ClosedCard;

export interface Player {
  name: string;
  topCard: Card;
}

type Nature = 'human' | 'bot';
export interface PlayerData {
  name: string;
  stack: OpenCard[];
  hand?: OpenCard;
  ghostHand?: OpenCard;
  nature: Nature;
}

export type Phase =
  | 'clear'
  | 'loading'
  | 'closed'
  | 'one_open'
  | 'rolling'
  | 'rolling_stopped'
  | 'selected'
  | 'selected_stopped'
  | 'all_open'
  | 'finalize'
  | 'finalize_stopped';

export interface BattleState {
  players: PlayerData[];
  leaderIndex: number;
  activeIndex: number;
  phase: Phase;
  selectedSkill?: number;
  winnerIndex?: number;
  finalWinnerIndex?: number;
}
