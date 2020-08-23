import React, { useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player } from './Player';
import { OpenCard } from './types';
import spaceshipData from './spaceships.json';
import { breakpointSmall } from './constants';
import { BattleState, BattleAction, battleReducer, PlayerData, getNaturalAction } from './battle';

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
  const allCards: OpenCard[] = spaceships
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

  const [c1, c2, c3] = allCards;
  const [state, dispatch] = useReducer<React.Reducer<BattleState, BattleAction>>(battleReducer, {
    players: [
      { name: 'gitanas nauseda', stack: [c1] },
      { name: 'celofanas', stack: [c2] },
      { name: 'luke 10x', stack: [c3] },
    ],
    leaderIndex: 0,
    activeIndex: 0,
    phase: 'clear',
  });

  const foes = state.players.slice(0, -1);
  const me: PlayerData = state.players.slice(-1)[0];

  const playerDataToProps = (data: PlayerData) => {
    return {
      name: data.name,
      card: data.hand,
      stackLength: data.stack.length,
      actionRequired: false,
    };
  };

  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    console.log(state);

    dispatch(getNaturalAction(state));

    setTimeout(() => {
      setTick(tick + 1);
    }, 2000);
  }, [tick]);

  return (
    <Wrapper>
      <div className="content">
        <div className="players them">
          {foes.map((p: PlayerData, key) => {
            return <Player key={key} {...playerDataToProps(p)} />;
          })}
        </div>
      </div>
      <div className="footer">
        <div className="players us">
          <Player {...playerDataToProps(me)} />
        </div>
      </div>
    </Wrapper>
  );
};
