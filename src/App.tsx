import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Form } from './setup/Form';
import { Board } from './toptrumps/Board';
import { BattleProvider } from './toptrumps/BattleContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/game">
            <BattleProvider>
              <Board />
            </BattleProvider>
          </Route>
          <Route path="/">
            <Form />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
