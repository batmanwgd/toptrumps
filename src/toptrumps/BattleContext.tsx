import React, { useState } from 'react';

interface BattleContextProps {
  selectedSkill: number;
  setSelectedSkill: (skillIndex: number) => void;
}

export const BattleContext = React.createContext<BattleContextProps>({
  selectedSkill: -10,
  setSelectedSkill: () => {
    console.error('😕 Context setter called before it is initialized');
  },
});

// export const BattleConsumer = BattleContext.Consumer;

export const BattleProvider: React.FC = (props: any) => {
  const [selectedSkill, setSelectedSkill] = useState<number>(-3);

  return (
    <BattleContext.Provider
      value={{
        selectedSkill,
        setSelectedSkill,
      }}
    >
      {props.children}
    </BattleContext.Provider>
  );
};

export const useBattleContext = (): BattleContextProps => React.useContext(BattleContext);
