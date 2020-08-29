import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Form } from './setup/Form';
import { Board } from './toptrumps/Board';
import { BattleProvider } from './toptrumps/BattleContext';
import { SettingsProvider } from './setup/SettingsContext';

const App: React.FC = () => {
  return (
    <div className="App">
      <SettingsProvider>
        <Router basename="/toptrumps">
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
      </SettingsProvider>
    </div>
  );
};

export default App;
