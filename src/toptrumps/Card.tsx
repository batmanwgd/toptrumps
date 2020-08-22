import React, { useState, MouseEvent } from 'react';
import styled from 'styled-components';

import { Card as CardType, OpenCard } from './types';
import { breakpointSmall } from './constants';
import { SizedCardFlip } from './SizedCardFlip';

const Wrapper = styled.div`
  .back {
    border: 3px solid #61b2e4;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5pt;

    box-sizing: border-box;

    background: #92d3f5;

    .text {
      text-align: center;
      color: #fff;
    }
  }
  .active.back {
    border: 3px solid #d22f27;
    background: #ea5a47;
    cursor: pointer;
  }
  .card {
    margin: 1px;
    border: 3px solid #f1b31c;
  }
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
  .card {
    background: #ffeb3b;
    border-radius: 5pt;
  }
`;

const renderOpenCard = (card: OpenCard) => {
  return (
    <div className="card open">
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
    </div>
  );
};

interface CardProps {
  card: CardType;
  actionRequired: boolean;
}

export const Card: React.FC<CardProps> = (props: CardProps) => {
  const card = props.card;

  const [isFlipped, setFlipped] = useState<boolean>(false);
  const handleOpenCard = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setFlipped(true);
  };

  const OpenCard = renderOpenCard(card as OpenCard);
  return (
    <Wrapper>
      <SizedCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div className={`back ${props.actionRequired ? 'active' : ''}`} onClick={handleOpenCard}>
          <div className="text">Show your card!</div>
        </div>
        {OpenCard}
      </SizedCardFlip>
    </Wrapper>
  );
};
