import { OpenCard, BattleState, PlayerData } from './types';
import { SettingsState } from '../setup/settings';

export type BattleAction =
  | { actionType: 'Noop' }
  | { actionType: 'Reset'; settings: SettingsState }
  | { actionType: 'StartLoading' }
  | {
      actionType: 'Loaded';
      payload: Array<OpenCard[]>;
    }
  | { actionType: 'TakeTopCard' }
  | { actionType: 'ShowLeaderHand' }
  | { actionType: 'RollSkills' }
  | { actionType: 'LetUserSelect' }
  | { actionType: 'Select'; skillIndex: number }
  | { actionType: 'ShowHand' }
  | { actionType: 'StopBeforeShowHand' }
  | { actionType: 'FindWinner' }
  | { actionType: 'GiveHandToWinnerStack' }
  | { actionType: 'EndTrick' }
  | { actionType: 'StopBeforeEndGame' }
  | { actionType: 'EndGame' };

const nextActiveIndex = (state: BattleState): number => {
  const nextIndex = (state.activeIndex + 1) % state.players.length;
  const nextPlayer = state.players[nextIndex];
  if (!nextPlayer.hand && nextPlayer.stack.length === 0) {
    return (state.activeIndex + 2) % state.players.length;
  }
  return nextIndex;
};

export const battleReducer = (state: BattleState, action: BattleAction): BattleState => {
  console.log('State:', state.phase, ' + ', action.actionType);
  switch (action.actionType) {
    case 'Reset':
      const opponents: string[] = <string[]>action.settings.opponents.filter((name?: string) => name !== undefined);
      return {
        players: [
          ...opponents.map(
            (name: string): PlayerData => ({
              name,
              stack: [],
              nature: 'bot',
            }),
          ),
          {
            name: action.settings.user,
            stack: [],
            nature: 'human',
          },
        ],
        leaderIndex: 0,
        activeIndex: 0,
        phase: 'clear',
      };
    case 'TakeTopCard':
      const allAliveHaveHands = state.players.every((player: PlayerData) => {
        return player.hand || player.stack.length === 0;
      });
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
        activeIndex: allAliveHaveHands ? state.activeIndex : nextActiveIndex(state),
        phase: allAliveHaveHands ? 'closed' : 'clear',
      };

    case 'StartLoading':
      return {
        ...state,
        phase: 'loading',
      };

    case 'Loaded':
      return {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          return {
            ...player,
            stack: action.payload[key],
          };
        }),
        phase: 'clear',
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
            const openHand: OpenCard = { ...hand, rolling: true };
            return { ...player, hand: openHand };
          }
          return player;
        }),
        phase: 'rolling',
      };

    case 'LetUserSelect':
      return {
        ...state,
        phase: 'rolling_stopped',
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
            const openHand: OpenCard = { ...hand, rolling: false };
            return { ...player, hand: openHand };
          }
          return player;
        }),
        phase: 'selected',
        activeIndex: nextActiveIndex(state),
        selectedSkill: action.skillIndex,
      };

    case 'ShowHand':
      const stateAfterShowHand: BattleState = {
        ...state,
        players: state.players.map((player: PlayerData, key) => {
          if (key === state.activeIndex) {
            const hand = player.hand as OpenCard;
            if (!hand) {
              throw new Error('Active player has no hand so cannot show it');
            }
            const openHand: OpenCard = { ...hand, open: true };
            return { ...player, hand: openHand };
          }
          return player;
        }),
        phase: 'selected',

        activeIndex: nextActiveIndex(state),
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

      const max = Math.max(...selectedSkillValues);

      const getMaxIndex = (values: number[], max: number) => {
        for (let i = state.leaderIndex; i < values.length; i++) {
          if (values[i] == max) {
            return i;
          }
        }
        for (let i = 0; i < values.length; i++) {
          if (values[i] == max) {
            return i;
          }
        }
        throw new Error('Max value not found');
      };
      const winnerIndex = getMaxIndex(selectedSkillValues, max);
      const playerHavingSomething = state.players.filter((player: PlayerData) => {
        return player.hand || player.stack.length > 0;
      });

      const isFinal = playerHavingSomething.length < 2;
      return {
        ...state,
        leaderIndex: winnerIndex,
        activeIndex: (winnerIndex + 1) % state.players.length,
        winnerIndex,
        finalWinnerIndex: isFinal ? winnerIndex : undefined,
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
                  stack: [ghostHand, ...player.stack],
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
        phase: allGaveTheirHands ? 'finalize' : 'all_open',
        activeIndex: nextActiveIndex(state),
      };

    case 'StopBeforeEndGame':
      return {
        ...state,
        players: state.players.map((player: PlayerData) => {
          return {
            ...player,
            ghostHand: undefined,
          };
        }),
        phase: 'finalize_stopped',
      };

    case 'EndTrick':
      return {
        ...state,
        players: state.players.map((player: PlayerData) => {
          return {
            ...player,
            stack: player.stack.map((card: OpenCard) => {
              return {
                ...card,
                open: false,
              };
            }),
            ghostHand: undefined,
            hand: undefined,
          };
        }),
        winnerIndex: undefined,
        activeIndex: state.leaderIndex,
        phase: 'clear',
        selectedSkill: undefined,
      };
    case 'EndGame':
      return {
        ...state,
        players: state.players.map((player: PlayerData) => {
          return {
            ...player,
            ghostHand: undefined,
            hand: undefined,
            stack: [],
          };
        }),
        winnerIndex: undefined,
        activeIndex: state.leaderIndex,
        phase: 'clear',
        selectedSkill: undefined,
      };
  }

  return state;
};

export const getNaturalAction = (state: BattleState): BattleAction => {
  const activePlayer = state.players[state.activeIndex];
  switch (state.phase) {
    case 'clear':
      const allHaveNothing = state.players.every((player: PlayerData) => {
        return !player.hand && player.stack.length === 0;
      });
      if (allHaveNothing) {
        return { actionType: 'StartLoading' };
      }
      return { actionType: 'TakeTopCard' };
    case 'closed':
      return { actionType: 'ShowLeaderHand' };
    case 'one_open':
      return { actionType: 'RollSkills' };
    case 'rolling':
      if (activePlayer.nature === 'human') {
        return { actionType: 'LetUserSelect' };
      }
      return { actionType: 'Select', skillIndex: 1 };
    case 'selected':
      if (activePlayer.nature === 'human') {
        return { actionType: 'StopBeforeShowHand' };
      }
      return { actionType: 'ShowHand' };
    case 'all_open':
      if (state.winnerIndex === undefined) {
        return { actionType: 'FindWinner' };
      }
      return { actionType: 'GiveHandToWinnerStack' };
    case 'finalize':
      const playersStillHavingCards = state.players.filter((player: PlayerData) => {
        return player.stack.length > 0 || player.hand;
      });
      if (playersStillHavingCards.length > 1) {
        return { actionType: 'EndTrick' };
      }
      return { actionType: 'StopBeforeEndGame' };
  }

  return { actionType: 'Noop' };
};
