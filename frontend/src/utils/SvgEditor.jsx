import ComplexInclinedPlane from '../assets/complex/inclined-plane.svg?react';
import ComplexBody from '../assets/complex/body.svg?react';
import ComplexBodyCenter from '../assets/complex/body-center.svg?react';
import ComplexBluePink from '../assets/complex/blue-pink.svg?react';
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

import './SvgEditor.css'
import React from 'react';

const Op = {
  'Complex': {
    'inclined-plane': ComplexInclinedPlane,
    'body': ComplexBody,
    'body-center': ComplexBodyCenter,
    'plane-arch': ComplexPlaneArch,
    'blue-pink': ComplexBluePink,
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
        return <DclComponent />;
      })}
    </>
  )
}

function Dcl () {
  const ComplexComponentKeys = Object.keys(Op['Complex']);
  const SimpleComponentKeys = Object.keys(Op['Simple']);

  return (
    <>
      <svg width="800" height="600" viewBox="0 0 800 600" xmlSpace="preserve">
        <ToggleSvg svg={'Complex'} components={ComplexComponentKeys} />
      </svg>
      <svg width="800" height="600" viewBox="0 0 800 600" xmlSpace="preserve">
        <ToggleSvg svg={'Simple'} components={SimpleComponentKeys} />
      </svg>
    </>
  );
}

export default Dcl