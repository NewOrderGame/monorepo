import styled from 'styled-components';
import * as React from 'react';

export function LoaderSvg({ className }: { className?: string }) {
  return (
    <svg
      version="1.1"
      id="preloader2"
      xmlns="http://www.w3.org/2000/svg"
      width="140px"
      height="140px"
      viewBox="0 0 200 200"
      className={className}
    >
      <g className="pre load2">
        <path
          fill="#FFFFFF"
          d="M124.5,57L124.5,57c0,3.9-3.1,7-7,7h-36c-3.9,0-7-3.1-7-7v0c0-3.9,3.1-7,7-7h36
	C121.4,50,124.5,53.1,124.5,57z"
        />
        <path
          fill="#FFFFFF"
          d="M147.7,86.9L147.7,86.9c-2.7,2.7-7.2,2.7-9.9,0l-25.5-25.5c-2.7-2.7-2.7-7.2,0-9.9l0,0
	c2.7-2.7,7.2-2.7,9.9,0L147.7,77C150.5,79.8,150.5,84.2,147.7,86.9z"
        />
        <path
          fill="#FFFFFF"
          d="M143,74.5L143,74.5c3.9,0,7,3.1,7,7v36c0,3.9-3.1,7-7,7l0,0c-3.9,0-7-3.1-7-7v-36
	C136,77.6,139.1,74.5,143,74.5z"
        />
        <path
          fill="#FFFFFF"
          d="M148.4,112.4L148.4,112.4c2.7,2.7,2.7,7.2,0,9.9L123,147.7c-2.7,2.7-7.2,2.7-9.9,0h0c-2.7-2.7-2.7-7.2,0-9.9
	l25.5-25.5C141.3,109.6,145.7,109.6,148.4,112.4z"
        />
        <path
          fill="#FFFFFF"
          d="M125.5,143L125.5,143c0,3.9-3.1,7-7,7h-36c-3.9,0-7-3.1-7-7l0,0c0-3.9,3.1-7,7-7h36 C122.4,136,125.5,139.1,125.5,143z"
        />
        <path
          fill="#FFFFFF"
          d="M52.3,113.1L52.3,113.1c2.7-2.7,7.2-2.7,9.9,0l25.5,25.5c2.7,2.7,2.7,7.2,0,9.9h0c-2.7,2.7-7.2,2.7-9.9,0
	L52.3,123C49.5,120.2,49.5,115.8,52.3,113.1z"
        />
        <path
          fill="#FFFFFF"
          d="M57,75.5L57,75.5c3.9,0,7,3.1,7,7v36c0,3.9-3.1,7-7,7h0c-3.9,0-7-3.1-7-7v-36C50,78.6,53.1,75.5,57,75.5z"
        />
        <path
          fill="#FFFFFF"
          d="M86.9,52.3L86.9,52.3c2.7,2.7,2.7,7.2,0,9.9L61.5,87.6c-2.7,2.7-7.2,2.7-9.9,0l0,0c-2.7-2.7-2.7-7.2,0-9.9
	L77,52.3C79.8,49.5,84.2,49.5,86.9,52.3z"
        />
      </g>
    </svg>
  );
}

export const Loader = styled(LoaderSvg)`
  .load2 path:nth-of-type(1),
  .load2 path:nth-of-type(5) {
    -webkit-animation: spin_full 2s linear infinite;
    animation: spin_full 2s linear infinite;
  }

  .load2 path:nth-of-type(2),
  .load2 path:nth-of-type(6) {
    -webkit-animation: spin_full 2s linear infinite;
    animation: spin_full 2s linear infinite;
  }

  .load2 path:nth-of-type(3),
  .load2 path:nth-of-type(7) {
    -webkit-animation: spin_full 2s linear infinite;
    animation: spin_full 2s linear infinite;
  }

  .load2 path:nth-of-type(4),
  .load2 path:nth-of-type(8) {
    -webkit-animation: spin_full 2s linear infinite;
    animation: spin_full 2s linear infinite;
  }

  .pre path {
    transform-origin: center;
    transform-box: fill-box;
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  @-webkit-keyframes spinHalf {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(360deg);
    }
  }

  @keyframes spinHalf {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin_full {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes spin_full {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin_single_neg {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-180deg);
    }
  }
  @keyframes spin_single_neg {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-180deg);
    }
  }
  @-webkit-keyframes spin_single {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
  @keyframes spin_single {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }
`;
