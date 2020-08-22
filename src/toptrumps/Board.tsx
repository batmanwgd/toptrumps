import React from 'react';
import styled from 'styled-components';
import { Player } from './Player';
import { Card } from './types';
import spaceshipData from './spaceships.json';
import { breakpointSmall } from './constants';

interface Spaceship {
  name: string;
  hyperdriveRating: number;
  length: number;
  costInCredits: number;
  cargoCapacity: number;
}

const spaceships = spaceshipData as Spaceship[];

const Wrapper = styled.div`
  font-size: 1em;
  height: 100%;

  display: flex;
  flex-direction: column;

  .content {
    height: 100%;

    flex: 1 1;
  }
  div.players {
    padding: 5pt;

    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .footer {
    flex: 0 1;
  }

  @media (max-width: ${breakpointSmall}) {
    div.players {
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
    }
  }
`;

export const Board: React.FC = () => {
  const [c1, c2, c3]: Card[] = spaceships
    .filter((s: Spaceship) => s.cargoCapacity && s.costInCredits && s.hyperdriveRating && s.length)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      };
    });

  return (
    <Wrapper>
      <div className="content">
        <div className="players them">
          <Player name="Lape Kale" card={c1} stackLength={20} actionRequired={false} />
          <Player name="Gitanas Nauseda" card={c2} stackLength={1} actionRequired={true} />
        </div>
      </div>
      <div className="footer">
        <div className="players us">
            <Player name="Luke 10x" card={c3} stackLength={8} actionRequired={true} />
        </div>
      </div>
    </Wrapper>
  );
};
