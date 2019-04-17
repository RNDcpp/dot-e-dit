import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      wsize: 40,
      hsize: 40,
      dsize:  15,
      wlen: 32,
      hlen: 32,
      mouse: 0,
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
            //code: this.rgb2hex([0,0,0].map((e)=>{return Math.random()* Math.floor(256)}))
            code: "#fff"
          }
        );
      }
    }
    this.setState(new_state);
  }

  resetColor(){
    let new_state=this.state;
    new_state.colors=[]
    let i,j;
    for(i=0;i<this.state.wlen;i++){
      for(j=0;j<this.state.hlen;j++){
        new_state.colors.push(
          { 
            i: i,
            j: j,
            code: "#fff"
          }
        );
      }
    }
    this.setState(new_state);
  }

  chengeDsize(_dsize){
    let new_state=this.state;
    new_state.dsize=_dsize;
    this.setState(new_state);
  }

  mouse(m){
    let new_state=this.state;
    new_state.mouse=m;
    this.setState(new_state);
  }

  chColorClick(i,j,width){
    return (t,code="#000")=>{
      //if(t.state.mouse==1){
        console.log(i,j,width);
        console.log(t.state);
        let new_state=t.state;
        new_state.colors[i*width+j]={i:i,j:j,code:code};
        t.setState(new_state);
      //}
    }
  }
  chColorOver(i,j,width){
    return (t,code="#000")=>{
      if(t.state.mouse==1){
        console.log(i,j,width);
        console.log(t.state);
        let new_state=t.state;
        new_state.colors[i*width+j]={i:i,j:j,code:code};
        t.setState(new_state);
      }
    }
  }
  render() {
    return (
      <div className="App">
        <button onClick={(e)=>{this.chengeDsize(this.state.dsize+1)}}>+</button>
        <button onClick={(e)=>{this.chengeDsize(this.state.dsize-1)}}>-</button>
        <button onClick={(e)=>{this.resetColor()}}>***</button>
        <div className="editor" 
        onMouseDown={(e)=>{this.mouse(1)}}
        onMouseUp ={(e)=>{this.mouse(0)}}
        >
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
            enableBackground={
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
                  strokeWidth="1px"
                  onClick={()=>{this.chColorClick(e.i,e.j,this.state.wlen)(this)}}
                  onMouseMove={()=>{this.chColorOver(e.i,e.j,this.state.wlen)(this)}}
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
