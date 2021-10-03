import React from 'react';

class LogView extends React.Component {

  render() {
    
    let logrows = this.props.logs.map((msg,index) =>
      <tr key={index}>
        <td>
          {msg.BN}
        </td>
        <td  align="Left">{msg.MSG}</td>
      </tr>
    );  
    

    
    return (
      <div className="row">
        <div className="col-sm">
          <table className="table">
             <thead>
                <tr>
                   <th>block</th>
                   <th align="left">events</th>
                </tr>
             </thead>
             <tbody>
               {logrows}
             </tbody> 
          </table>
        </div>
      </div>

    );
  }   
}

export default LogView;