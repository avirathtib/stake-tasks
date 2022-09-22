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

    modifier isUnconfirmed(uint256 id) {
        require()
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







}
