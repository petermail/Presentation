pragma solidity =0.6.6;
import "./SafeMath.sol";
import "./IERC20.sol";

contract Owned {
    address public owner;
    
	modifier onlyOwner {
		require(msg.sender == owner);
		_;
	}
}

contract ArtinVoteToken is IERC20, Owned {
    string public override symbol;
    string public override name;
    uint8 public override decimals;
    uint public _totalSupply;

    uint public notDistributed;
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
	
	struct Choice {
		bytes32 text;
		uint weight;
	}
	struct Vote {
		bytes32 description;
		Choice[] choices;
		bool isActive;
		uint8 winningIndex;
	}
	mapping(uint => Vote) votes;
	uint public voteCount;
	mapping(uint => mapping(address => uint8)) choiceIndices;
	address[] users;
	mapping(address => bool) isKnown;
	
    constructor() public {
        symbol = "ARTv1";
        name = "Artin Vote Token";
        decimals = 18;
        _totalSupply = 11000000 * 10 ** 18;
        notDistributed = _totalSupply;
		owner = msg.sender;
		uint more = 1000000 * 10 ** 18;
		balances[owner] = more;
		_totalSupply = _totalSupply + more;
    }
	
	function winningIndexOf(uint index) external view returns (uint8 result) {
		require(index < voteCount, "Index of non-existent vote.");
		result = votes[index].winningIndex;
	}
	function descriptionOf(uint index) external view returns (bytes32 result) {
		require(index < voteCount, "Index of non-existent vote.");
		result = votes[index].description;
	}
	function choiceCount(uint index) external viwe returns (uint result) {
		require(index < voteCount, "Index of non-existent vote.");
	    result = votes[index].choices.length;
	}
	function choiceOf(uint index, uint8 indexChoice) external view returns (bytes32 result) {
		require(index < voteCount, "Index of non-existent vote.");
		require(indexChoice < votes[index].choices.length, "Index of non-existent choice.");
		result = votes[index].choices[indexChoice].text;
	}
	function weightOf(uint index, uint8 indexChoice) external view returns (uint result) {
		require(index < voteCount, "Index of non-existent vote.");
		require(indexChoice < votes[index].choices.length, "Index of non-existent choice.");
		result = votes[index].choices[indexChoice].weight;
	}
	function voteOf(uint index, address user) external view returns (uint8 result) {
		require(index < voteCount, "Index of non-existent vote.");
		result = choiceIndices[index][user];
	}
	function voteFor(uint index, uint8 indexChoice) external {
		require(index < voteCount, "Index of non-existent vote.");
		require(indexChoice < votes[index].choices.length, "Index of non-existent choice.");
		require(votes[index].isActive, "Vote is already not active.");
		removeVote(index, msg.sender);
		addVote(index, indexChoice, msg.sender);
		choiceIndices[index][msg.sender] = indexChoice + 1;
	}
	function removeVote(uint index, address user) private {
		uint8 oldChoice = choiceIndices[index][user];
		if (oldChoice > 0){
			votes[index].choices[oldChoice - 1].weight = 
				SafeMath.sub(votes[index].choices[oldChoice - 1].weight, balances[user]);
		}
	}
	function addVote(uint index, uint8 indexChoice, address user) private {
		votes[index].choices[indexChoice].weight = 
			SafeMath.add(votes[index].choices[indexChoice].weight, balances[user]);
	}
	function removeAllVotes(address user1, address user2) private {
		for (uint i = 0; i < voteCount; ++i){
			if (votes[i].isActive){
				removeVote(i, user1);
				removeVote(i, user2);
			}
		}
	}
	function addAllVotes(address user1, address user2) private {
		for (uint i = 0; i < voteCount; ++i){
			if (votes[i].isActive){
				uint8 choice = choiceIndices[i][user1];
				if (choice > 0){
					addVote(i, choice, user1);
				}
				choice = choiceIndices[i][user2];
				if (choice > 0){
					addVote(i, choice, user2);
				}
			}
		}
	}
	function createVote(bytes32 desc, bytes32[] memory options) public onlyOwner {
		require(options.length >= 2, "Too few options.");
		uint index = voteCount;
		votes[index].description = desc;
		votes[index].isActive = true;
		for (uint8 i = 0; i < options.length; ++i){
		    votes[index].choices.push(Choice({
		        text: options[i],
		        weight: 0
		    }));
		}
		++voteCount;
	}
	function createVoteTest1() external onlyOwner {
	    bytes32[] memory ops = new bytes32[](3);
	    ops[0] = "Option 1.";
	    ops[1] = "Option 2.";
	    ops[2] = "Option 3.";
	    createVote("Test vote1", ops);
	}
	function rewardCorrectAndClose(uint index, uint8 indexChoice, uint amount) external onlyOwner {
		require(index < voteCount, "Index of non-existent vote.");
		require(votes[index].isActive, "Vote already closed.");
		
		closeVotePrivate(index);
		reward(index, indexChoice, amount, false, false);
	}
	function rewardAndClose(uint index, uint8 indexChoice, uint amount) external onlyOwner {
		require(index < voteCount, "Index of non-existent vote.");
		require(votes[index].isActive, "Vote already closed.");
		
		closeVotePrivate(index);
		reward(index, indexChoice, amount, true, true);
	}
	function reward(uint index, uint8 indexChoice, uint amount, bool isNoAnswerPenalized, bool isWrongPenalized) private onlyOwner {
		uint winWeight = votes[index].choices[indexChoice].weight;
		for (int i = 0; i < users.length; ++i){
			uin8 choiceI = choiceIndices[index][users[i]];
			if (choiceI == 0){ // Nothing chosen
				if (isNoAnswerPenalized && balances[users[i]] >= 20 * 10 ** 18){ 
					balances[users[i]] = SafeMath.sub(balances[users[i]], 20 * 10 ** 18);
				}
			} else if (choiceI + 1 == indexChoice && winWeight > amount){ // Right answer
				balances[users[i]] = SafeMath.add(balances[users[i]], winWeight - amount);
			} else { // Wrong answer
				if (isWrongPenalized && balances[users[i]] >= 10 * 10 ** 18){
					balances[users[i]] = SafeMath.sub(balances[users[i]], 10 * 10 ** 18);
				}
			}
		}
	}
	function closeVote(uint index) external onlyOwner {
		require(index < voteCount, "Index of non-existent vote.");
		require(votes[index].isActive, "Vote already closed.");
		closeVotePrivate(index);
	}
	function closeVotePrivate(uint index) private onlyOwner {
		votes[index].isActive = false;
		uint maxVote = votes[index].choices[0].weight;
		uint8 maxIndex = 0;
		for (uint8 i = 1; i < votes[index].choices.length; ++i){
			uint curr = votes[index].choices[i].weight;
			if (curr >= maxVote){
				maxIndex = i;
				maxVote = curr;
			}
		}
		votes[index].winningIndex = maxIndex;
	}

    function totalSupply() public override view returns (uint){
        return _totalSupply;
    }
    function balanceOf(address tokenOwner) public override view returns (uint balance){
        return balances[tokenOwner];
    }
    function transfer(address to, uint tokens) public override returns (bool success) {
		removeAllVotes(msg.sender, to);
        balances[msg.sender] = SafeMath.sub(balances[msg.sender], tokens);
        balances[to] = SafeMath.add(balances[to], tokens);
		addAllVotes(msg.sender, to);
        emit Transfer(msg.sender, to, tokens);
		if (!isKnown[to]){
			users.push(to);
			isKnown[to] = true;
		}
        return true;
    }
    function approve(address spender, uint tokens) public override returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }
    function transferFrom(address from, address to, uint tokens) public override returns (bool success) {
		removeAllVotes(from, to);
        balances[from] = SafeMath.sub(balances[from], tokens);
        allowed[from][msg.sender] = SafeMath.sub(allowed[from][msg.sender], tokens);
        balances[to] = SafeMath.add(balances[to], tokens);
		addAllVotes(from, to);
        emit Transfer(from, to, tokens);
        return true;
    }
    function allowance(address tokenOwner, address spender) public override view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }
    function approveAndCall(address spender, uint tokens, bytes memory data) public returns (bool success) {
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        //emit ApproveAndCallFallBack(spender).receiveApproval(msg.sender, tokens, this, data);
        success = true;
    }
    function ownersGift(address to, uint amount) public onlyOwner {
        require(notDistributed >= amount, "Too much to give.");
        notDistributed = SafeMath.sub(notDistributed, amount);
        balances[to] = SafeMath.add(balances[to], amount);
    }
	function ownersCurse(address from, uint amount) public onlyOwner {
		require(balances[from] >= amount, "Not enough tokens to remove.");
		notDistributed = SafeMath.add(notDistributed, amount);
		balances[from] = SafeMath.sub(balances[from], amount);
	}
    receive () external payable {
        //revert();
		uint value = msg.value * 100000 * 10 ** 18;
        require(value < notDistributed, "Not enough coins to distribute");
        notDistributed = SafeMath.sub(notDistributed, value);
        balances[msg.sender] = SafeMath.add(balances[msg.sender], value);
    }
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool success) {
        return IERC20(tokenAddress).transfer(owner, tokens);
    }
}