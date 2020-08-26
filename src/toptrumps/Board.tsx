import React, { useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player } from './Player';
import { breakpointSmall } from './constants';
import { BattleAction, battleReducer, getNaturalAction } from './battle';
import { BattleState, PlayerData } from './types';
import { useBattleContext } from './BattleContext';
import { loadRandomCards } from './loader';

const initialBattleState: BattleState = {
  players: [
    { name: 'gitanas nauseda', stack: [], nature: 'bot' },
    { name: 'celofanas', stack: [], nature: 'bot' },
    { name: 'luke 10x', stack: [], nature: 'human' },
  ],
  leaderIndex: 0,
  activeIndex: 0,
  phase: 'clear',
};

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
  const [state, dispatch] = useReducer<React.Reducer<BattleState, BattleAction>>(battleReducer, initialBattleState);

  const { setSelectedSkill, setChoices, setPhase } = useBattleContext();

  const foes = state.players.slice(0, -1);
  const me: PlayerData = state.players.slice(-1)[0];

  const playerDataToProps = (data: PlayerData, isWinner: boolean) => {
    return {
      name: data.name,
      card: data.hand,
      ghostCard: data.ghostHand,
      stackLength: data.stack.length,
      actionRequired: false,
      isWinner: isWinner,
    };
  };

  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    if (state.phase === 'loading') {
      // TODO move this to apollo hook later
      setTimeout(() => {
        const [c1, c2, c3] = loadRandomCards();
        dispatch({
          actionType: 'Loaded',
          payload: [[c1], [c2], [c3]],
        });
        setTick(tick + 1);
      }, 5000);
    } else if (state.phase === 'selected_stopped') {
      setChoices([
        () => {
          dispatch({ actionType: 'ShowHand' });
          setTick(tick + 1);
        },
      ]);
    } else if (state.phase === 'finalize_stopped') {
      setChoices([
        () => {
          dispatch({ actionType: 'EndGame' });
          setTick(tick + 1);
        },
      ]);
    } else {
      setChoices([]);
    }
  }, [state.phase]);

  useEffect(() => {
    setSelectedSkill(state.selectedSkill || -1);
    setPhase(state.phase);

    const action = getNaturalAction(state);
    dispatch(action);

    if (action.actionType === 'StopBeforeShowHand') {
      return;
    }

    if (action.actionType === 'StopBeforeEndGame') {
      return;
    }

    if (action.actionType === 'StartLoading') {
      return;
    }

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
          {foes.map((p: PlayerData, key: number) => {
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
