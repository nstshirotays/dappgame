import React from 'react';

class Players extends React.Component {

  render() {
    
    let prows = this.props.players.map((msg,index) =>
      <tr key={index} style={{ backgroundColor : msg.BC ,color : msg.FC}}>
        <td>
          {msg.piyo}
        </td>
        <td  >{msg.address} ({msg.x} ,{msg.y})</td>
      </tr>
    );  
    
    
    return (
      <div className="col-sm">
        <h2>Players</h2>
        <table className="table">
        <thead>
          <tr>
            <th>ぴよぴよ</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {prows}
        </tbody>
        </table>
      </div>

    );
  }   
}

export default Players;