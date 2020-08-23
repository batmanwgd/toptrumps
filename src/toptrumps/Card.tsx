import React from 'react';
import styled from 'styled-components';

import { Card as CardType, OpenCard } from './types';
import { SizedCardFlip } from './SizedCardFlip';
import { CardInfo } from './CardInfo';

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
`;

interface CardProps {
  card: CardType;
  actionRequired: boolean;
}

export const Card: React.FC<CardProps> = (props: CardProps) => {
  const card = props.card;
  const openCard = card as OpenCard;

  return (
    <Wrapper>
      <SizedCardFlip isFlipped={openCard.open} flipDirection="horizontal">
        <div className={`back ${props.actionRequired ? 'active' : ''}`}>
          <div className="text">Show your card!</div>
        </div>
        <CardInfo card={card} />
      </SizedCardFlip>
    </Wrapper>
  );
};
