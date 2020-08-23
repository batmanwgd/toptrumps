import React, { useState, PropsWithChildren } from 'react';

interface BattleContextProps {
  selectedSkill: number;
  setSelectedSkill: (skillIndex: number) => void;
}

export const BattleContext = React.createContext<BattleContextProps>({
  selectedSkill: -10,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSelectedSkill: () => { console.log('abuojas debesis'); },
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
