import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      wsize: 40,
      hsize: 40,
      dsize:  5,
      wlen: 32,
      hlen: 32,
      colors:[],
    }
  }
  rgb2hex ( rgb ) {
    return "#" + rgb.map( function ( value ) {
      return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
    } ).join( "" ) ;
  }
  componentDidMount(){
    let new_state={
      wsize:this.state.wsize,
      hsize:this.state.hsize,
      dsize:this.state.dsize,
      wlen:32,
      hlen:32,
      colors:[]
    }
    let i,j;
    for(i=0;i<this.state.wlen;i++){
      for(j=0;j<this.state.hlen;j++){
        new_state.colors.push(
          { 
            i: i,
            j: j,
            code: this.rgb2hex([0,0,0].map((e)=>{return Math.random()* Math.floor(256)}))
          }
        );
      }
    }
    this.setState(new_state);
  }

  chengeDsize(_dsize){
    let new_state={
      wsize:this.state.wsize,
      hsize:this.state.hsize,
      dsize:_dsize,
      wlen:32,
      hlen:32,
      colors:this.state.colors
    }
    this.setState(new_state);
  }

  render() {
    return (
      <div className="App">
        <button onClick={(e)=>{this.chengeDsize(this.state.dsize+1)}}>+</button>
        <button onClick={(e)=>{this.chengeDsize(this.state.dsize-1)}}>-</button>
        <div className="editor">
          <svg
            id="logomark"
            x="0px"
            y="0px"
            width={this.state.wlen * this.state.dsize + "px"}
            height={this.state.hlen * this.state.dsize + "px"}
            viewBox={
              "0 0 " +
              this.state.wlen * this.state.dsize +
              " " +
              this.state.hlen * this.state.dsize
            }
            enable-background={
              "new 0 0 " +
              this.state.wlen * this.state.dsize +
              " " +
              this.state.hlen * this.state.dsize
            }
          >
            {this.state.colors.map(e => {
              return (
                <rect
                  x={this.state.dsize * e.i + "px"}
                  y={this.state.dsize * e.j + "px"}
                  width={this.state.dsize + "px"}
                  height={this.state.dsize + "px"}
                  fill={e.code}
                  stroke="black"
                  stroke-width="1px"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
