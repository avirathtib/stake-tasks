// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import hardhat/console.sol

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract Stake {

    enum Status {
            Success,
            Failure,
            Pending,
            Unconfirmed,
            Stopped
        }    

    struct Stake {
        address stakee;
        string stakeeName;
        address validator;
        string stakeTask; 
        uint256 id;
        Status status;
    }

    Stake[] allStakes = [];

    mapping(address => uint256[]) stakeeTransactionArray;
    mapping(address => uint256[]) validatorTransactionArray;

    event NewStake(uint256 _id, string _task);

    event ValidatorConfirmation(uint256 _id, string _task);

    event TaskConfirmation(uint256 _id, string _task);

    modifier isPending(uint256 id) {
        require(id < allStakes.length);
        require(allStakes[id].status == Status.Pending, "This transaction may have been completed already or is still uncomfirmed");
        _;
    }

    modifier isUnconfirmed(uint256 id) {
        require(id < allStakes.length);
        require(allStakes[id].status == Status.Unconfirmed, "This transaction may have been confirmed already");
        _;
    }

    function commitStake(string memory name, string memory task, address stakeBuddy ) external payable nonReentrant returns(uint256) {
        require(msg.sender != stakeBuddy, "Stakee address cannot be the same as validator's address");
        require(msg.value > 0, "Amount entered cannot be 0. Add some incentive");

        Stake memory newStake = Stake(msg.sender, name, stakeBuddy, task, allStakes.length, Status.Uncomfirmed);

        allStakes.push(newStake);

        stakeeTransactionArray[msg.sender].push(allStakes.length - 1);
        validatorTransactionArray[stakeBuddy].push(allStakes.length - 1);

        emit NewStake(allStakes.length - 1, task);

        return allStakes.length - 1;

    }

    function getAllStakes() public view returns(Stake[] memory) {
        return allStakes;
    }

    function getStakeFromId(uint256 id) public view returns(Stake memory) {
        require(id < allStakes.length);
        return allStakes[id];
    }

    function getStakeeTransactionArray() public view returns(uint256[]) {
        uint256[] ids = stakeeTransactionArray[msg.sender];
        Stake[] tempStakeeTransactionArray = new Stake[](ids.length);
        for(int i = 0; i < ids.length; i++) {
            tempStakeeTransactionArray[i] = getStakeFromId(ids[i]);
        }
        return tempStakeeTransactionArray;
    }

    function getValidatorTransactionArray(address validator) public view returns(uint256[]) {
        uint256[] ids = validatorTransactionArray[msg.sender];
        Stake[] validatorTransactionArray = new Stake[](ids.length);
        for(int i = 0; i < ids.length; i++) {
            validatorTransactionArray[i] = getStakeFromId(ids[i]);
        }
        return validatorTransactionArray;
    }

    function validatorConfirmation(uint256 id) external isUncomfirmed(uint256 id) {
        require(msg.sender == allStakes[id].validator, "Only the validating friend can confirm this stake");
        
        allStakes[id].status = Status.Pending;

        emit ValidatorConfirmation(id, allStakes[id].task);
    }

    function taskSuccess(uint256 id) external isPending(uint256 id) nonReentrant {
        require(msg.sender == allStakes[id].validator, "Only the validating friend can mark a task as successful");
        (bool sent, ) = allStakes[id].stakee.call{value: msg.value}("");
        require(sent, "Failed to send ether");
        allStakes[id].status = Status.Success;
        emit TaskConfirmation(id, allStakes[id].task);
    }







}
