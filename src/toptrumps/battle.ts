import { OpenCard } from './types';

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
  | 'closed'
  | 'one_open'
  | 'rolling'
  | 'selected'
  | 'selected_stopped'
  | 'all_open'
  | 'finalize';

export interface BattleState {
  players: PlayerData[];
  leaderIndex: number;
  activeIndex: number;
  phase: Phase;
  selectedSkill?: number;
  winnerIndex?: number;
}

export type BattleAction =
  | { actionType: 'Noop' }
  | { actionType: 'NextPlayer' }
  | { actionType: 'TakeTopCard'; playerIndex: number }
  | { actionType: 'SetPhase'; phase: Phase }
  | { actionType: 'SetActiveIndex'; index: number }
  | { actionType: 'ShowLeaderHand' }
  | { actionType: 'RollSkills' }
  | { actionType: 'Select' }
  | { actionType: 'ShowHand' }
  | { actionType: 'StopBeforeShowHand' }
  | { actionType: 'FindWinner' }
  | { actionType: 'GiveHandToWinnerStack' }
  | { actionType: 'EndTrick' }
  | { actionType: 'EndGame' };

export const battleReducer = (state: BattleState, action: BattleAction): BattleState => {
  console.log('State:', state.phase, ' + ', action.actionType);
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
      const stateAfterShowHand: BattleState = {
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
        phase: 'selected',

        activeIndex: (state.activeIndex + 1) % state.players.length,
      };
      if (
        stateAfterShowHand.players.every((player: PlayerData) => {
          return player.hand === undefined || player.hand.open;
        })
      ) {
        stateAfterShowHand.phase = 'all_open';
      }
      return stateAfterShowHand;

    case 'StopBeforeShowHand':
      return {
        ...state,
        phase: 'selected_stopped',
      };
    case 'FindWinner':
      const selectedSkillValues = state.players.map((player: PlayerData) => {
        if (!player.hand) {
          return 0;
        }
        switch (state.selectedSkill) {
          case 0:
            return player.hand.skills.cargoCapacity;
          case 1:
            return player.hand.skills.hyperdriveRating;
          case 2:
            return player.hand.skills.costInCredits;
          case 3:
            return player.hand.skills.length;
        }
        return 0;
      });

      const winnerIndex = selectedSkillValues.indexOf(Math.max(...selectedSkillValues));

      return {
        ...state,
        leaderIndex: winnerIndex,
        activeIndex: (winnerIndex + 1) % state.players.length,
        winnerIndex,
      };

    case 'GiveHandToWinnerStack':
      const state1: BattleState = {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.activeIndex) {
            return {
              ...player,
              ghostHand: player.hand,
              hand: undefined,
            };
          }
          return player;
        }),
      };

      const ghostHand = state.players[state.activeIndex].hand;

      const state2 = ghostHand
        ? {
            ...state,
            players: state1.players.map((player: PlayerData, key) => {
              if (key === state.leaderIndex) {
                return {
                  ...player,
                  stack: [...player.stack, ghostHand],
                };
              }
              return player;
            }),
          }
        : state;

      const allGaveTheirHands = state2.players.every((player: PlayerData) => {
        return player.hand === undefined;
      });

      return {
        ...state2,
        phase: allGaveTheirHands ? 'finalize' : 'selected',
        activeIndex: (state.activeIndex + 1) % state.players.length,
      };

    case 'EndGame':
      return {
        ...state,
        players: state.players.map((player: PlayerData) => {
          return {
            ...player,
            ghostHand: undefined,
          };
        }),
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
      if (activePlayer.hand && activePlayer.hand.open === false && activePlayer.nature === 'bot') {
        return { actionType: 'ShowHand' };
      }
      if (activePlayer.hand && activePlayer.hand.open === false && activePlayer.nature === 'human') {
        return { actionType: 'StopBeforeShowHand' };
      }
      // break;
    case 'all_open':
      if (state.winnerIndex === undefined) {
        return { actionType: 'FindWinner' };
      } else {
        return { actionType: 'GiveHandToWinnerStack' };
      }
    case 'finalize':
      const playersStillHavingCards = state.players.filter((player: PlayerData) => {
        return player.stack.length > 0 || player.hand;
      });

      if (playersStillHavingCards.length > 1) {
        return { actionType: 'EndTrick' };
      }
      return { actionType: 'EndGame' };
  }

  return { actionType: 'Noop' };
};
