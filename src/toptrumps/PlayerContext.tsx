import React from 'react';
import { PlayerProps } from './Player';

export const PlayerContext = React.createContext<PlayerProps>({
  isHuman: true,
  name: 'not set',
  isWinner: false,
  stackLength: 0,
});

export const PlayerProvider: React.FC = (props: any) => {
  return <PlayerContext.Provider value={props}>{props.children}</PlayerContext.Provider>;
};

export const usePlayerContext = (): PlayerProps => React.useContext(PlayerContext);
