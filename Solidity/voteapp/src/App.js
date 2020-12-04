import React from 'react';
import './App.css';
import Web3 from "web3";
import WalletLink from "walletlink"
import * as lib from './smart_contract_controller.js';

var web3;
var ethereum;
var owner_wallet = "0x0979d9f8f0330518a6de7769a44baa666f37f0c2";// "0xdfcddd7476cef8073f0809eef864d5ce1709eebf";
async function startApp(){
  const walletLink = new WalletLink({
    appName: "ArtinVoteApp",
    darkMode: true
  });
  const JSONRPC_URL = "https://kovan.infura.io/v3/b78a27720f0d486da26c0d3c95158aef";
  const CHAIN_ID = 42;
  if (typeof window.ethereum !== 'undefined'){
    ethereum = window.ethereum;
  } else {
    ethereum = walletLink.makeWeb3Provider(JSONRPC_URL, CHAIN_ID);
  }

  //  Create Web3
  web3 = new Web3(ethereum);
}

function App() {
  function submitVote(){
    var q = document.getElementById("question").value;
    var a1 = document.getElementById("an1").value;
    var a2 = document.getElementById("an2").value;
    var a3 = document.getElementById("an3").value;
    var a4 = document.getElementById("an4").value;
    var a5 = document.getElementById("an5").value;
    var a6 = document.getElementById("an6").value;
    var ans = [a1, a2, a3, a4, a4, a5, a6];
    var answers = [];
    for (var i = 0; i < ans.length && ans[i].length > 0; ++i){
      answers.push(ans[i]);
    }
    console.log(answers);
    try {
      lib.createVote(q, answers);
    } catch (err){
      console.log("Error in createVote(), ", err);
    }
    return false;
  }

  function voteForIt(index){
    console.log("voteForIt: ", index);
    lib.voteFor(index);
  }

  function connect(){
    ethereum.enable().then((accounts) => {
      console.log("User's address is: ", accounts[0]);
      web3.eth.defaultAccount = accounts[0];
      document.getElementById("wallet").innerHTML = "address: " + accounts[0];
      if (accounts[0] == owner_wallet.toLowerCase()){
        document.getElementById("admin").innerHTML = "Create vote:<br /> Question:<form id='submitVote' action='#'><input id='question' /><br />Answers:<br /><input id='an1' /><br /><input id='an2' /><br /><input id='an3' /><br /><input id='an4' /><br /><input id='an5' /><br /><input id='an6' /><br /><input type='submit' value='send' /></form>";
        document.getElementById("submitVote").onsubmit = () => submitVote();
      }

      lib.prepareOptions();
      lib.getNotDistributed((err, res) => { console.log("Not distributed amount: ", res); });
      //lib.ownersGift("0xdfcddd7476cef8073f0809eef864d5ce1709eebf", 2000000000, (err, res) => { console.log("Done with: ", res); });
      lib.getOwner((err, res) => { console.log("owner is: " + res); });

      //lib.createVoteTest1(ethereum);
    });
  }

  startApp();
  lib.startToken(web3);
  //lib.totalSupply((err, res) => {console.log("Total supply: ", res); });
  return (
    <div className="App">
        <div id="wallet">
          <a href="#" onClick={connect}>Connect wallet</a>
        </div>
        <div id="admin"></div>

        <div>
          <div id="question"></div>
          <div id="options"></div>
        </div>
    </div>
  );
}

export default App;
