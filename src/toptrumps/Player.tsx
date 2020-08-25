import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from './types';
import { Card as CardComponent } from './Card';
import { breakpointSmall } from './constants';
import { CardInfo } from './CardInfo';

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

const Wrapper = styled.div`
  text-transform: uppercase;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
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
    & > .name {
      text-align: left;
    }
    & > .stack::before {
      content: '⨯ ';
      color: #999;
    }
  }
  background: white;
  & + & {
    margin-top: 5pt;
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
  stackLength: number;
  actionRequired: boolean;
  isWinner: boolean;
}

const ghostCardProps: Card = {
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

const ghostCard = (
  <Invisible>
    <CardInfo card={ghostCardProps} />
  </Invisible>
);

// const props.card
export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  return (
    <Wrapper>
      <div className="title">
        <div className="name">{props.name}</div>
        <div className="stack">{props.stackLength}</div>
      </div>
      {props.card && (
        <div className={`${props.isWinner ? 'winner' : ''}`}>
          <CardComponent card={props.card} />
        </div>
      )}
      {!props.card && ghostCard}
    </Wrapper>
  );
};
