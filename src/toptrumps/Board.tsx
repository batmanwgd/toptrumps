import React, { useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player } from './Player';
import { OpenCard } from './types';
import spaceshipData from './spaceships.json';
import { breakpointSmall } from './constants';
import { BattleState, BattleAction, battleReducer, PlayerData, getNaturalAction } from './battle';
import { useBattleContext } from './BattleContext';

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
  const [state, dispatch] = useReducer<React.Reducer<BattleState, BattleAction>>(battleReducer, {
    players: [
      { name: 'gitanas nauseda', stack: [c1], nature: 'bot' },
      { name: 'celofanas', stack: [c2], nature: 'bot' },
      { name: 'luke 10x', stack: [c3], nature: 'human' },
    ],
    leaderIndex: 0,
    activeIndex: 0,
    phase: 'clear',
  });

  const { setSelectedSkill, setChoices } = useBattleContext();

  const foes = state.players.slice(0, -1);
  const me: PlayerData = state.players.slice(-1)[0];

  const playerDataToProps = (data: PlayerData, isWinner: boolean) => {
    return {
      name: data.name,
      card: data.hand,
      stackLength: data.stack.length,
      actionRequired: false,
      isWinner: isWinner,
    };
  };

  const [tick, setTick] = useState<number>(0);

  const isStopped = state.phase === 'selected_stopped';

  useEffect(() => {
    if (state.phase === 'selected_stopped') {
      setChoices([
        () => {
          dispatch({ actionType: 'ShowHand' });
        },
      ]);
      setTick(tick + 1);
    } else {
      setChoices([]);
    }
  }, [isStopped]);

  useEffect(() => {
    setSelectedSkill(state.selectedSkill || -1);

    const action = getNaturalAction(state);
    dispatch(action);

    if (action.actionType === 'StopBeforeShowHand') {
      return;
    }
    // console.log('state', tick, JSON.stringify(state));
    const tickDelay = (() => {
      if (action.actionType === 'RollSkills') {
        return 2000;
      }
      if (action.actionType === 'FindWinner') {
        return 5000;
      }
      return 600;
    })();
    setTimeout(() => {
      setTick(tick + 1);
    }, tickDelay);
  }, [tick]);

  return (
    <Wrapper>
      <div className="content">
        <div className="players them">
          {foes.map((p: PlayerData, key) => {
            const isWinner = key === state.winnerIndex;
            return <Player key={key} {...playerDataToProps(p, isWinner)} />;
          })}
        </div>
      </div>
      <div className="footer">
        <div className="players us">
          <Player {...playerDataToProps(me, state.winnerIndex === foes.length)} />
        </div>
      </div>
    </Wrapper>
  );
};
