import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Card } from './types';
import { Card as CardComponent } from './Card';
import { breakpointSmall } from './constants';
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
  margin-top: 5pt;
  &:first-child {
    margin-top: 0;
  }

  height: 100%;
  .player {
    &.out {
      animation: ${partiallyDisappear} 0.2s linear;
      opacity: 0.5;
    }
    &.winner {
      cursor: pointer;
    }
    text-transform: uppercase;
    border-radius: 5px;
    display: flex;
    justify-content: center;
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
    padding: 5pt;

    width: 240px;
    .player-content {
      height: 220px;
      & > div {
        height: 100%;
      }
    }
    @media (max-width: ${breakpointSmall}) {
      width: auto;
      min-width: 300px;
      .player-content {
        height: 100px;
        .react-card-flip .react-card-back .card {
          height: 100%;
        }
      }
    }
  }
`;

export interface PlayerProps {
  name: string;
  card?: Card;
  ghostCard?: Card;
  stackLength: number;
  isHuman: boolean;
  isWinner: boolean;
}

export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const {
    state: { phase },
    choices,
  } = useBattleContext();

  const isFinalWinner = phase === 'finalize_stopped' && props.stackLength > 0;

  const handlePlayerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isFinalWinner) {
      return;
    }
    const choice = choices[0];
    choice();
  };
  const out = !props.card && props.stackLength === 0;
  return (
    <Wrapper>
      <div className={`player ${out ? 'out' : ''} ${isFinalWinner ? 'winner' : ''}`} onClick={handlePlayerClick}>
        <div className="title">
          <div className="name">{props.name}</div>
          <div className="stack">{props.stackLength}</div>
        </div>
        <div className="player-content">
          {props.card && (
            <div className={`hand ${props.isWinner ? 'winner' : ''}`}>
              <CardComponent card={props.card} />
            </div>
          )}
          {props.ghostCard && (
            <div className="ghost">
              <CardComponent card={props.ghostCard} />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
