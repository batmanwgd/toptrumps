import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Card as CardType, OpenCard } from './types';
import { breakpointSmall } from './constants';
import { useBattleContext } from './BattleContext';

const Wrapper = styled.div`
  height: 100%;
  margin: 1px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  background: #ffeb3b;
  border: 3px solid #f1b31c;
  border-radius: 5pt;
  box-sizing: border-box;

  .name {
    font-size: 0.75em;
  }
  ul.scores {
    padding-left: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    justify-content: space-around;

    list-style: none;
    li.abilityLine {
      :hover {
        cursor: pointer;
      }
      padding: 10pt;
      display: flex;
      &.flash {
        background: #f1b31c;
      }
      &.selected {
        background: #f1b31c;
      }
      .ability {
        flex: 1;
        text-align: left;
      }
      .value {
        padding-left: 10pt;
        text-align: left;
      }
    }
  }
  @media (max-width: ${breakpointSmall}) {
    ul.scores {
      font-size: 0.75em;
      display: flex;
      flex-direction: row;
      li.abilityLine {
        flex-direction: column;
        padding: 5pt;
        .value {
          padding-left: 0;
        }
      }
    }
  }
`;

interface CardInfoProps {
  card: CardType;
}

export const CardInfo: React.FC<CardInfoProps> = (props: CardInfoProps) => {
  const card = props.card as OpenCard;

  const [flash, setFlash] = useState<number>(-1);

  const {
    state: { selectedSkill, phase },
    choices,
  } = useBattleContext();

  const rolling = card.rolling && selectedSkill === undefined;
  useEffect(() => {
    if (rolling) {
      setTimeout(() => {
        setFlash((flash + 1) % 4);
      }, 200);
    } else if (selectedSkill !== undefined) {
      setFlash(-1);
    }
  }, [flash, rolling, selectedSkill]);

  const selectable = phase === 'rolling_stopped';

  const handlers = choices.map((choice: () => void) => {
    return (event: React.MouseEvent<HTMLElement>) => {
      event?.preventDefault();
      if (selectable) {
        choice();
      }
    };
  });

  return (
    <Wrapper className="card">
      <div className="name">{card.name}</div>
      <ul className="scores">
        <li
          className={`abilityLine ${selectable ? 'selectable' : ''} ${flash === 0 ? 'flash' : ''} ${
            selectedSkill === 0 ? 'selected' : ''
          }`}
          onClick={handlers[0]}
        >
          <span className="ability">Cost:</span>
          <span className="value">{card.skills.costInCredits}</span>
        </li>
        <li
          className={`abilityLine ${selectable ? 'selectable' : ''} ${flash === 1 ? 'flash' : ''} ${
            selectedSkill === 1 ? 'selected' : ''
          }`}
          onClick={handlers[1]}
        >
          <span className="ability">H-Rating:</span>
          <span className="value">{card.skills.hyperdriveRating}</span>
        </li>
        <li
          className={`abilityLine ${selectable ? 'selectable' : ''} ${flash === 2 ? 'flash' : ''} ${
            selectedSkill === 2 ? 'selected' : ''
          }`}
          onClick={handlers[2]}
        >
          <span className="ability">Length:</span>
          <span className="value">{card.skills.length}</span>
        </li>
        <li
          className={`abilityLine ${selectable ? 'selectable' : ''} ${flash === 3 ? 'flash' : ''} ${
            selectedSkill === 3 ? 'selected' : ''
          }`}
          onClick={handlers[3]}
        >
          <span className="ability">Cargo:</span>
          <span className="value">{card.skills.cargoCapacity}</span>
        </li>
      </ul>
    </Wrapper>
  );
};
