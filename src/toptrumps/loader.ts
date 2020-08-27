import spaceshipData from './spaceships.json';
import { OpenCard } from './types';

interface Spaceship {
  name: string;
  hyperdriveRating: number;
  length: number;
  costInCredits: number;
  cargoCapacity: number;
}

const spaceships = spaceshipData as Spaceship[];

export const loadRandomCards = (): OpenCard[] => {
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
        rolling: false,
      };
    });
  return allCards;

};
