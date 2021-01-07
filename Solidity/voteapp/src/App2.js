import React, {Component} from 'react';
import './App.css';
import Web3 from "web3";
import WalletLink from "walletlink";
import WalletConnectProvider from '@walletconnect/web3-provider';
import * as lib from './smart_contract_controller.js';
import WalletConnect from '@walletconnect/client';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import Web3Modal from "web3modal";

var connectCounter = 0;
var web3;
var ethereum;
var owner_wallet = "0x0979d9f8f0330518a6de7769a44baa666f37f0c2";// "0xdfcddd7476cef8073f0809eef864d5ce1709eebf";

async function startApp(){
  console.log("METHOD: startApp()");
  const JSONRPC_URL = "https://kovan.infura.io/v3/b78a27720f0d486da26c0d3c95158aef";
  const CHAIN_ID = 42;
  const walletLink = new WalletLink({
    appName: "ArtinVoteApp",
    darkMode: true
  });
  const walletConnectProvider = new WalletConnectProvider({
    infuraId: "b78a27720f0d486da26c0d3c95158aef",
    chainId: CHAIN_ID,
    dappName: "ArtinVoteApp",
    rpcUrl: JSONRPC_URL,
    bridgeUrl: "https://bridge.walletconnect.org",
    rpc: { 42: JSONRPC_URL }
  });
  //const walletConnect = new WalletConnect({ session: { chainId: CHAIN_ID } });
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: { 
        infuraId: "b78a27720f0d486da26c0d3c95158aef",
        chainId: CHAIN_ID
      }
    }
  };
  const web3Modal = new Web3Modal({
    network: "kovan",
    providerOptions
  });
  const walletConnect = new WalletConnectConnector({
    rpc: { 42: JSONRPC_URL },
    rpcUrl: JSONRPC_URL,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 15000
  });
  if (typeof window.ethereum !== 'undefined'){
    ethereum = window.ethereum;
  } else {
    ethereum = walletLink.makeWeb3Provider(JSONRPC_URL, CHAIN_ID);
    //ethereum = walletConnectProvider;
    //ethereum = await web3Modal.connectTo("walletconnect");
  }
  
  console.log("ethereum: ", ethereum);

  //  Create Web3
  //web3 = new Web3(ethereum);
  web3 = new Web3(JSONRPC_URL);
  lib.startToken(web3);
  console.log("startApp() finished");
  ++connectCounter;
}

const options = [];
const newOptions = [];
var nextId = 0;

export default class App2 extends Component{
  constructor(){
      super();
      this.state = {
          description: null,
          options: options,
          error: null,
          isAdmin: false,
          query: "",
          wallet: null,
          notes: null,
          balance: 0,
          tx: null,
          newOptions: newOptions, // New options (of new poll)
          newDescription: '', // New description (of new poll)
          count: 0, // Number of polls in contract
          minIndex: 1,
          index: 0, // Index of poll
          canGoBack: false,
          canGoNext: false,
          isTransactionMsg: false,
          myVoteIndex: 0,
          reward: 10,
          winningIndex: -1,
      };
      this.state.index = this.parseUrl();
  }
  async componentDidMount(){
    await startApp();
    ++connectCounter;
    this.connect(this.state.index);
  }
  disconnect(){
    console.log(ethereum);
    try {
      ethereum.disconnect();
    } catch (err) {
      if (ethereum.close){
        ethereum.close();
      }
    }
  }
  connect(index1 = 0){
    if (connectCounter < 2) return;

    console.log("METHOD: connect()");
    lib.setIndex(index1);
      ethereum.enable().then((accounts) => {
        console.log("User's address is: ", accounts[0]);
        web3.eth.defaultAccount = accounts[0];
        this.setState({ 
          wallet: accounts[0],
          isAdmin: accounts[0] === owner_wallet.toLowerCase()
        });
        
        lib.getBalanceOf(web3.eth.defaultAccount, (err, res) => {
          console.log("Balance is: ", res);
          if (!err){
            this.setState({ balance: web3.utils.fromWei("" + res, 'ether') });
          } else { console.log("Balance error: ", err); }
        });
        
    this.loadWinning();
    this.loadPoll();
    this.loadMyVote();
    lib.getVoteCount((err, res) => { // Set number of polls
      this.setState({ 
        count: res-1, 
        canGoNext: this.state.index < res - 1,
        canGoBack: this.state.minIndex < this.state.index
      });
    });

    }).catch(res => console.log("Error enable(): ", res));
  }
  loadMyVote(){
    lib.voteOfAsync(web3.eth.defaultAccount).then((val) => {
        this.state.myVoteIndex = val - 1;
        console.log("My vote is: ", this.state.myVoteIndex);
        
        this.updateMyVote(val);
    });
  }
  loadWinning(){
    lib.winningIndexOfAsync().then((val) => {
        this.state.winningIndex = val - 1;
        console.log("Winning: ", val);
    });
  }
  loadPoll(){
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    lib.prepeareOptionsAsync().then(async (val) => {
      for (var i = 0; i < val; ++i){
        lib.scoped(i, i1 => {
          lib.choiceOfAsync(i1).then(val1 => {
            console.log("Options: ", val1);
            this.onAddOption(i1, val1);

            lib.weightOfAsync(i1).then(val2 => {
              console.log("weight: ", val2);
              this.onUpdateOption(i1, val2);
            });
          });
        });
        await sleep(200);
      }
    });
    lib.descriptionOfAsync().then((val) => {
      this.setState({ description: val });
    });
  }
  onUpdateOption = (i, val) => {
    var wasDone = false;
    this.setState(state => {
      const options = state.options.map((item) => {
        if (i === item.id && !wasDone){
          item.votes = item.votes + parseFloat(val);
          wasDone = true;
        }
        return item;
      });
      return {
        options,
      };
    });
    
    this.pollLength();
  };
  onAddOption = (id, opText) => {
    let op = { id: id, text: opText, votes: 0, isMy: id == this.state.myVoteIndex, isWin: id == this.state.winningIndex };
    this.setState({ options: [...this.state.options, op] });
  };

  async voteForThis(index){
    console.log("Vote for index: ", index);
    lib.voteForTemp(ethereum, index, (res) => {
      if (res){
        console.log(res);
        this.setState({ notes: "TxId: " + res, tx: "https://kovan.etherscan.io/tx/" + res });

        /*lib.weightOfAsync(index).then(val2 => {
          console.log("weight: ", val2);
          this.onUpdateOption(index, val2);
        }).catch(res => {
          console.log("error setting weight: ", res);
        });*/
      }
    });
  }
  
  openIndex(index){
    this.setState({ index:index });
  }
  addOption = () => {
    let op = { id: nextId, text: '', isMy: false, isWin: false };
    this.setState({ newOptions: [...this.state.newOptions, op] });
    ++nextId;
  }
  updateOption = (id, text) => {
    var wasDone = false;
    this.setState(state => {
        const newOptions = state.newOptions.map((item) => {
            if (id == item.id && !wasDone){
                item.text = text;
                wasDone = true;
            }
            return item;
        });
        return newOptions;
    });
  }
  updateMyVote = (id) => {
    var wasDone = false;
    this.setState(state => {
      const newOptions = state.newOptions.map((item) => {
        if (id == item.id && !wasDone){
          item.isMy = true;
          wasDone = true;
        }
        return item;
      })
      return newOptions;
    });
  }
  finishPoll = () => {
    console.log("poll description: ", this.state.newDescription);
    console.log("poll options: ", this.state.newOptions);
    var ops = [];
    for (var i = 0; i < this.state.newOptions.length; ++i){
      ops[i] = this.state.newOptions[i].text;
      console.log("Op: ", this.state.newOptions[i].text);
    }
    console.log("Options: ", ops);
    lib.createVote(ethereum, this.state.newDescription, ops);
  }
  handleChange = (event) => {
    this.setState({ newDescription: event.target.value });
  }
  handleItemChange = (event) => {
      this.updateOption(event.target.name, event.target.value);
  }
  handleRewardChange = (event) => {
    this.setState({ reward: event.target.value });
  }
  parseUrl = () => {
    var params = new URLSearchParams(window.location.search);
    var parseIndex = params.get('q');
    if (parseIndex < this.state.minIndex){ parseIndex = this.state.minIndex; }
    return parseIndex;
  }
  concat = (str1, str2) => { return str1 + str2; }
  reload = () => {
    window.location.reload();
  }
  myClass = (isMy) => { 
    return isMy ? "is-my" : "not-my";
  }
  winClass = (isWin) => {
    return isWin ? "is-win" : "not-win";
  }
  reward = (id, value) => { 
    var rew = document.getElementById("rewardId").value;
    lib.rewardCorrectAndCloseAsync(ethereum, id + 2, value - rew, (res) => {
      if (!res){
        console.log("result of rewardCorrectAndClose: ", res);
      }
    });
  }
  rewardAndPunish = (id, value) => {
    var rew = document.getElementById("rewardId").value;
    lib.rewardAndCloseAsync(ethereum, id + 2, value - rew, (res) => {
      if (!res){
        console.log("result of rewardAndClose: ", res);
      }
    });
  }
  pollLength = () => {
    var ops = this.state.options;
    var max = 0;
    var i = 0;
    for (i = 0; i < ops.length; ++i){
      if (ops[i].votes > max){
        max = ops[i].votes;
      }
    }
    let pollBars = document.querySelectorAll('.poll-bar');
    for (i = 0; i < ops.length; ++i){
      pollBars[i].style.width = (2 + 98 * ops[i].votes / max) + "%";
    }
  }

  render(){
    return (
        <div>
          <div class="head">
          {
            this.state.wallet &&
              <div>account: {this.state.wallet}
                <div></div>
              </div>
          }
          {
            !this.state.wallet &&
              <div><a href="#" onClick={() => this.connect(this.state.index)}>connect</a></div>
          }
          { 
            <div>balance: {this.state.balance} ARTv1</div>
          }
          {
            this.state.isAdmin &&
            <div>is admin</div>
          }
          </div>

          <div class="main">
            <h1>ARTIN vote token</h1>
            {
              <div class="count">Count: {this.state.count}</div>
            }
            <div class="poll">
            { this.state.options.length > 0 &&
              <div class="poll-title">{this.state.description}</div>
            }
            <ul>
            {
                this.state.options.length === 0 &&
                <li><b>Connect your wallet first</b></li>
            }
            { this.state.options.length > 0 &&
                this.state.options.map( (item) => (
                    <li key={item.id} id={item.id} class={this.winClass(item.isWin)}>
                      <div class={this.myClass(item.isMy)}><a href="#" onClick={() => this.voteForThis(item.id)}>{item.text}</a></div>
                      <div>{item.votes}</div>
                      <div class="poll-bar"></div>
                      { this.state.isAdmin &&
                        <div>
                          <a href="#" onClick={() => this.reward(item.id, item.votes)}>reward good</a> |&nbsp;
                          <a href="#" onClick={() => this.rewardAndPunish(item.id, item.votes)}>reward and punish</a>
                        </div>
                      }
                    </li>
                ))
            }
            </ul>
            <div class="poll-nav"> 
              <hr />
              {this.state.canGoBack &&
                <span><a href={this.concat("?q=", Number(this.parseUrl())-1)}>back</a></span>
              }
              &nbsp;|&nbsp;
              {this.state.canGoNext &&
                <span><a href={this.concat("?q=", 1+Number(this.parseUrl()))}>next</a></span>
              }
            </div>
            { this.state.isAdmin && this.state.options.length > 0 &&
              <div>
                reward: <input id="rewardId" name="reward" value={this.state.reward} onChange={this.handleRewardChange} />
              </div>
            }
            </div>

            {this.state.isAdmin &&
              <div>
                <hr />
                <form onSubmit={this.submitPoll}>
                new description: <input id="newDesc" value={this.state.newDescription} onChange={this.handleChange} />
                <ul>
                {this.state.newOptions.map((item) => (
                  <li key={item.id} id={item.id}>
                    <input type="text" name={item.id} value={item.text} onChange={this.handleItemChange} />
                  </li>
                ))}
                <div><a href="#" onClick={this.addOption}>add option</a></div>
                <div><a href="#" onClick={this.finishPoll}>finish</a></div>
                </ul>
                </form>
              </div>
            }
            {this.state.error &&
                <div>{this.state.error}</div>
            }
            {this.state.notes &&
              <div>
                <hr />
                <a href={this.state.tx}>{this.state.notes}</a>
                <div>Transaction is being processed, <a href="#" onClick={this.reload}>reload</a> page to update the poll.</div>
              </div>
            }
            </div>
        </div>
    )
  }
}