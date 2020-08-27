import React from 'react';
import styled, { keyframes } from 'styled-components';

import { Card as CardType, OpenCard } from './types';
import ReactCardFlip from 'react-card-flip';
import { CardInfo } from './CardInfo';
import { useBattleContext } from './BattleContext';
import { usePlayerContext } from './PlayerContext';

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  height: 100%;

  .react-card-flip {
    height: 100%;
  }

  .back {
    animation: ${appear} 0.2s linear;
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
}

export const Card: React.FC<CardProps> = (props: CardProps) => {
  const card = props.card;
  const openCard = card as OpenCard;

  const { choices } = useBattleContext();

  const { isHuman } = usePlayerContext();

  const active = choices.length === 1 && isHuman;

  const handleBackClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (active) {
      const choiceCallback = choices[0];
      choiceCallback();
    }
  };

  return (
    <Wrapper>
      <ReactCardFlip isFlipped={openCard.open} flipDirection="horizontal">
        <div className={`back ${active ? 'active' : ''}`} onClick={handleBackClick}>
          {active && <div className="text">Show your card!</div>}
        </div>
        <CardInfo card={card} />
      </ReactCardFlip>
    </Wrapper>
  );
};
