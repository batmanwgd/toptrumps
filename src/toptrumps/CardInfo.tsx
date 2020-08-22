import React from 'react';
import styled from 'styled-components';

import { Card as CardType, OpenCard } from './types';
import { breakpointSmall } from './constants';

const Wrapper = styled.div`
  margin: 1px;
  border: 3px solid #f1b31c;
  .active .back {
    border: 3px solid red;
  }
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

  return (
    <Wrapper>
      <div className="name">{card.name}</div>
      <ul className="scores">
        <li className="abilityLine">
          <span className="ability">Cost:</span>
          <span className="value">{card.skills.costInCredits}</span>
        </li>
        <li className="abilityLine">
          <span className="ability">H-Rating:</span>
          <span className="value">{card.skills.hyperdriveRating}</span>
        </li>
        <li className="abilityLine">
          <span className="ability">Length:</span>
          <span className="value">{card.skills.length}</span>
        </li>
        <li className="abilityLine">
          <span className="ability">Cargo:</span>
          <span className="value">{card.skills.cargoCapacity}</span>
        </li>
      </ul>
    </Wrapper>
  );
};
