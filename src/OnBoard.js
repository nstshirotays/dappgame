import React from 'react';
import OnboardingButton from "./onBoardMetamask.js"

class Onboard extends React.Component {

 
  render() {

    return (
      <div className="App">
            <div className="App-header">
        <p>メタマスクがインストールされていません</p>
        <p><OnboardingButton /></p>
      </div>
      </div>
    );
  }   
}

export default Onboard;