import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Slider from './components/Slider';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wsize: 40,
      hsize: 40,
      dsize: 15,
      wlen: 32,
      hlen: 32,
      mouse: 0,
      currentRGB: [0, 0, 0],
      currentAlpha: 1.0,
      colors: [],
      layers: [],
      max_layer_id: 0,
      current_layer_id: 0,
    };
    this.CRref = React.createRef();
    this.CGref = React.createRef();
    this.CBref = React.createRef();
    this.CAref = React.createRef();
  }
  rgb2hex(rgb) {
    return (
      "#" +
      rgb
        .map(function(value) {
          return ("0" + value.toString(16)).slice(-2);
        })
        .join("")
    );
  }

  hex2rgb(hex) {
    console.log(hex);
    return [0, 1, 2].map(e => {
      return parseInt(hex.substr(e * 2 + 1, 2), 16);
    });
  }

  rgba2hex(rgb, alpha, base_hex) {
    console.log(base_hex);
    const base_int = this.hex2rgb(base_hex);
    console.log(base_int);
    return (
      "#" +
      rgb
        .map((e, i) => {
          return Math.floor(base_int[i] * (1 - alpha) + e * alpha);
        })
        .map(e => {
          return ("0" + e.toString(16)).slice(-2);
        })
        .join("")
    );
  }

  componentDidMount() {
    let new_state = this.state;
    let i, j;
    for (i = 0; i < this.state.wlen; i++) {
      for (j = 0; j < this.state.hlen; j++) {
        new_state.colors.push({
          i: i,
          j: j,
          //code: this.rgb2hex([0,0,0].map((e)=>{return Math.random()* Math.floor(256)}))
          code: "#ffffff"
        });
      }
    }
    this.setState(new_state);
  }

  resetColor() {
    let new_state = this.state;
    new_state.colors = [];
    let layer = {
      id: new_state.max_layer_id,
      colors: [],
    };
    let i, j;
    for (i = 0; i < this.state.wlen; i++) {
      for (j = 0; j < this.state.hlen; j++) {
        new_state.colors.push({
          i: i,
          j: j,
          code: "#ffffff"
        });
        layer.colors.push({
          i: i,
          j: j,
          code: "#ffffff",
          alpha: 0,
        });
      }
    }
    new_state.layers.push(layer);
    this.setState(new_state);
  }

  addLayer(){
    let new_state=this.state;
    new_state.max_layer_id=new_state.max_layer_id + 1;
    let new_layer={
      id: new_state.max_layer_id,
      colors: [],
    };
    let i, j;
    for (i = 0; i < this.state.wlen; i++) {
      for (j = 0; j < this.state.hlen; j++) {
        new_layer.colors.push({
          i: i,
          j: j,
          code: "#ffffff",
          alpha: 0
        });
      }
    }
    new_state.layers.push(new_layer);
    this.setState(new_state);
  }

  chengeDsize(_dsize) {
    let new_state = this.state;
    new_state.dsize = _dsize;
    this.setState(new_state);
  }

  mouse(m) {
    let new_state = this.state;
    new_state.mouse = m;
    this.setState(new_state);
  }

  chColorClick(i, j, width) {
    return t => {
      //if(t.state.mouse===1){
      console.log(i, j, width);
      console.log(t.state);
      let new_state = t.state;
      let new_code = this.rgba2hex(
        new_state.currentRGB,
        new_state.currentAlpha,
        new_state.colors[i * width + j].code
      );
      new_state.colors[i * width + j] = { i: i, j: j, code: new_code };
      t.setState(new_state);
      //}
    };
  }

  changeR(e) {
    let new_state = this.state;
    new_state.currentRGB[0] = parseInt(this.CRref.current.value);
    this.setState(new_state);
  }

  changeG(e) {
    let new_state = this.state;
    new_state.currentRGB[1] = parseInt(this.CGref.current.value);
    this.setState(new_state);
  }

  changeB(e) {
    let new_state = this.state;
    new_state.currentRGB[2] = parseInt(this.CBref.current.value);
    this.setState(new_state);
  }

  changeA(e) {
    let new_state = this.state;
    new_state.currentAlpha = parseFloat(this.CAref.current.value);
    this.setState(new_state);
  }

  chColorOver(i, j, width) {
    return (t, code = "#000") => {
      if (t.state.mouse === 1) {
        console.log(i, j, width);
        console.log(t.state);
        let new_state = t.state;
        let new_code = this.rgba2hex(
          new_state.currentRGB,
          new_state.currentAlpha,
          new_state.colors[i * width + j].code
        );
        new_state.colors[i * width + j] = { i: i, j: j, code: new_code };
        t.setState(new_state);
      }
    };
  }

  applyR(val) {
    let new_state = this.state;
    let col = Math.floor(val * 255);
    new_state.currentRGB[0] = col;
    this.setState(new_state);
  }
  applyG(val) {
    let new_state = this.state;
    let col = Math.floor(val * 255);
    new_state.currentRGB[1] = col;
    this.setState(new_state);
  }
  applyB(val) {
    let new_state = this.state;
    let col = Math.floor(val * 255);
    new_state.currentRGB[2] = col;
    this.setState(new_state);
  }
  applyAlpha(val) {
    let new_state = this.state;
    new_state.currentAlpha = val;
    this.setState(new_state);
  }

  render() {
    return (
      <div className="App">
        <div className="Sliders">
          <div>
            <svg id="current-color" width="100px" height="100px">
              <rect
                x="0px"
                y="0px"
                width="100px"
                height="100px"
                fill={this.rgb2hex(this.state.currentRGB)}
              />
            </svg>
          </div>
          R:{this.state.currentRGB[0]}
          <div>
            <Slider
              x={0}
              zx={50}
              width={100}
              pinColor="#f55"
              handler={this.applyR.bind(this)}
            />
          </div>
          G:{this.state.currentRGB[1]}
          <div>
            <Slider
              x={0}
              zx={50}
              width={100}
              pinColor="#5f5"
              handler={this.applyG.bind(this)}
            />
          </div>
          B:{this.state.currentRGB[2]}
          <div>
            <Slider
              x={0}
              zx={50}
              width={100}
              pinColor="#55f"
              handler={this.applyB.bind(this)}
            />
          </div>
          A:{this.state.currentAlpha.toFixed(2)}
          <div>
            <Slider
              x={100}
              zx={50}
              width={100}
              pinColor="#ccc"
              handler={this.applyAlpha.bind(this)}
            />
          </div>
        </div>
        <div className="MainPanel">
          <button
            onClick={e => {
              this.chengeDsize(this.state.dsize + 1);
            }}
          >
            +
          </button>
          <button
            onClick={e => {
              this.chengeDsize(this.state.dsize - 1);
            }}
          >
            -
          </button>
          <button
            onClick={e => {
              this.resetColor();
            }}
          >
            ***
          </button>
          
          <div
            className="editor"
            onMouseDown={e => {
              this.mouse(1);
            }}
            onMouseUp={e => {
              this.mouse(0);
            }}
          >
            <svg
              id="editor-canvas"
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
                    onClick={() => {
                      this.chColorClick(e.i, e.j, this.state.wlen)(this);
                    }}
                    onMouseMove={() => {
                      this.chColorOver(e.i, e.j, this.state.wlen)(this);
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
