import React from 'react';
import './App.css';

import { Board } from './toptrumps/Board';
import { BattleProvider } from './toptrumps/BattleContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <BattleProvider>
        <Board />
      </BattleProvider>
    </div>
  );
};

export default App;
