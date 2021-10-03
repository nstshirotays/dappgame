import React from 'react';

class Control extends React.Component {

  handleStartClick() {
    this.props.funcStartBtn()
  }

  handleRtbClick() {
    this.props.funcRtbBtn()
  }

  handleMoveClick(direction) {
    this.props.funcMoveBtn(direction)
  }

  handleShotClick() {
    this.props.funcShotBtn()
  }

  render() {

    const isEnabled = this.props.isEnabled;
    const isPlay = this.props.isPlay;
    const piyoBalance = this.props.piyoBalance;

    return (
          <div className="col-sm">
            <h2>Control</h2>
            <br/>            
            <br/>            
            <br/>            
            <br/>            
            <p>
              <button className="btn btn-primary"  disabled={!isEnabled || isPlay || (piyoBalance==0)}  onClick={()=>this.handleStartClick()} >
                出撃する
              </button>
            </p>
            <br/>            
            <br/>            

            <table className="table">
            <tbody>
              <tr>
                <td></td>
                <td>
                  <button className="btn btn-outline-primary"  disabled={!isEnabled || !isPlay}  onClick={()=>this.handleMoveClick(8)} >↑</button>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <button className="btn btn-outline-primary"  disabled={!isEnabled || !isPlay}  onClick={()=>this.handleMoveClick(4)} >
                  ←
                  </button>
                </td>
                <td>
                  <button className="btn btn-outline-danger"  disabled={!isEnabled || !isPlay}  onClick={()=>this.handleShotClick()} >
                  〇
                  </button>
                </td>
                <td>
                  <button className="btn btn-outline-primary"  disabled={!isEnabled || !isPlay}  onClick={()=>this.handleMoveClick(6)} >
                  →
                  </button>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <button className="btn btn-outline-primary"  disabled={!isEnabled || !isPlay}  onClick={()=>this.handleMoveClick(2)} >
                  ↓
                  </button>
                </td>
                <td></td>
              </tr>
            </tbody>
            </table>
            <br/>            
            <br/>            
            
            <p>
              <button className="btn btn-primary"  disabled={!isEnabled || !isPlay}  onClick={()=>this.handleRtbClick()} >
                帰投する
              </button>
            </p>

          </div>
    );
  }   
}

export default Control;