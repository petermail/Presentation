const ERC20ArtinVoteTokenABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "_totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "notDistributed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "voteCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "winningIndexOf",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "result",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "descriptionOf",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "result",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "choiceCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "result",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "indexChoice",
          "type": "uint8"
        }
      ],
      "name": "choiceOf",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "result",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "indexChoice",
          "type": "uint8"
        }
      ],
      "name": "weightOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "result",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "voteOf",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "result",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "indexChoice",
          "type": "uint8"
        }
      ],
      "name": "voteFor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "desc",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32[]",
          "name": "options",
          "type": "bytes32[]"
        }
      ],
      "name": "createVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "createVoteTest1",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "indexChoice",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "rewardCorrectAndClose",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "indexChoice",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "rewardAndClose",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "closeVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenOwner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenOwner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "remaining",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "approveAndCall",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ownersGift",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ownersCurse",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokens",
          "type": "uint256"
        }
      ],
      "name": "transferAnyERC20Token",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
const ARTv1_ADDRESS = "0xd2A344D2a6B6C8c0bdEbC95B49519367a1E8f7A7";
const senderAddress = "0x0979d9f8f0330518a6de7769a44baa666f37f0c2"; //"0x4d10ae710Bd8D1C31bd7465c8CBC3add6F279E81";

var web3;
var artinToken;
var wasStarted = false;
export async function startToken(localWeb3){
  if (!wasStarted){
    wasStarted = true;  
  web3 = localWeb3;
  try {
    artinToken = new web3.eth.Contract(ERC20ArtinVoteTokenABI, ARTv1_ADDRESS);//, 
      //{ from: senderAddress });//*/
  } catch (error) {
	  alert("Error parsing contract: " + error);
  }
  }
}

const logResult = function(err, res){
	if (err){
		console.log("An error occured", err)
		return
	}
	console.log("The result is: ", res)
}

function logError(err){
	if (err){
		console.log("An error occured: ", err);
	}
}

export function getNonce(account, callback){
  web3.eth.getTransactionCount(account, (err, res) => { callback(err, web3.utils.toHex(res)); });
}
export function getTxObject(nonce, gasLimit, gweiGasPrice, data){
  console.log("Sender address: ", web3.eth.defaultAccount);
  var res = {
    nonce: nonce,
    gasLimit: web3.utils.toHex(gasLimit),
    gasPrice: web3.utils.toHex(web3.utils.toWei(gweiGasPrice, 'gwei')),
    to: "0xd2A344D2a6B6C8c0bdEbC95B49519367a1E8f7A7",
    from: web3.eth.defaultAccount,
    data: data,
    chainId: 42 // To be sure to use kovan testnet chain
  };
  return res;
}
export function sendSigned(raw, callback){
  web3.eth.sendSignedTransaction(raw, callback);
}
export async function sendSignedTx(ethereum, txObject){
  console.log(ethereum);
  await ethereum.send({
    method: 'eth_sendTransaction',
    params: [txObject]
  }, 
  (err, res) => {
    console.log("Returned: ", res);
  });
}
async function sendSignedTxAsync(ethereum, txObject, callback){
  await ethereum.send({
    method: 'eth_sendTransaction',
    params: [txObject]
  }, callback);
}
async function sendSignedTxWCAsync(provider, method, txObject){
  console.log("method: ", method);
  console.log("txObject: ", txObject);
  await provider.send(method, txObject);
}

export function createVote(eth, desc, options){
	var choices = [];
	for (var i = 0; i < options.length; ++i){
		choices[i] = web3.utils.fromAscii(options[i]);
	}
  //artinToken.methods.createVote(web3.utils.fromAscii(desc), choices).call(logResult);
  transactionPrivate(eth, 
    artinToken.methods.createVote(web3.utils.fromAscii(desc), choices));
}
export function createVoteTest1(eth){
  //artinToken.methods.createVoteTest1().call(logResult);
  getNonce(web3.eth.defaultAccount, (err, res) => {
    if (!err){
      var nonce = res;
      console.log("Nonce: ", nonce);
      var data = artinToken.methods.createVoteTest1().encodeABI();
      var decodedData = web3.utils.toAscii(data);
      console.log("decoded data: ", decodedData);
      var txObj = getTxObject(nonce, 2100000, "30", data);
      console.log("Tx: ", txObj);
      sendSignedTx(eth, txObj);
    }
  });
}

function choiceCount(index, funcResp){
  console.log("IN: choiceCount() ", index);
	artinToken.methods.choiceCount(index).call(funcResp);
}
export function scoped(val, func){
  func(val);
}
function getVotePrivate(index, count, nameDesc, nameOptions){
	artinToken.methods.descriptionOf(index).call(function(err, res){
		document.getElementById(nameDesc).innerHTML = web3.utils.toAscii(res);
  });
  var printText = (in1, tx1) => "<div><a href='#' onclick='voteForIt("+in1+")'>"+tx1+"</a><div id='val"+in1+"'></div></div>";
	for (var i = 0; i < count; ++i){
    scoped(i, (i1) => {
		  artinToken.methods.choiceOf(index, i1).call(function(err, res){
        document.getElementById(nameOptions[i1]).innerHTML = 
          printText(i1, web3.utils.toAscii(res));
        artinToken.methods.weightOf(index, i1).call(function(err1, res1){
          if (!err){
            document.getElementById("val"+i1).innerHTML = res1;
          }
        });
      });
    });
	}
}
function getVote(index, nameDesc, nameOptions){
	choiceCount(index, function(err, res){
    var jVal = JSON.parse(res);
    console.log("getVote: ", res);
		var count = jVal[0].result;
		getVotePrivate(index, count, nameDesc, nameOptions);
	});
}
export function voteFor(eth, indexChoice, callback){
  getNonce(web3.eth.defaultAccount, (err, nonce) => {
    if (!err){
      var data = artinToken.methods.voteFor(index, indexChoice).encodeABI();
      var txObj = getTxObject(nonce, 2100000, "30", data);
      sendSignedTxAsync(eth, txObj, callback);
    }
  });
	//artinToken.methods.voteFor(index, indexChoice).call(logResult);
}
export function voteForTemp(_web3, indexChoice, callback){
  getNonce(web3.eth.defaultAccount, (err, nonce) => {
    if (!err){
      var data = artinToken.methods.voteFor(index, indexChoice).encodeABI();
      var txObj = getTxObject(nonce, 2100000, "30", data);
      sendSignedTxWCAsync(_web3, "eth_sendTransaction", txObj);
    }
  });
}
function transactionPrivate(eth, action){
  getNonce(web3.eth.defaultAccount, (err, nonce) => {
    if (!err){
      var data = action.encodeABI();
      var txObj = getTxObject(nonce, 2100000, "30", data);
      sendSignedTx(eth, txObj);
    }
  });
}
function reward(index, indexChoice){
	artinToken.methods.reward(index, indexChoice).call(logResult);
}
function rewardCorrect(index, indexChoice){
	artinToken.methods.rewardCorrect(index, indexChoice).call(logResult);
}
export function totalSupply(response){
	artinToken.methods.totalSupply().call(response);
}
export function getVoteCount(response){
  artinToken.methods.voteCount().call(response);
}
export function getOwner(response){
  artinToken.methods.owner().call(response);
}
export function getBalanceOf(address, response){
  artinToken.methods.balanceOf(address).call(response);
}
export function getNotDistributed(response){
  artinToken.methods.notDistributed().call(response);
}
export function ownersGift(addressTo, amount, response){
  artinToken.methods.ownersGift(addressTo, amount).call(response);
}

var index = 0; // Index of the vote
export function setIndex(indexPoll){
  index = indexPoll;
}
export function prepareOptions(){
	var ops = "";
	choiceCount(index, function(err, res){
    console.log("returned choices, err: ", err);
    if (!err){
      console.log("returned count", res);
		  var count = res;
		  var options = [];
		  for (var i = 0; i < count; ++i){
			  ops += "<div id='op" + i + "'></div>";
			  options[i] = "op" + i;
		  }
      document.getElementById("options").innerHTML = ops;
      console.log("options: ", options);
      getVotePrivate(index, count, "question", options);
    }
	});
}
function makePromise(func){
  return new Promise(resolve => {
    func(resolve);
  });
}
export async function prepeareOptionsAsync(){
  var x = await makePromise((resolve) => {
    choiceCount(index, function(err, res){
      resolve(res);
    })
  });
  return x;
}
export async function choiceOfAsync(i1){
  return await makePromise((resolve) => {
    artinToken.methods.choiceOf(index, i1).call(
      function(err, res){
        if (!err){
          resolve(web3.utils.toAscii(res.replace(/([0]*)$/, ''))); 
        }
      }
    )
  });
}
export async function weightOfAsync(i1){
  return await makePromise((resolve) => {
    artinToken.methods.weightOf(index, i1).call(
      function(err, res){
        resolve(web3.utils.fromWei(res, 'ether'));
      }
    )
  });
}
export async function descriptionOfAsync(){
  return await makePromise((resolve) => {
    artinToken.methods.descriptionOf(index).call(
      function(err, res){ 
        if (!err){
          resolve(web3.utils.toAscii(res.replace(/([0]*)$/, ''))); 
        }
      }
    )
  });
}
	
/*window.addEventListener('load', async function() {
	try {
		await window.ethereum.enable();
	} catch (error){
		//alert("Error: " + error);
	}
	
	// Checking if Web3 has been injected by the browser (Mist/MetaMask)
	if (typeof web3 !== 'undefined') {
	// Use Mist/MetaMask's provider
		web3js = new Web3(web3.currentProvider);
	} else {
	// Handle the case where the user doesn't have web3. Probably
	// show them a message telling them to install Metamask in
	// order to use our app.
	}
		
	// Start app
	totalSupply(function(err, res){
		logError(err);
		document.getElementById("total").innerHTML = res;
	});
});
*/