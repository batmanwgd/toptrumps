import React from 'react';
import styled from 'styled-components';
import { breakpointSmall } from '../toptrumps/constants';
import { useSettingsContext } from './SettingsContext';
import { useHistory } from 'react-router-dom';

const Item = styled.div`
  padding-bottom: 10pt;
  color: white;
  width: 240px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  & > .clickable {
    cursor: pointer;
  }

  & > .add {
    height: 40px;
  }

  @media (max-width: ${breakpointSmall}) {
    width: 100%;

    box-sizing: border-box;

    flex-direction: row;
    justify-content: center;
    align-items: baseline;

    & > input {
      flex: 1 0;
    }
    & > .add {
      border: 1px dotted white;
    }

    & > .add {
      height: 30px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      * {

      }
    }
  }
    & > label {
      flex: 0 1;
      padding: 0 5pt;
    }
  }
`;

const Wrapper = styled.div`
  font-size: 1em;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: stretch;

  text-transform: uppercase;

  input {
    height: 30px;
  }
  select {
    height: 30px;
    width: 240px;
    padding: 0 10pt;

    option {
      padding: 10pt;
    }
  }
  h2 {
    border: 0;
    border-bottom: 2px solid white;
    color: white;
    font-size: 0.75em;
    padding-top: 10pt;
  }
  .content {
    height: 100%;

    flex: 1 1;
  }
  div.players {
    padding: 5pt;

    display: flex;
    justify-content: space-around;
    align-items: stretch;
  }
  .footer {
    padding: 5pt;
    flex: 0 1;
    margin: 0 auto;
    button {
      border: 3px solid #d22f27;
      background: #ea5a47;
      cursor: pointer;
      text-transform: uppercase;
      cursor: pointer;
      display: block;
      height: 60px;
      width: 240px;
      color: white;
    }
  }

  @media (max-width: ${breakpointSmall}) {
    div.players {
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
    }
    .footer {
      margin: 0;

      button {
        width: 100%;
      }
    }
  }
`;

export const Form: React.FC = () => {
  const { state, setState } = useSettingsContext();

  const addOpponent = (key: number) => {
    const opponents = state.opponents.map((opponent: string | undefined, index: number) => {
      if (index === key) {
        return ['Alice', 'Bob', 'Charley'][index];
      }
      return opponent;
    });
    setState({
      ...state,
      opponents,
    });
  };
  const removeOpponent = (key: number) => {
    const opponents = state.opponents.map((opponent: string | undefined, index: number) => {
      if (index === key) {
        return undefined;
      }
      return opponent;
    });
    setState({
      ...state,
      opponents,
    });
  };

  const editOpponent = (key: number, value: string) => {
    const opponents = state.opponents.map((opponent: string | undefined, index: number) => {
      if (index === key) {
        return value;
      }
      return opponent;
    });
    setState({
      ...state,
      opponents,
    });
  };

  const editUser = (value: string) => {
    setState({
      ...state,
      user: value,
    });
  };

  const handleEditUser = (ev: React.FormEvent<HTMLInputElement>) => {
    ev.preventDefault();
    editUser(ev.currentTarget.value);
  };

  const handleAddOpponent = (ev: React.MouseEvent<HTMLElement>) => {
    ev.preventDefault();
    const defaultName = ['Alice', 'Bob', 'Charley'][state.opponents.length];

    setState({
      ...state,
      opponents: [...state.opponents, defaultName],
    });
  };

  const handleCardSelect = (ev: React.FormEvent<HTMLSelectElement>) => {
    ev.preventDefault();
    setState({
      ...state,
      cardNumber: parseInt(ev.currentTarget.value),
    });
  };

  const history = useHistory();
  const handleSubmit = (ev: React.FormEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (state.opponents.every((opponent?: string) => opponent === undefined)) {
      alert('You must select at least one opponent');
      return;
    }
    history.push('/game');
  };
  return (
    <Wrapper>
      <div className="content">
        <h2>Opponents:</h2>
        <div className="players them">
          {state.opponents.map((name: string | undefined, key: number) => {
            const handleRemove = (ev: React.MouseEvent<HTMLElement>) => {
              ev.preventDefault();
              removeOpponent(key);
            };
            const handleEdit = (ev: React.FormEvent<HTMLInputElement>) => {
              ev.preventDefault();
              editOpponent(key, ev.currentTarget.value);
            };
            const handleAdd = (ev: React.MouseEvent<HTMLElement>) => {
              ev.preventDefault();
              addOpponent(key);
            };
            if (name !== undefined) {
              return (
                <Item key={key}>
                  <input id={`input-${key}`} defaultValue={name} onChange={handleEdit} />
                  <label className="clickable" htmlFor={`input-${key}`} onClick={handleRemove}>
                    remove
                  </label>
                </Item>
              );
            }
            if (name === undefined) {
              return (
                <Item onClick={handleAdd}>
                  <div className="add clickable">
                    <span>⊕</span>Add Opponent
                  </div>
                </Item>
              );
            }
          })}
          {state.opponents.length < 3 && (
            <Item onClick={handleAddOpponent}>
              <div className="add clickable">
                <span>⊕</span>Add Opponent
              </div>
            </Item>
          )}
        </div>
        <h2>your name:</h2>
        <div className="players them">
          <Item>
            <input id={`input-me`} onChange={handleEditUser} defaultValue={state.user} />
          </Item>
        </div>
        <h2>settings</h2>
        <select onChange={handleCardSelect} value={state.cardNumber}>
          <option value="1">1 card</option>
          <option value="3">3 cards</option>
          <option value="5">5 cards</option>
        </select>
      </div>

      <div className="footer">
        <button onClick={handleSubmit}>Play Top trumps</button>
      </div>
    </Wrapper>
  );
};
