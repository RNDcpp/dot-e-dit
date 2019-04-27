import React from 'react';
export default class Slider extends React.Component {
                  constructor(props) {
                   super(props);
                   this.state = {
                     zx: this.props.zx,
                     on: false,
                     rx: 0,
                     x: this.props.x
                   };
                 }
                 handleMouseDown(t) {
                   return (event) => {
                     let new_state = t.state;
                     let x = 0;
                     if (event.touches && event.touches[0]) {
                         x = event.touches[0].clientX;
                     } else if (event.originalEvent && event.originalEvent.changedTouches[0]) {
                         x = event.originalEvent.changedTouches[0].clientX;
                     } else if (event.clientX && event.clientY) {
                         x = event.clientX;
                     }
                     new_state["rx"] = x - new_state["x"];
                     new_state[`on`] = true;
                     t.setState(new_state);
                   };
                 }
                 handleMouseUp(t) {
                   return (event) => {
                     let new_state = t.state;
                     new_state["on"] = false;
                     t.setState();
                     t.props.handler(
                      (t.state.x - t.state.zx)/t.props.width+0.5
                     );
                   };
                 }
                 handleMouseMove(t) {
                   return event => {
                     if (this.state.on) {
                       let x = 0;
                       if (
                         event.touches &&
                         event.touches[0]
                       ) {
                         x = event.touches[0].clientX;
                       } else if (
                         event.originalEvent &&
                         event.originalEvent
                           .changedTouches[0]
                       ) {
                         x =
                           event.originalEvent
                             .changedTouches[0].clientX;
                       } else if (
                         event.clientX &&
                         event.clientY
                       ) {
                         x = event.clientX;
                       }
                       x = x - this.state.rx;
                       if (x < 0) {
                         x = 0
                       }
                       if (x > this.props.width) {
                         x=this.props.width;
                       }
                       let new_state = this.state;
                       new_state["x"] = x;
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
                           onTouchStart={this.handleMouseDown(this)}
                           onTouchEnd={this.handleMouseUp(this)}
                           onTouchMove={this.handleMouseMove(this)}
                         />
                       </svg>
                     </div>
                   );
                 }
               }
