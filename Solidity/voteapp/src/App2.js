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
    //ethereum = walletLink.makeWeb3Provider(JSONRPC_URL, CHAIN_ID);
    ethereum = walletConnectProvider;
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
          wallet: null,
          notes: null,
          balance: 0,
          tx: null,
          newOptions: newOptions, // New options (of new poll)
          newDescription: '', // New description (of new poll)
          count: 0, // Number of polls in contract
          index: 1, // Index of poll
          minIndex: 1,
          canGoBack: false,
          canGoNext: false,
      }
  }
  async componentDidMount(){
    await startApp();
    ++connectCounter;
    this.connect();
  }
  disconnect(){
    try {
      ethereum.disconnect();
    } catch {
      ethereum.close();
    }
  }
  connect(){
    if (connectCounter < 2) return;

    console.log("METHOD: connect()");
    lib.setIndex(this.state.index);
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

        
    this.loadPoll();
    lib.getVoteCount((err, res) => { // Set number of polls
      this.setState({ 
        count: res-1, 
        canGoNext: this.state.index < res - 1,
        canGoBack: this.state.minIndex < this.state.index
      });
    })

    }).catch(res => console.log("Error enable(): ", res));
  }
  loadPoll(){
    lib.prepeareOptionsAsync().then((val) => {
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
  };
  onAddOption = (id, opText) => {
    let op = { id: id, text: opText, votes: 0 };
    this.setState({ options: [...this.state.options, op] });
  };

  async voteForThis(index){
    console.log("Vote for index: ", index);
    lib.voteForTemp(ethereum, index, (err, res) => {
      if (res){
        console.log(res);
        this.setState({ notes: "TxId: " + res.result, tx: res.result });

        lib.weightOfAsync(index).then(val2 => {
          console.log("weight: ", val2);
          this.onUpdateOption(index, val2);
        });
      }
    });

    return;
    lib.voteFor(ethereum, index, (err, res) => {
      if (res){
        console.log(res);
        this.setState({ notes: "TxId: " + res.result, tx: res.result });

        lib.weightOfAsync(index).then(val2 => {
          console.log("weight: ", val2);
          this.onUpdateOption(index, val2);
        });
      }
    });
  }
  
  openIndex(index){
    this.setState({ index:index });
  }
  addOption = () => {
    let op = { id: nextId, text: '' };
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

  render(){
    return (
        <div>
          {
            this.state.wallet &&
              <div>account: {this.state.wallet}<div>
                <a href="#" onClick={this.disconnect}>disconnect</a></div></div>
          }
          {
            !this.state.wallet &&
              <div><a href="#" onClick={this.connect}>connect</a></div>
          }
          { 
            <div>balance: {this.state.balance} ARTv1</div>
          }
          {
            this.state.isAdmin &&
            <div>is admin</div>
          }
            <h1>App v.1.0</h1>
            {
              <div>Count: {this.state.count}</div>
            }
            <ul>
            {
                this.state.options.length === 0 &&
                <li>Connect your wallet first</li>
            }
            { this.state.options.length > 0 &&
              <div>{this.state.description}</div>
            }
            { this.state.options.length > 0 &&
                this.state.options.map( (item) => (
                    <li key={item.id} id={item.id}>
                      <div><a href="#" onClick={() => this.voteForThis(item.id)}>{item.text}</a></div>
                      <div>{item.votes}</div>
                    </li>
                ))
            }
            </ul>
            <div>
              {this.state.canGoBack &&
                <div><a href="#">back</a></div>
              }
              {this.state.canGoNext &&
                <div><a href="#">next</a></div>
              }
            </div>
            {this.state.isAdmin &&
              <div>
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
              <div><a href={this.state.tx}>{this.state.notes}</a></div>
            }
        </div>
    )
  }
}