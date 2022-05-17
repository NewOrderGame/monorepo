import styled from 'styled-components';
import * as React from 'react';

function FogOfWarSvg({
  width,
  height,
  className
}: {
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <defs>
        <filter id="blur" x="-20%" y="-20%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>
      <mask id="mask">
        <rect fill="white" width="100%" height="100%" />
        <circle fill="black" cx="50%" cy="50%" r="240px" filter="url(#blur)" />
      </mask>
      <rect
        mask="url(#mask)"
        fill="rgba(0,0,0,0.5)"
        width="100%"
        height="100%"
      />
    </svg>
  );
}

export const FogOfWar = styled(FogOfWarSvg)`
  z-index: 500;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`;
