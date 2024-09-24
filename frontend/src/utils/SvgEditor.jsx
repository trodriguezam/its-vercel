import React, { useEffect, useRef } from 'react';
import ComplexInclinedPlane from '../assets/complex/inclined-plane.svg?react';
import ComplexBody from '../assets/complex/body.svg?react';
import ComplexBodyCenter from '../assets/complex/body-center.svg?react';
import ComplexBluePinkArch from '../assets/complex/blue-pink-arch.svg?react';
import ComplexPlaneArch from '../assets/complex/plane-arch.svg?react';
import ComplexBlue from '../assets/complex/blue.svg?react';
import ComplexBrown from '../assets/complex/brown.svg?react';
import ComplexGreen from '../assets/complex/green.svg?react';
import ComplexPink from '../assets/complex/pink.svg?react';
import ComplexRed from '../assets/complex/red.svg?react';
import ComplexYellow from '../assets/complex/yellow.svg?react';

import SimpleHorizontalPlane from '../assets/simple/horizontal-plane.svg?react';
import SimpleBody from '../assets/simple/body.svg?react';
import SimpleBodyCenter from '../assets/simple/body-center.svg?react';
import SimpleLeft from '../assets/simple/left.svg?react';
import SimpleRight from '../assets/simple/right.svg?react';

const Op = {
  'Complex': {
    'inclined-plane': ComplexInclinedPlane,
    'body': ComplexBody,
    'body-center': ComplexBodyCenter,
    'plane-arch': ComplexPlaneArch,
    'blue-pink-arch': ComplexBluePinkArch,
    'blue': ComplexBlue,
    'brown': ComplexBrown,
    'green': ComplexGreen,
    'pink': ComplexPink,
    'red': ComplexRed,
    'yellow': ComplexYellow,
  },
  'Simple': {
    'horizontal-plane': SimpleHorizontalPlane,
    'body': SimpleBody,
    'body-center': SimpleBodyCenter,
    'left': SimpleLeft,
    'right': SimpleRight
  }
}

const ToggleSvg = ({ svg, components }) => {
  return (
    <>
      {components.map(ComponentKey => {
        const DclComponent = Op[svg][ComponentKey];
        return <DclComponent key={ComponentKey} />;
      })}
    </>
  )
}

function Dcl({ type, keys, modifications }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && modifications) {
      modifications.forEach(({ id, newText }) => {
        const element = svgRef.current.querySelector(`#${id}`);
        if (element) {
          element.textContent = newText;
        }
      });
    }
  }, [modifications]);

  return (
    <svg
      width="800"
      height="600"
      viewBox="0 0 800 600"
      xmlSpace="preserve"
      ref={svgRef}
    >
      <ToggleSvg svg={type} components={keys} />
    </svg>
  );
}

export default Dcl;