import React, { useState } from 'react';

type Choice = () => void;
type Choices = Choice[];

interface BattleContextProps {
  selectedSkill: number;
  setSelectedSkill: (skillIndex: number) => void;
  choices: Choices;
  setChoices: (choices: Choices) => void;
}

export const BattleContext = React.createContext<BattleContextProps>({
  selectedSkill: -10,
  setSelectedSkill: () => {
    console.error('😕 Context setter called before it is initialized');
  },
  choices: [],
  setChoices: () => {
    console.error('😕 Context setter called before it is initialized');
  },
});

export const BattleProvider: React.FC = (props: any) => {
  const [selectedSkill, setSelectedSkill] = useState<number>(-1);
  const [choices, setChoices] = useState<Choices>([]);

  return (
    <BattleContext.Provider
      value={{
        selectedSkill,
        setSelectedSkill,
        choices,
        setChoices,
      }}
    >
      {props.children}
    </BattleContext.Provider>
  );
};

export const useBattleContext = (): BattleContextProps => React.useContext(BattleContext);
