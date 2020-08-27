import React, { useState, useReducer } from 'react';
import { BattleState } from './types';
import { BattleAction, battleReducer } from './battle';

type Choice = () => void;
type Choices = Choice[];

const initialBattleState: BattleState = {
  players: [
    { name: 'gitanas nauseda', stack: [], nature: 'bot' },
    { name: 'celofanas', stack: [], nature: 'bot' },
    { name: 'luke 10x', stack: [], nature: 'human' },
  ],
  leaderIndex: 2,
  activeIndex: 2,
  phase: 'clear',
};

interface BattleContextProps {
  choices: Choices;
  setChoices: (choices: Choices) => void;
  state: BattleState;
  dispatch: (action: BattleAction) => void;
}

export const BattleContext = React.createContext<BattleContextProps>({
  choices: [],
  setChoices: () => {
    console.error('😕 Context setter called before it is initialized');
  },
  state: initialBattleState,
  dispatch: () => {
    console.error('😕 Context dispatch called before it is initialized');
  },
});

export const BattleProvider: React.FC = (props: any) => {
  const [choices, setChoices] = useState<Choices>([]);
  const [state, dispatch] = useReducer<React.Reducer<BattleState, BattleAction>>(battleReducer, initialBattleState);

  return (
    <BattleContext.Provider
      value={{
        choices,
        setChoices,
        state,
        dispatch,
      }}
    >
      {props.children}
    </BattleContext.Provider>
  );
};

export const useBattleContext = (): BattleContextProps => React.useContext(BattleContext);
