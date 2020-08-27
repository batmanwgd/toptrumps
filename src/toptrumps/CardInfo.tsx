import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Card as CardType, OpenCard } from './types';
import { breakpointSmall } from './constants';
import { useBattleContext } from './BattleContext';

const Wrapper = styled.div`
  margin: 1px;
  border: 3px solid #f1b31c;
  display: flex;
  flex-direction: column;
  .name {
    font-size: 0.75em;
    padding-top: 10pt;
  }
  ul.scores {
    display: flex;
    flex-direction: column;

    padding-left: 0;
    margin: 0;
    list-style: none;

    @media (max-width: ${breakpointSmall}) {
      display: grid;
      grid-template-columns: auto auto;
    }
    li.abilityLine {
      display: flex;
      padding: 10pt;
      content-justify: space-between;
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
  background: #ffeb3b;
  border-radius: 5pt;
`;

interface CardInfoProps {
  card: CardType;
}

export const CardInfo: React.FC<CardInfoProps> = (props: CardInfoProps) => {
  const card = props.card as OpenCard;

  const [flash, setFlash] = useState<number>(-1);

  const { selectedSkill } = useBattleContext();
  const rolling = card.rolling;
  useEffect(() => {
    if (rolling) {
      setTimeout(() => {
        setFlash((flash + 1) % 4);
      }, 200);
    }
  }, [flash, rolling]);

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
