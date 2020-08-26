import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from './types';
import { Card as CardComponent } from './Card';
import { breakpointSmall } from './constants';
import { CardInfo } from './CardInfo';
import { useBattleContext } from './BattleContext';

const shine = keyframes`
  {
    0% {
      background: auto;
    }
    50% {
      background: #ea5a47;
    }
    100% {
      background: auto;
    }
  }
`;

const disappear = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const partiallyDisappear = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
`;

const Wrapper = styled.div`
  text-transform: uppercase;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  .ghost {
    animation: ${disappear} 0.2s linear;
    opacity: 0;
  }
  .winner .card .selected {
    animation: ${shine} 1s linear;
    animation-iteration-count: infinite;
  }
  & > .title {
    font-size: 0.75em;
    padding: 6pt 0;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span.winner {
      color: #d22f27;
    }
    & > .name {
      text-align: left;
    }
    & > .stack::before {
      content: '⨯ ';
      color: #999;
    }
  }
  background: white;
  margin-top: 5pt;
  &::first {
    margin-top: 0;
  }

  padding: 5pt;

  width: 240px;
  @media (max-width: ${breakpointSmall}) {
    width: auto;
    min-width: 300px;
  }
`;

interface PlayerProps {
  name: string;
  card?: Card;
  ghostCard?: Card;
  stackLength: number;
  actionRequired: boolean;
  isWinner: boolean;
}

const fillerCardProps: Card = {
  name: '???',
  open: true,
  roll: false,
  type: 'open',
  skills: {
    cargoCapacity: 0,
    costInCredits: 0,
    length: 0,
    hyperdriveRating: 0,
  },
};

const Invisible = styled.div`
  visibility: hidden;
`;

const fillerCard = (
  <Invisible>
    <CardInfo card={fillerCardProps} />
  </Invisible>
);

const Out = styled.div`
  animation: ${partiallyDisappear} 0.2s linear;
  opacity: 0.5;
`;

const Winner = styled.div`
  cursor: pointer;
`;

export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { phase, choices } = useBattleContext();
  const isFinalWinner = phase === 'finalize' && props.stackLength > 0;

  const handlePlayerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    const choice = choices[0];
    choice();
  };
  const out = !props.card && props.stackLength === 0;
  const styled = (
    <Wrapper>
      <div className="title">
        <div className="name">
          {props.name}
          {isFinalWinner && <span className="winner"> Winner 🎉</span>}
        </div>
        <div className="stack">{props.stackLength}</div>
      </div>

      {props.card && (
        <div className={`${props.isWinner ? 'winner' : ''}`}>
          <CardComponent card={props.card} />
        </div>
      )}
      {props.ghostCard && (
        <div className="ghost">
          <CardComponent card={props.ghostCard} />
        </div>
      )}
      {!props.card && !props.ghostCard && fillerCard}
    </Wrapper>
  );
  if (out) {
    return <Out>{styled}</Out>;
  }
  if (isFinalWinner) {
    return (
      <Winner>
        <div onClick={handlePlayerClick}>{styled}</div>
      </Winner>
    );
  }
  return styled;
};
