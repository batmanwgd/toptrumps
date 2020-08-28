import React from 'react';
import './App.css';

import { Form } from './setup/Form';
import { Board } from './toptrumps/Board';
import { BattleProvider } from './toptrumps/BattleContext';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <BattleProvider>
        <Board />
      </BattleProvider> */}
      <Form />
    </div>
  );
};

export default App;
