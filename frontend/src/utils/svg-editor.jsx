import { SvgLoader } from 'react-svgmt'

const Dcl = () => {
  const svgDir = './dcl.svg'
  const svgDir2 = './dcl2.svg'

  return (
    <>
      <SvgLoader path={svgDir} />
      <SvgLoader path={svgDir2} />
    </>
  )
}

export default Dcl