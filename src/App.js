import React from 'react';
import './App.css';
import OnBoard from './OnBoard';
import TopBar from './TopBar'
import Control from './Control'
import LogView from './LogView'
import Players from './Players'
import Map from './Map'
import Web3 from 'web3';
import PiyoCoin from './abis/PiyoCoin.json'
import GameCenter from './abis/GameCenter.json'
import Name from './name.json'
import getUserProp from './getUserProp'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.getPiyoPiyo = this.getPiyoPiyo.bind(this);
    this.startBtn = this.startBtn.bind(this);
    this.rtbBtn = this.rtbBtn.bind(this);
    this.moveBtn = this.moveBtn.bind(this);
    this.shotBtn = this.shotBtn.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
    
    this.state = {
      web3: 'undefined',
      account: '',
      isEnabled:false,
      isPlay:true,
      piyoCoin: null,
      gameCenter: null,
      gameCenterAddress:'',
      netId:'',
      ethBalance: 0,
      piyoBalance: 0,
      warrning:'',
      logs:[],
      players:[],
      ships:[],
      missiles:[],
    }
  }

  async componentDidMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }


  async loadBlockchainData(dispatch) {
    function reloadWindow() {
      window.location.reload()
    }
    
    if(typeof window.ethereum!=='undefined'){
      const web3 = new Web3(window.ethereum)
      const cId = await window.ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(cId, 16)
      const netId = await web3.eth.net.getId()
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      this.setState({chainId:chainId,netId: netId,account: accounts[0]})

      window.ethereum.on('accountsChanged', reloadWindow);
      window.ethereum.on('chainChanged', reloadWindow);
      window.ethereum.on('disconnect', reloadWindow);
 
      //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        const ethBalance = web3.utils.fromWei(balance)
        this.setState({ethBalance: ethBalance, web3: web3})
      } else {
        this.setState({warrning:'Please login with MetaMask'})
      }

      //load contracts
      try {
        const token = new web3.eth.Contract(PiyoCoin.abi, "0xd3DBe453aCc5A66DD5Dd25B21D2440073810123E")
        const center = new web3.eth.Contract(GameCenter.abi, "0x4d0Ad0F48bb5CF6C2A24d3DC9D33642c4fBC10dB")
        const gAddress = "0x4d0Ad0F48bb5CF6C2A24d3DC9D33642c4fBC10dB"
//        const token = new web3.eth.Contract(PiyoCoin.abi, PiyoCoin.networks[netId].address)
//        const center = new web3.eth.Contract(GameCenter.abi, GameCenter.networks[netId].address)
//        const gAddress = GameCenter.networks[netId].address
        const pcoin = await token.methods.balanceOf(this.state.account).call()
        const piyoBalance = web3.utils.fromWei(pcoin)

        this.setState({piyoBalance:piyoBalance,isEnabled:true,piyoCoin: token, gameCenter: center, gameCenterAddress: gAddress})
        
        
        // イベント登録
        // Change2coin
        center.events.Change2coin({}, (err, event) => {
          web3.eth.getBalance(accounts[0])
          .then(result => {this.setState({ethBalance:web3.utils.fromWei(result)})})
          
          token.methods.balanceOf(accounts[0]).call()
          .then(result => {this.setState({piyoBalance:web3.utils.fromWei(result)})})
          
          var msg = Name.name[parseInt(event.returnValues.user.substr( 2, 2 ), 16)]+"さんがピヨピヨコインを取得しました"
          var ev = this.state.logs
          ev.unshift( {BN:event.blockNumber,MSG: msg }) // 配列の先頭に追加
          this.setState({logs:ev})
          this.checkStatus(center)
        });
        
        // Sagitarius_start
        center.events.Sagitarius_start({}, (err, event) => {
          token.methods.balanceOf(accounts[0]).call()
          .then(result => {this.setState({piyoBalance:web3.utils.fromWei(result)})})
    
          var msg = Name.name[parseInt(event.returnValues.user.substr( 2, 2 ), 16)]+"さんが出撃しました（"+ event.returnValues.x + "," + event.returnValues.y +")"
          var ev = this.state.logs
          ev.unshift( {BN:event.blockNumber,MSG: msg }) // 配列の先頭に追加
          this.setState({logs:ev})
          this.checkStatus(center)
        });
        
        // Sagitarius_rtb
        center.events.Sagitarius_rtb({}, (err, event) => {
          token.methods.balanceOf(accounts[0]).call()
          .then(result => {this.setState({piyoBalance:web3.utils.fromWei(result)})})
    
          var msg = Name.name[parseInt(event.returnValues.user.substr( 2, 2 ), 16)]+"さんが帰投しました ("+ event.returnValues.balance+"ピヨピヨ)"
          var ev = this.state.logs
          ev.unshift( {BN:event.blockNumber,MSG: msg }) // 配列の先頭に追加
          this.setState({logs:ev})
          this.checkStatus(center)
        });
        
        // Sagitarius_move
        center.events.Sagitarius_move({}, (err, event) => {
          var direct = ["","","下","","左","","右","","上",]
          var msg = Name.name[parseInt(event.returnValues.user.substr( 2, 2 ), 16)]+"さんが"+direct[event.returnValues.direc]+"へ移動しました"
          var ev = this.state.logs
          ev.unshift( {BN:event.blockNumber,MSG: msg }) // 配列の先頭に追加
          this.setState({logs:ev})
          this.checkStatus(center)
        });

        // Sagitarius_shot
        center.events.Sagitarius_shot({}, (err, event) => {
          var msg = Name.name[parseInt(event.returnValues.user.substr( 2, 2 ), 16)]+"さんがミサイルを発射しました"
          var ev = this.state.logs
          ev.unshift( {BN:event.blockNumber,MSG: msg }) // 配列の先頭に追加
          this.setState({logs:ev})
          this.checkStatus(center)
        });

        // Sagitarius_hit
        center.events.Sagitarius_hit({}, (err, event) => {
    
          var msg = Name.name[parseInt(event.returnValues.from.substr( 2, 2 ), 16)]+"さんが"+ Name.name[parseInt(event.returnValues.to.substr( 2, 2 ), 16)]+ "さんを攻撃しました"
          var ev = this.state.logs
          ev.unshift( {BN:event.blockNumber,MSG: msg }) // 配列の先頭に追加
          this.setState({logs:ev})
          this.checkStatus(center)
        });

    
        // Sagitarius_end
        center.events.Sagitarius_end({}, (err, event) => {
    
          var msg = Name.name[parseInt(event.returnValues.user.substr( 2, 2 ), 16)]+"さんは壊滅しました (Game Over)"
          var ev = this.state.logs
          ev.unshift( {BN:event.blockNumber,MSG: msg }) // 配列の先頭に追加
          this.setState({logs:ev})
          this.checkStatus(center)
        });
        
        //　現在状態を取得
        this.checkStatus(center)
        
        
      } catch (e) {
        console.log('Error', e)
        this.setState({warrning:'Contracts not deployed to the current network'})
      }

    } else {
      this.setState({warrning:'Please install MetaMask'})
    }
  }  
  

  async checkStatus(gCenter){
    
    var _ships=[]
    var _players=[]
    
    var sl = await gCenter.methods.getShipLength().call()

    this.setState({isPlay:false})

    for (var i = 0 ; i< sl ; i++) {
      var _ship = await gCenter.methods.ships(i).call()
      _ships.push(_ship)
      if ( _ship.live ) {
        var piyo = await gCenter.methods.piyo_balance(_ship.owner).call()

        const sname = getUserProp(_ship.owner).name
        const fcolor = getUserProp(_ship.owner).fcolor;
        const bcolor = getUserProp(_ship.owner).bcolor;
        
        _players.push({piyo:piyo,address:sname,x:_ship.x,y:_ship.y,BC:bcolor,FC:fcolor})      

        if (_ship.owner.toLowerCase() === this.state.account.toLowerCase()){
          this.setState({isPlay:true})
        }

      }
    }

    this.setState({players:_players})
    this.setState({ships:_ships})


    var _missiles=[]

    var ml = await gCenter.methods.getMissleLenght().call()

    for (var j = 0 ; j< ml ; j++) {
      var _missile = await gCenter.methods.missiles(j).call()
      _missiles.push(_missile)
    }

    this.setState({missiles:_missiles})
  }  


  getPiyoPiyo(){
    console.log("push getPiyoPiyo")
    this.state.gameCenter.methods.change2coin().send({value: "100000000000000000", from: this.state.account})
    .then(receipt =>{
      this.state.piyoCoin.methods.balanceOf(this.state.account).call()
      .then(result => {
        const piyoBalance = this.state.web3.utils.fromWei(result)
        this.setState({piyoBalance:piyoBalance})
      })
      //console.log("receipt is ",receipt) 
    })

  }
  
  startBtn(){
    console.log("push startBtn!")
    this.state.piyoCoin.methods.approve(this.state.gameCenterAddress,"10000000000000000000").send({from: this.state.account})
    .then(receipt =>{
      this.state.gameCenter.methods.sagitarius_start().send({from: this.state.account})
      .then(receipt =>{
        //console.log("receipt is ",receipt) 
        this.state.piyoCoin.methods.balanceOf(this.state.account).call()
        .then(result => {
          const piyoBalance = this.state.web3.utils.fromWei(result)
          this.setState({piyoBalance:piyoBalance})
        })
      })
      //console.log("receipt is ",receipt) 
    })
  }
  
  rtbBtn(){
    console.log("push rtbBtn!")
    this.state.gameCenter.methods.sagitarius_rtb().send({from: this.state.account})
    .then(receipt =>{
      //console.log("receipt is ",receipt) 
      this.state.piyoCoin.methods.balanceOf(this.state.account).call()
      .then(result => {
        const piyoBalance = this.state.web3.utils.fromWei(result)
        this.setState({piyoBalance:piyoBalance})
      })
    })
  }
  
  moveBtn(direction){
    console.log("push moveBtn!",direction)
    this.state.gameCenter.methods.sagitarius_move(direction).send({from: this.state.account})
    .then(receipt =>{
      //console.log("receipt is ",receipt) 
    })

  }
  
  shotBtn(){
    console.log("push shotBtn!")
    this.state.gameCenter.methods.sagitarius_shot().send({from: this.state.account})
    .then(receipt =>{
      //console.log("receipt is ",receipt) 
    })
  }
 
  render() {
    let Messages = null;
    Messages = ( ()=> <h3 style={{color:'red'}}>{this.state.warrning}</h3> )

    return (
      <div className="App">
        <Messages />
        {(window.ethereum ? '' : <OnBoard />)}
        <div className="container-fluid">
          <TopBar 
            title   = "Game Center Piyo Piyo"
            chainId =  {this.state.chainId} 
            netId   = {this.state.netId}
            isEnabled ={this.state.isEnabled}
            ethBalance ={this.state.ethBalance}
            piyoBalance = {this.state.piyoBalance}
            btnFunction = {this.getPiyoPiyo}
            account = {this.state.account}
          />
          <div className="row">
          
            <Players
              players = {this.state.players}
            />
  
            <Map 
              isEnabled ={this.state.isEnabled}
              isPlay ={this.state.isPlay}
              ships = {this.state.ships}
              missiles = {this.state.missiles}
            />
  
            <Control 
              isEnabled ={this.state.isEnabled}
              isPlay ={this.state.isPlay}
              piyoBalance = {this.state.piyoBalance}
              funcStartBtn = {this.startBtn} 
              funcRtbBtn = {this.rtbBtn}
              funcMoveBtn = {this.moveBtn}
              funcShotBtn = {this.shotBtn}
            />
  
          </div>
          <LogView
            logs = {this.state.logs}
          />
        </div>
      </div>
    )
  }
}

export default App;
