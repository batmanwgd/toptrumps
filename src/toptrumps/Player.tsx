import React from 'react';
import styled from 'styled-components';
import { Card } from './types';
import { Card as CardComponent } from './Card';
import { breakpointSmall } from './constants';

const Wrapper = styled.div`
  text-transform: uppercase;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
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
    margin-top: 3px;
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
}

export const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  return (
    <Wrapper>
      <div className="title">
        <div className="name">{props.name}</div>
        <div className="stack">{props.stackLength}</div>
      </div>
      {props.card && <CardComponent card={props.card} actionRequired={props.actionRequired} />}
    </Wrapper>
  );
};
