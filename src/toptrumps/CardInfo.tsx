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

  const { selectedSkill } = useBattleContext();
  const rolling = card.rolling && selectedSkill < 0;
  useEffect(() => {
    if (rolling) {
      setTimeout(() => {
        setFlash((flash + 1) % 4);
      }, 200);
    } else if (selectedSkill >= 0) {
      setFlash(-1);
    }
  }, [flash, rolling, selectedSkill]);

  return (
    <Wrapper className="card">
      <div className="name">{card.name}</div>
      <ul className="scores">
        <li className={`abilityLine ${flash === 0 ? 'flash' : ''} ${selectedSkill === 0 ? 'selected' : ''}`}>
          <span className="ability">Cost:</span>
          <span className="value">{card.skills.costInCredits}</span>
        </li>
        <li className={`abilityLine ${flash === 1 ? 'flash' : ''} ${selectedSkill === 1 ? 'selected' : ''}`}>
          <span className="ability">H-Rating:</span>
          <span className="value">{card.skills.hyperdriveRating}</span>
        </li>
        <li className={`abilityLine ${flash === 2 ? 'flash' : ''} ${selectedSkill === 2 ? 'selected' : ''}`}>
          <span className="ability">Length:</span>
          <span className="value">{card.skills.length}</span>
        </li>
        <li className={`abilityLine ${flash === 3 ? 'flash' : ''} ${selectedSkill === 3 ? 'selected' : ''}`}>
          <span className="ability">Cargo:</span>
          <span className="value">{card.skills.cargoCapacity}</span>
        </li>
      </ul>
    </Wrapper>
  );
};
