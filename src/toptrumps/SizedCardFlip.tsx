import React, { useState, useRef, useEffect } from 'react';
import ReactCardFlip, { ReactFlipCardProps } from 'react-card-flip';
import styled from 'styled-components';

const Wrapper = styled.div`
  .sizedBackOfTheCard {
    & > .wedge {
      visibility: hidden;
    }
    & > .filler {
      width: 100%;
      position: absolute;
      overflow: hidden;
    }
  }
`;

export const SizedCardFlip: React.FC<ReactFlipCardProps> = (props: ReactFlipCardProps) => {
  const [ClosedCard, OpenCard] = props.children;

  const faceRef = useRef(null);

  const [cardHeight, setCardHeight] = useState<number>(0);
  const [winSize, setWinSize] = useState<string>('0x0');

  React.useEffect(() => {
    function handleResize() {
      setWinSize(window.innerWidth + 'x' + window.innerHeight);
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight);
    }
    window.addEventListener('resize', handleResize);
  });
  useEffect(() => {
    const spacerEl: HTMLElement | null = faceRef?.current;
    if (spacerEl !== null) {
      setCardHeight((spacerEl as Element).clientHeight);
    }
  }, [winSize]);

  const back = (
    <div className="sizedBackOfTheCard" ref={faceRef}>
      <div className="filler" style={{ height: cardHeight }}>
        {ClosedCard}
      </div>
      <div className="wedge">{OpenCard}</div>
    </div>
  );

  return (
    <Wrapper>
      <ReactCardFlip {...props}>
        {back}
        {OpenCard}
      </ReactCardFlip>
    </Wrapper>
  );
};
