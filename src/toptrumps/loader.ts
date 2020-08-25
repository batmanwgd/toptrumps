import spaceshipData from './spaceships.json';
import { OpenCard, BattleState } from './types';

interface Spaceship {
  name: string;
  hyperdriveRating: number;
  length: number;
  costInCredits: number;
  cargoCapacity: number;
}

const spaceships = spaceshipData as Spaceship[];

export const getInitialBattleState = (): BattleState => {
  const allCards: OpenCard[] = spaceships
    .filter((s: Spaceship) => s.cargoCapacity && s.costInCredits && s.hyperdriveRating && s.length)
    .sort(() => Math.random() - 0.5)
    .map((spaceship: Spaceship) => {
      return {
        type: 'open',
        name: spaceship.name,
        skills: {
          hyperdriveRating: spaceship.hyperdriveRating,
          length: spaceship.length,
          costInCredits: spaceship.costInCredits,
          cargoCapacity: spaceship.cargoCapacity,
        },
        open: false,
        roll: false,
      };
    });
  const [c1, c2, c3] = allCards;

  return {
    players: [
      { name: 'gitanas nauseda', stack: [c1], nature: 'bot' },
      { name: 'celofanas', stack: [c2], nature: 'bot' },
      { name: 'luke 10x', stack: [c3], nature: 'human' },
    ],
    leaderIndex: 0,
    activeIndex: 0,
    phase: 'clear',
  };
};
