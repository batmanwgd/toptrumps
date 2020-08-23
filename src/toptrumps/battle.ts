import { OpenCard } from './types';

export interface PlayerData {
  name: string;
  stack: OpenCard[];
  hand?: OpenCard;
}

export type Phase = 'clear' | 'closed' | 'one_open' | 'selected' | 'all_open';

export interface BattleState {
  players: PlayerData[];
  leaderIndex: number;
  activeIndex: number;
  phase: Phase;
}

export type BattleAction =
  | { actionType: 'NextPlayer' }
  | { actionType: 'Reset' }
  | { actionType: 'TakeTopCard'; playerIndex: number }
  | { actionType: 'SetPhase'; phase: Phase }
  | { actionType: 'SetActiveIndex'; index: number }
  | { actionType: 'ShowLeaderHand' };

export const battleReducer = (state: BattleState, action: BattleAction): BattleState => {
  switch (action.actionType) {
    case 'TakeTopCard':
      const activeIndex = (state.activeIndex + 1) % state.players.length;
      return {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.activeIndex) {
            if (player.hand === undefined) {
              const hand = player.stack.slice(-1)[0];
              const stack = player.stack.slice(0, -1);
              // console.log(player.name, hand, stack);
              // const hand = player.stack.pop();
              return { ...player, stack, hand };
            }
          }
          return player;
        }),
        activeIndex,
      };

    case 'SetPhase':
      return {
        ...state,
        phase: action.phase,
      };
  }

  return state;
};

export const getNaturalAction = (state: BattleState): BattleAction => {
  const activePlayer = state.players[state.activeIndex];
  switch (state.phase) {
    case 'clear':
      if (activePlayer.hand === undefined && activePlayer.stack.length > 0) {
        return { actionType: 'TakeTopCard', playerIndex: 123 }
      }
      const allAliveHaveHands = state.players.every((player: PlayerData) => {
        return player.hand || player.stack.length === 0;
      });
      if (allAliveHaveHands) {
        return { actionType: 'SetPhase', phase: 'closed' };
      } else throw new Error('Error wile dealing in clear');
    case 'closed':
      // return { 'SetActiveIndex': state.leaderIndex };
      return { actionType: 'ShowLeaderHand' };
  }

  return { actionType: 'Reset' };
};
