import { OpenCard } from './types';

export interface PlayerData {
  name: string;
  stack: OpenCard[];
  hand?: OpenCard;
}

export type Phase = 'clear' | 'closed' | 'one_open' | 'rolling' | 'selected' | 'all_open';

export interface BattleState {
  players: PlayerData[];
  leaderIndex: number;
  activeIndex: number;
  phase: Phase;
  selectedSkill?: number;
}

export type BattleAction =
  | { actionType: 'NextPlayer' }
  | { actionType: 'Reset' }
  | { actionType: 'TakeTopCard'; playerIndex: number }
  | { actionType: 'SetPhase'; phase: Phase }
  | { actionType: 'SetActiveIndex'; index: number }
  | { actionType: 'ShowLeaderHand' }
  | { actionType: 'RollSkills' }
  | { actionType: 'Select' }
  | { actionType: 'ShowHand' };

export const battleReducer = (state: BattleState, action: BattleAction): BattleState => {
  switch (action.actionType) {
    case 'TakeTopCard':
      return {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.activeIndex) {
            if (player.hand === undefined) {
              const hand = player.stack.slice(-1)[0];
              const stack = player.stack.slice(0, -1);
              return { ...player, stack, hand };
            }
          }
          return player;
        }),
        activeIndex: (state.activeIndex + 1) % state.players.length,
      };

    case 'SetPhase':
      return {
        ...state,
        phase: action.phase,
      };

    case 'ShowLeaderHand':
      return {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.leaderIndex) {
            const hand = player.hand as OpenCard;
            if (!hand) {
              throw new Error('Leader has no hand so cannot show it');
            }
            const openHand: OpenCard = { ...hand, open: true };
            return { ...player, hand: openHand };
          }
          return player;
        }),
        phase: 'one_open',
      };

    case 'RollSkills':
      return {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.leaderIndex) {
            const hand = player.hand as OpenCard;
            if (!hand) {
              throw new Error('Leader has no hand so cannot roll it');
            }
            const openHand: OpenCard = { ...hand, roll: true };
            return { ...player, hand: openHand };
          }
          return player;
        }),
        phase: 'rolling',
      };

    case 'Select':
      return {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.leaderIndex) {
            const hand = player.hand as OpenCard;
            if (!hand) {
              throw new Error('Leader has no hand so cannot roll it');
            }
            const openHand: OpenCard = { ...hand, roll: false };
            return { ...player, hand: openHand };
          }
          return player;
        }),
        phase: 'selected',
        activeIndex: (state.activeIndex + 1) % state.players.length,
        selectedSkill: 1,
      };
    case 'ShowHand':
      return {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.activeIndex) {
            const hand = player.hand as OpenCard;
            if (!hand) {
              throw new Error('Leader has no hand so cannot show it');
            }
            const openHand: OpenCard = { ...hand, open: true };
            return { ...player, hand: openHand };
          }
          return player;
        }),
        activeIndex: (state.activeIndex + 1) % state.players.length,
      };
  }

  return state;
};

export const getNaturalAction = (state: BattleState): BattleAction => {
  const activePlayer = state.players[state.activeIndex];
  switch (state.phase) {
    case 'clear':
      if (activePlayer.hand === undefined && activePlayer.stack.length > 0) {
        return { actionType: 'TakeTopCard', playerIndex: 123 };
      }
      const allAliveHaveHands = state.players.every((player: PlayerData) => {
        return player.hand || player.stack.length === 0;
      });
      if (allAliveHaveHands) {
        return { actionType: 'SetPhase', phase: 'closed' };
      } else throw new Error('Error wile dealing in clear');
    case 'closed':
      return { actionType: 'ShowLeaderHand' };
    case 'one_open':
      return { actionType: 'RollSkills' };
    case 'rolling':
      return { actionType: 'Select' };
    case 'selected':
      if (activePlayer.hand && activePlayer.hand.open === false) {
        return { actionType: 'ShowHand' };
      }
  }

  return { actionType: 'Reset' };
};
