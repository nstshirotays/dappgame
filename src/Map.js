import React from 'react';
import Sound from 'react-sound';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      sound : Sound.status.STOPPED,
      context : null
    };
  }


  componentDidMount() {
    const canvas = document.getElementById("canvas")
    const canvasContext = canvas.getContext("2d")
    this.setState({context:canvasContext})
    
  }
      
      
      
  onClickSound = ()=> {
    if (this.state.sound === Sound.status.PLAYING ) {
      this.setState({sound : Sound.status.STOPPED})
    } else {
      this.setState({sound : Sound.status.PLAYING})
    }
  }
  
  
  render() {
    const isEnabled = this.props.isEnabled;
    const isPlay = this.props.isPlay;
    const ctx = this.state.context;
    const ships = this.props.ships;
    const missiles = this.props.missiles;
    var R,G,B
    
    if(ctx!==null) {
      
      ctx.clearRect(0,0,600,600)
  
      for( var x=10; x<=590 ; x=x+10) {
        for ( var y =10 ; y<=590; y=y+10) {
          ctx.beginPath () ;
          ctx.rect( x, y, x+10, y+10 )
          ctx.strokeStyle = "lightgray" ;
          ctx.lineWidth = 1 ;
          ctx.stroke() ;
        }
      }        
      ctx.beginPath () ;
      ctx.rect( 10, 10, 590, 590 )
      ctx.strokeStyle = "lightgray" ;
      ctx.lineWidth = 2 ;
      ctx.stroke();
      
      for ( var i=0; i<ships.length;i++) {
        if(ships[i].live) {
          if (ships[i].direction==="8") {
        		ctx.beginPath();
        		ctx.moveTo(ships[i].x*10   +5,ships[i].y*10-20+5); //最初の点の場所
        		ctx.lineTo(ships[i].x*10-20+5,ships[i].y*10+20+5); //2番目の点の場所
        		ctx.lineTo(ships[i].x*10+20+5,ships[i].y*10+20+5); //3番目の点の場所
        		ctx.closePath();	//三角形の最後の線 closeさせる
          }          
          if (ships[i].direction==="6") {
        		ctx.beginPath();
        		ctx.moveTo(ships[i].x*10+20+5,ships[i].y*10   +5); //最初の点の場所
        		ctx.lineTo(ships[i].x*10-20+5,ships[i].y*10-20+5); //2番目の点の場所
        		ctx.lineTo(ships[i].x*10-20+5,ships[i].y*10+20+5); //3番目の点の場所
        		ctx.closePath();	//三角形の最後の線 closeさせる
          }          
          if (ships[i].direction==="2") {
        		ctx.beginPath();
        		ctx.moveTo(ships[i].x*10   +5,ships[i].y*10+20+5); //最初の点の場所
        		ctx.lineTo(ships[i].x*10-20+5,ships[i].y*10-20+5); //2番目の点の場所
        		ctx.lineTo(ships[i].x*10+20+5,ships[i].y*10-20+5); //3番目の点の場所
        		ctx.closePath();	//三角形の最後の線 closeさせる
          }          
          if (ships[i].direction==="4") {
        		ctx.beginPath();
        		ctx.moveTo(ships[i].x*10-20+5,ships[i].y*10   +5); //最初の点の場所
        		ctx.lineTo(ships[i].x*10+20+5,ships[i].y*10-20+5); //2番目の点の場所
        		ctx.lineTo(ships[i].x*10+20+5,ships[i].y*10+20+5); //3番目の点の場所
        		ctx.closePath();	//三角形の最後の線 closeさせる
          }          
      		ctx.strokeStyle = "rgb(0,0,0)"; //枠線の色
      		ctx.stroke();
          R = parseInt(ships[i].owner.substr( 2, 2 ), 16)
          G = parseInt(ships[i].owner.substr( 4, 2 ), 16)
          B = parseInt(ships[i].owner.substr( 6, 2 ), 16)
      		ctx.fillStyle="rgb("+R+","+G+","+B+")";//塗りつぶしの色
      		ctx.fill();
        }
          
      }
  
      for ( var j=0; j<missiles.length;j++) {
        if (missiles[j].live) {
          //console.log("missiles[j].x*10, missiles[j].y*10",missiles[j].x*10, missiles[j].y*10)
          R = parseInt(missiles[j].owner.substr( 2, 2 ), 16)
          G = parseInt(missiles[j].owner.substr( 4, 2 ), 16)
          B = parseInt(missiles[j].owner.substr( 6, 2 ), 16)
      		ctx.beginPath();
          ctx.arc(missiles[j].x*10+5, missiles[j].y*10+5, 5, 0, Math.PI * 2);
      		ctx.fillStyle="rgba("+R+","+G+","+B+",0.5)";//塗りつぶしの色
      		ctx.fill() ;
  
      		ctx.strokeStyle = "black";
      		ctx.lineWidth = 1 ;
          ctx.stroke();
        }
      }
    }


    return (
      <div className="col-sm">
        <h2>The Day of Sagittarius III　
        <Sound url="silver-comet.mp3" playStatus={this.state.sound} />

        <button className="btn btn-primary" disabled={!isEnabled || !isPlay}    onClick={this.onClickSound} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16">
            <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/>
            <path fillRule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/>
            <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/>
          </svg>
        </button>
        </h2>

        <canvas width="600" height="600" id="canvas" />
      </div>


    );
  }   
}

export default Map;