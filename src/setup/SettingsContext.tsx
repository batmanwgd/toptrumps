import React, { useState } from 'react';
import { SettingsState } from './settings';

const initialSettings: SettingsState = {
  opponents: ['Alice', undefined, undefined],
  user: 'me',
  cardNumber: 3,
};

interface SettingsContextProps {
  state: SettingsState;
  setState: (settings: SettingsState) => void;
}

export const SettingsContext = React.createContext<SettingsContextProps>({
  state: initialSettings,
  setState: () => {
    console.error('😕 Settings context setter called before it is initialized');
  },
});

export const SettingsProvider: React.FC = (props: any) => {
  const [state, setState] = useState<SettingsState>(initialSettings);

  const value: SettingsContextProps = {
    state,
    setState,
  };

  return <SettingsContext.Provider value={value}>{props.children}</SettingsContext.Provider>;
};

export const useSettingsContext = (): SettingsContextProps => React.useContext(SettingsContext);
