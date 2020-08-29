import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Player } from './Player';
import { breakpointSmall } from './constants';
import { getNaturalAction } from './battle';
import { PlayerData, OpenCard } from './types';
import { useBattleContext } from './BattleContext';
import { loadRandomCards } from './loader';
import { PlayerProvider } from './PlayerContext';
import { Link } from 'react-router-dom';
import { useSettingsContext } from '../setup/SettingsContext';

const playerDataToProps = (data: PlayerData, isWinner: boolean) => {
  return {
    name: data.name,
    card: data.hand,
    ghostCard: data.ghostHand,
    stackLength: data.stack.length,
    isHuman: data.nature === 'human',
    isWinner: isWinner,
  };
};
const Winner = styled.div`
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-transform: uppercase;
  .winner {
    color: red;
    flex: 0;
  }
`;

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
  const { state: settings } = useSettingsContext();

  const { state, dispatch, setChoices } = useBattleContext();

  const foes = state.players.slice(0, -1);
  const me: PlayerData = state.players.slice(-1)[0];

  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    dispatch({ actionType: 'Reset', settings });
  }, [settings]);

  useEffect(() => {
    if (state.phase === 'loading') {
      // TODO move this to apollo hook later
      setTimeout(() => {
        const randomCards = loadRandomCards();
        const cardNumber = settings.cardNumber;
        // const playerCount = state.players.length;

        const payload = [];
        for (let i = 0; i < state.players.length; i++) {
          const stack = [];
          for (let j = 0; j < cardNumber; j++) {
            stack[j] = randomCards.shift() as OpenCard;
          }
          payload[i] = stack;
        }
        dispatch({
          actionType: 'Loaded',
          payload,
        });
        setTick(tick + 1);
      }, 500);
    } else if (state.phase === 'selected_stopped') {
      setChoices([
        () => {
          dispatch({ actionType: 'ShowHand' });
          setTimeout(() => {
            setTick(tick + 1);
          }, 600);
        },
      ]);
    } else if (state.phase === 'rolling_stopped') {
      setChoices([
        () => {
          dispatch({ actionType: 'Select', skillIndex: 0 });
          setTimeout(() => {
            setTick(tick + 1);
          }, 600);
        },
        () => {
          dispatch({ actionType: 'Select', skillIndex: 1 });
          setTimeout(() => {
            setTick(tick + 1);
          }, 600);
        },
        () => {
          dispatch({ actionType: 'Select', skillIndex: 2 });
          setTimeout(() => {
            setTick(tick + 1);
          }, 600);
        },
        () => {
          dispatch({ actionType: 'Select', skillIndex: 3 });
          setTimeout(() => {
            setTick(tick + 1);
          }, 600);
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
    const action = getNaturalAction(state);
    dispatch(action);

    if (action.actionType === 'StartLoading') {
      return;
    }

    if (action.actionType === 'LetUserSelect') {
      return;
    }

    if (action.actionType === 'StopBeforeShowHand') {
      return;
    }

    if (action.actionType === 'StopBeforeEndGame') {
      return;
    }

    const tickDelay = (() => {
      if (action.actionType === 'RollSkills') {
        return 2000;
      }
      if (action.actionType === 'FindWinner') {
        return 4000;
      }
      return 600;
    })();
    setTimeout(() => {
      setTick(tick + 1);
    }, tickDelay);
  }, [tick]);

  if (state.phase === 'finalize_stopped') {
    return (
      <Winner>
        <div className="winner">Winner 🎉</div>
        {state.winnerIndex !== undefined && <div className="">{state.players[state.winnerIndex].name}</div>}
        <Link to="/">Back to settings</Link>
      </Winner>
    );
  }

  return (
    <Wrapper>
      <div className="content">
        <div className="players them">
          {foes.map((p: PlayerData, key: number) => {
            const isWinner = key === state.winnerIndex;
            const playerProps = playerDataToProps(p, isWinner);
            return (
              <PlayerProvider key={key} {...playerProps}>
                <Player {...playerProps} />
              </PlayerProvider>
            );
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
