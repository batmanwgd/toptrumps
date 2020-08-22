import React, { useState, MouseEvent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactCardFlip from 'react-card-flip';

import { Card as CardType, OpenCard } from './types';
import { breakpointSmall } from './constants';

const Wrapper = styled.div`
  .back {
    .card {
      visibility: hidden;
    }
    .overlay {
      border-radius: 5pt;

      width: 100%;
      position: absolute;

      overflow: hidden;
    }
  }

  .realBack {
    background: red;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    .text {
      text-align: center;
      border: 1px solid yellow;
    }
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
}

export const Card: React.FC<CardProps> = (props: CardProps) => {
  const card = props.card;
  const faceRef = useRef(null);

  const [isFlipped, setFlipped] = useState<boolean>(false);
  const [cardHeight, setCardHeight] = useState<number>(0);
  const [winSize, setWinSize] = useState<string>('0x0');
  const handleOpenCard = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setFlipped(true);
  };
  React.useEffect(() => {
    function handleResize() {
      setWinSize(window.innerWidth + 'x' + window.innerHeight);
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
    }
    window.addEventListener('resize', handleResize);
  });
  useEffect(() => {
    const spacerEl: HTMLElement | null = faceRef?.current;
    if (spacerEl !== null) {
      setCardHeight((spacerEl as Element).clientHeight);
      console.log('effe', (spacerEl as Element).clientHeight);
    }
  }, [winSize]);
  const OpenCard = renderOpenCard(card as OpenCard);
  return (
    <Wrapper>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div className="back" ref={faceRef}>
          <div className="overlay" style={{ height: cardHeight }}>
            <div className="realBack" onClick={handleOpenCard}>
              <div className="text">Show your card!</div>
            </div>
          </div>
          {OpenCard}
        </div>
        <div className="front">{OpenCard}</div>
      </ReactCardFlip>
    </Wrapper>
  );
};
