import React from 'react';
import getUserProp from './getUserProp'

class TopBar extends React.Component {

  handleConnectClick() {
    window.ethereum
      .request({ method: 'eth_chainId' })
      .then(result => {
        console.log(result)
        window.location.reload()
      });
  }
  
  handleGetPiyoClick() {
    this.props.btnFunction()
  }
  render() {
    
    const title = this.props.title;
    const isEnabled = this.props.isEnabled;
    const chainId = this.props.chainId;
    const netId = this.props.netId;
    const name = getUserProp(this.props.account).name;
    const fcolor = getUserProp(this.props.account).fcolor;
    const bcolor = getUserProp(this.props.account).bcolor;
    const account = this.props.account;
    const ethBalance = this.props.ethBalance;
    const piyoBalance = this.props.piyoBalance;

    return (
      <div className="Top">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <button className="btn btn-primary"  disabled={isEnabled}  onClick={()=>this.handleConnectClick()}   >
              connect
            </button>
  
            <h2>{title}</h2>
              <button className="btn btn-primary"  disabled={!isEnabled}  onClick={()=>this.handleGetPiyoClick()}    >
              Get! PiyoPiyo
            </button>
          </div>
        </nav>
        <div className="container-fluid">
          <table className="table" style={{ backgroundColor : bcolor ,color : fcolor}}>
            <thead>
              <tr>
                <th scope="col">Network</th>
                <th scope="col">Account</th>
                <th scope="col">ETH</th>
                <th scope="col">ぴよぴよ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{chainId}-{netId}</td>
                <td><strong>{name}</strong>:{account}</td>
                <td>{ethBalance}</td>
                <td>{piyoBalance}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }   
}

export default TopBar;