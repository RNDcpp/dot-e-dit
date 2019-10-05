import * as React from 'react';
interface Props {
  zx:number,
  x:number,
  handler: (x:number)=>void,
  width:number,
  pinColor:string
};
interface State {
  zx:number,
  on:boolean,
  rx:number,
  x:number
};

declare var TouchEvent: {
  prototype: TouchEvent;
  new(): TouchEvent;
}

export default class Slider extends React.Component<Props, State> {
                  constructor(props:Props) {
                   super(props);
                   this.state = {
                     zx: props.zx,
                     on: false,
                     rx: 0,
                     x: props.x
                   };
                 }
                 handleMouseDown(t:Slider) {
                   return (event:React.MouseEvent<SVGCircleElement, MouseEvent>) => {
                     let new_state:State;
                     new_state = t.state;
                     let x = 0;
                     //if (event.touches && event.touches[0]) {
                     //    x = event.touches[0].clientX;
                     //} else if (event.originalEvent && event.originalEvent.changedTouches[0]) {
                     //    x = event.originalEvent.changedTouches[0].clientX;
                     //} else if (event.clientX && event.clientY) {
                     x = event.clientX;
                     //}
                     new_state.rx = x - new_state["x"];
                     new_state.on = true;
                     t.setState(new_state);
                   };
                 }
                 handleTouchDown(t:Slider) {
                  return (event:React.TouchEvent<SVGCircleElement>) => {
                    let new_state:State;
                    new_state = t.state;
                    let x = 0;
                    if (event.touches && event.touches[0]) {
                      x = event.touches[0].clientX;
                    } 
                    //else if (event.originalEvent && event.originalEvent.changedTouches[0]) {
                    //  x = event.originalEvent.changedTouches[0].clientX;
                    //}
                    new_state.rx = x - new_state["x"];
                    new_state.on = true;
                    t.setState(new_state);
                  };
                }
                 handleMouseUp(t:Slider) {
                   return () => {
                     let new_state:State;
                     new_state = t.state;
                     new_state.on = false;
                     t.setState(new_state);
                     t.props.handler(
                      (t.state.x - t.state.zx)/t.props.width+0.5
                     );
                   };
                 }
                 handleMouseMove(t:Slider) {
                   return (event:React.MouseEvent<SVGCircleElement, MouseEvent>) => {
                     if (this.state.on) {
                       let x = 0;
                       x = event.clientX;
                       x = x - this.state.rx;
                       if (x < 0) {
                         x = 0
                       }
                       if (x > this.props.width) {
                         x=this.props.width;
                       }
                       let new_state:State;
                       new_state = this.state;
                       new_state.x = x;
                       this.setState(new_state);
                       t.props.handler(
                        (t.state.x - t.state.zx)/t.props.width+0.5
                       );
                     }
                   };
                 }
                 handleTouchMove(t:Slider) {
                  return (event:React.TouchEvent<SVGCircleElement>) => {
                    if (this.state.on) {
                      let x = 0;
                      if (
                        event.touches &&
                        event.touches[0]
                      ) 
                      {
                        x = event.touches[0].clientX;
                      } 
                      //else if (
//
  //                      event.originalEvent &&
    //                    event.originalEvent
      //                    .changedTouches[0]
        //              ) {
//                        x =
  //                        event.originalevent
    //                        .changedtouches[0].clientx;
      //                } else if (
                      x = x - this.state.rx;
                      if (x < 0) {
                        x = 0
                      }
                      if (x > this.props.width) {
                        x=this.props.width;
                      }
                      let new_state:State;
                      new_state = this.state;
                      new_state.x = x;
                      this.setState(new_state);
                      t.props.handler(
                       (t.state.x - t.state.zx)/t.props.width+0.5
                      );
                    }
                  };
                }
                 render() {
                   return (
                     <div className="slider">
                       <svg width={this.props.width+50+"px"} height="50">
                         <rect
                           x="25px"
                           y="22px"
                           width={this.props.width+"px"}
                           height="5px"
                           fill="#eee"
                           stroke="#ccc"
                           strokeWidth="1px"
                         />
                         <circle
                           cx={this.state.x+25}
                           cy="25"
                           r="10"
                           fill={this.props.pinColor}
                           stroke="#eee"
                           strokeWidth="1"
                           onMouseDown={this.handleMouseDown(
                             this
                           )}
                           onMouseUp={this.handleMouseUp(
                             this
                           )}
                           onMouseMove={this.handleMouseMove(
                             this
                           )}
                           onMouseOut={this.handleMouseUp(
                             this
                           )}
                           onTouchStart={this.handleTouchDown(this)}
                           onTouchEnd={this.handleMouseUp(this)}
                           onTouchMove={this.handleTouchMove(this)}
                         />
                       </svg>
                     </div>
                   );
                 }
               }
