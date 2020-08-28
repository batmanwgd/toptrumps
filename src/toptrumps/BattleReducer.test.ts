import { battleReducer, BattleAction } from './battle';

describe('', () => {
  it('after nine big wins', () => {
    const initialState = {
      players: [
        {
          name: 'gitanas nauseda',
          stack: [],
          nature: 'bot',
          hand: {
            type: 'open',
            name: 'Belbullab-22 starfighter',
            skills: { hyperdriveRating: 6, length: 6.71, costInCredits: 168000, cargoCapacity: 140 },
            open: true,
            roll: false,
          },
        },
        {
          name: 'celofanas',
          stack: [],
          nature: 'bot',
          hand: {
            type: 'open',
            name: 'Star Destroyer',
            skills: { hyperdriveRating: 2, length: 1600, costInCredits: 150000000, cargoCapacity: 36000000 },
            open: true,
            roll: false,
          },
        },
        {
          name: 'luke 10x',
          stack: [],
          nature: 'human',
          hand: {
            type: 'open',
            name: 'Naboo fighter',
            skills: { hyperdriveRating: 1, length: 11, costInCredits: 200000, cargoCapacity: 65 },
            open: true,
            roll: false,
          },
        },
      ],
      leaderIndex: 0,
      activeIndex: 1,
      phase: 'all_open',
      selectedSkill: 1,
      winnerIndex: 0,
    };

    const actions: BattleAction[] = Array(3).fill({
      actionType: 'GiveHandToWinnerStack',
    });

    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    const finalState = actions.reduce(battleReducer, initialState);

    // expect(finalState.players[0].stack.length).toBe(3);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(finalState.players[0].stack.map((c: any) => c.name)).toEqual([
      'Belbullab-22 starfighter',
      'Naboo fighter',
      'Star Destroyer',
    ]);
  });
});
