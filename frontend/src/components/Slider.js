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
                     console.log("mousedown");
                     console.log(event.clientX - t.state.x);
                     let new_state = t.state;
                     let x = 0
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
                     console.log("mouseup");
                     let new_state = t.state;
                     new_state["on"] = false;
                     t.setState();
                   };
                   //this.props.handler(
                   //  this.state.x - this.state.zx
                   //);
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
                       console.log(x);
                       let new_state = this.state;
                       new_state["x"] = x;
                       this.setState(new_state);
                     }
                   };
                 }
                 render() {
                   return (
                     <div class="slider">
                       <svg width="150" height="50">
                         <rect
                           x="0px"
                           y="22px"
                           width="150px"
                           height="5px"
                           fill="#eee"
                           stroke="#ccc"
                           strokeWidth="1px"
                         />
                         <circle
                           cx={this.state.x}
                           cy="25"
                           r="10"
                           fill="#ccc"
                           stroke="#eee"
                           stroke-width="1"
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
