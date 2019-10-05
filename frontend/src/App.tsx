import React, { useState } from 'react';
import LayerRoot from './modules/LayerRoot'
import PixcelMap, { PixcelMapBase } from './modules/PixcelMap';
import Layer, { LayerIndex, WorkSpace, Base } from './modules/Layer';
import Color from './modules/Color';
import { MIX_TYPE } from './modules/MixType';
import styled from 'styled-components';

interface LayerProps{
}
interface LayerState {
  root: LayerRoot
  dsize: number
}

interface PixcelMapProps {
  pixcelMap: PixcelMap
  dsize: number
  x: number
  y: number
}



const PixcelMapComponent = function(props: PixcelMapProps) {
  const dsize = props.dsize
  const x = props.x
  const y = props.y
  const w = PixcelMapBase.w * dsize
  const h = PixcelMapBase.h * dsize
 
  return <g
  x={x+"px"}
  y={y+"0px"}
  width={ w + "px"}
  height={ h + "px"}
>
  {props.pixcelMap.value.map( (row, j ) => row.map( (e, i) => {
    return (
      <rect
        x={x + dsize * i + "px"}
        y={y + dsize * j + "px"}
        width={dsize + "px"}
        height={dsize + "px"}
        fill={e.code}
        stroke="black"
        strokeWidth="1px"
        onClick={() => {
        }}
        onMouseMove={() => {
        }}
      />
    );
  }))}
</g>
}

const LayerTreeComponet = function(props: {root: LayerRoot}) {
  const root = props.root
  const typeslug = (x: Layer | Base| LayerRoot) => {
    if(x instanceof Layer) {
      return "Layer"
    }
    if(x instanceof Base) {
      return "Base"
    }
    if(x instanceof LayerRoot) {
      return "Root"
    }
  }
  const box = (obj: Layer | Base| LayerRoot, x: number,y: number) => {
    if(obj instanceof Layer) {
      obj.pixcelMap.getCode()
      obj._unmergedPixcelMap.getCode()
      return <g>
          <rect x={x+"px"} y={y+"px"} width="100" height="90" fill="white" stroke="black" strokeWidth="1px"/>
          <rect x={x+"px"} y={y+"px"} width="100" height="30" fill="#88ff88" stroke="black" strokeWidth="1px"/>
          <text x={x+"px"} y={y+21+"px"} font-family="Verdana" font-size="18" fill="blue">Layer #{obj.id}</text>
          <PixcelMapComponent pixcelMap = {obj.pixcelMap} dsize={4} x = {x+0} y= {y+40}/>
          <PixcelMapComponent pixcelMap = {obj._unmergedPixcelMap} dsize={4} x = {x+50} y= {y+40}/>
        </g>
    }
    if(obj instanceof Base) {
      return <g>
      <rect x={x+"px"} y={y+"px"} width="100" height="30" fill="#eeeeee" stroke="black" strokeWidth="1px"/>
      <text x={x+"px"} y={y+21+"px"} font-family="Verdana" font-size="21" fill="black">Base </text>
    </g>
    }
    return <g>
      <rect x={x+"px"} y={y+"px"} width="100" height="30" fill="white" stroke="black" strokeWidth="1px"/>
      <text x={x+5+"px"} y={y+21+"px"} font-family="Verdana" font-size="18" fill="black">Root #{obj.id}</text>
    </g>
  }
  const plot = (obj: Layer | Base , x: number, y: number, svg: Array<JSX.Element>) => {
    svg.push(box(obj, x, y))
    if (obj instanceof Base) {
      return (obj.parent.base === obj)?(y + 35):(y+100)
    }
    svg.push(<g stroke="green"><line x1={x+100} y1={y + 18} x2={x+120} y2={y+18}  stroke-width="3"  /></g>)
    let new_y:number = plot(obj.cliped, x + 120, y, svg)
    svg.push(<g stroke="gray"><line x1={x+50} y1={y+90} x2={x+50} y2={new_y}  stroke-width="3"  /></g>)
    new_y = plot(obj.base, x, new_y, svg)
    return new_y
  }
  let svg:Array<JSX.Element> = []
  plot(root.base, 0,40, svg)
  return  <svg
  id="tree-info"
  x="0px"
  y="0px"
  width="600px"
  height="600px"
  viewBox="0 0 600 600"
  enableBackground="new 0 0 600 600"
>
  {box(root, 0, 0)}
  <g stroke="gray"><line x1={50} y1={30} x2={50} y2={40}  stroke-width="3"  /></g>
  {svg}
 </svg>
}

const PixcelMapContainer = styled.div`
  margin-right: 3em;
`
const LayerTreeContainer = styled.div`

`
const MainContainer = styled.div`
  display: flex;
`



const LayerInfo = function(props: LayerProps, state: LayerState) {
  const root = LayerRoot.instance
  root.add()
  root.add()
  root.add()
  const red = new Color(255,0,0,1)
  const blue = new Color(0,0,255,1)
  const green = new Color(0,255,0,1)
  const harf_blue = new Color(0,0,255,0.5)
  let layer1 = LayerIndex.select(3)
  let layer2 = LayerIndex.select(2)
  layer2.clip(new Layer(layer2, layer2.cliped, MIX_TYPE.PLANE))
  layer2.clip(new Layer(layer2, layer2.cliped, MIX_TYPE.PLANE))
  let layer3 = LayerIndex.select(1)
  let layer4 = LayerIndex.select(4)
  let layer5 = LayerIndex.select(5)
  let pixcelMap = WorkSpace.instance.pixcelMap
  let pixcelMap2 = PixcelMapBase.createPixcelMapWhite()
  layer1._unmergedPixcelMap.value[2][2] = red
  layer1._unmergedPixcelMap.value[0][0] = red
  layer1._unmergedPixcelMap.value[2][3] = harf_blue
  layer1._unmergedPixcelMap.value[2][4] = blue

  pixcelMap.value[5][6] = blue
  pixcelMap.value[6][6] = blue
  pixcelMap.value[7][6] = blue
  pixcelMap.value[5][7] = blue
  pixcelMap.value[6][7] = blue
  pixcelMap.value[7][7] = blue
  pixcelMap.value[5][5] = blue
  pixcelMap.value[6][5] = blue
  pixcelMap.value[7][5] = blue
  pixcelMap.value[8][5] = harf_blue
  layer2.update(pixcelMap)

  let pixcelMap3 = PixcelMapBase.createPixcelMap()
  pixcelMap3.value[5][6] = red
  pixcelMap3.value[6][6] = red
  pixcelMap3.value[7][6] = red
  pixcelMap3.value[4][6] = red
  pixcelMap3.value[3][6] = red
  pixcelMap3.value[2][6] = red
  layer4.update(pixcelMap3)

  let pixcelMap4 = PixcelMapBase.createPixcelMap()
  pixcelMap4.value[6][5] = green
  pixcelMap4.value[6][6] = green
  pixcelMap4.value[6][7] = green
  pixcelMap4.value[6][4] = green
  pixcelMap4.value[6][3] = green
  pixcelMap4.value[6][2] = green
  layer5.update(pixcelMap4)

  pixcelMap2.value[0][0] = green
  pixcelMap2.value[1][0] = green
  pixcelMap2.value[2][0] = green
  pixcelMap2.value[2][1] = green
  pixcelMap2.value[3][2] = green
  layer3.update(pixcelMap2)


  const dsize = 30
  const x = 0
  const y = 0
  const w = PixcelMapBase.w * dsize
  const h = PixcelMapBase.h * dsize
 return<div>
   <MainContainer>
    <PixcelMapContainer>
      <svg id="editor-canvas"x={x+"px"}
  y={y+"0px"}
  width={ w + "px"}
  height={ h + "px"}
  viewBox={
    "0 0 " +
    w +
    " " +
    h
  }
  enableBackground={
    "new 0 0 " +
    w +
    " " +
    h
  }><PixcelMapComponent pixcelMap={root.plot()} dsize = {dsize} x={x} y={y}/></svg>
    </PixcelMapContainer>
    <LayerTreeContainer>
      <LayerTreeComponet root={root}/>
    </LayerTreeContainer>
    <div>
      <div>{JSON.stringify(LayerIndex.index)}</div>
      <div>{JSON.stringify(LayerIndex.select(2)._unmergedPixcelMap.getCode())}</div>
      <div>{root.info().map((log) => <div>[{log.command}, Layer #{log.id}]</div>)}</div>
    </div>
  </MainContainer>
  </div>
}
const App = function() {
  return <LayerInfo></LayerInfo>
}

export default App