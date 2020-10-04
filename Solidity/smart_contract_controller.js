const ERC20ArtinVoteTokenABI = [];
const ARTv1_ADDRESS = "";

import WalletLink from "walletlink";
import Web3 from "web3";

export const walletLink = new WalletLink({
  appName: "ArtinVoteToken",
  appLogoUrl: "https://example.com/logo.png",
  darkMode: true
})

export const ethereum = walletLink.makeWeb3Provider(
  "https://kovan.infura.io/v3/b78a27720f0d486da26c0d3c95158aef", 1
)

export const web3 = new Web3(ethereum)
const artinToken = new web3.eth.Contract(ERC20ArtinVoteTokenABI, ARTv1_ADDRESS)

const senderAddress = "0x4d10ae710Bd8D1C31bd7465c8CBC3add6F279E81"

const logResult = function(err, res){
	if (err){
		console.log("An error occured", err)
		return
	}
	console.log("The balance is: ", res)
}

function connect(){
	ethereum.enable().then((accounts: string[]) => {
		console.log(`User's address is ${accounts[0]}`);
		web3.eth.defaultAccount = accounts[0];
	});
}
function disconnect(){
	walletLink.disconnect()
}

function createVote(desc, options){
	var choices = [];
	for (i = 0; i < options.length; ++i){
		choices[i] = web3.fromAscii(options[i]);
	}
	artinToken.methods.createVote(web3.fromAscii(desc), choices).call(logResult);
}

function choiceCount(index, funcResp){
	artinToken.methods.choiceCount(index).call(funcResp);
}
function getVotePrivate(index, count, nameDesc, nameOptions){
	artinToken.methods.descriptionOf(index).call(function(err, res){
		var jVal1 = JSON.parse(res);
		document.getElementById(nameDesc).innerHTML = jVal1[0].result;
	})
	for (i = 0; i < count; ++i){
		artinToken.methods.choiceOf(index, i).call(function(err, res){
			var jVal1 = JSON.parse(res);
			document.getElementById(nameOptions[i]).innerHTML = jVal1[0].result;
		});
	}
}
function getVote(index, nameDesc, nameOptions){
	//artinToken.methods.choiceCount(index).call(
	//)
	choiceCount(index, function(err, res){
		var jVal = JSON.parse(res);
		var count = jVal[0].result;
		getVotePrivate(index, count, nameDesc, nameOptions);
	});
}
function voteFor(index, indexChoice){
	artinToken.methods.voteFor(index, indexChoice).call(logResult);
}
function reward(index, indexChoice){
	artinToken.methods.reward(index, indexChoice).call(logResult);
}
function rewardCorrect(index, indexChoice){
	artinToken.methods.rewardCorrect(index, indexChoice).call(logResult);
}

artinToken.methods.balanceOf(senderAddress).call(logResult)
