// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract Stake is ReentrancyGuard{

    enum Status {
            Success,
            Failure,
            Pending,
            Unconfirmed,
            Stopped
        }    

    struct Staker {
        address stakee;
        string stakeeName;
        address validator;
        string stakeTask; 
        uint256 id;
        uint256 amount;
        Status status;
    }

    Staker[] allStakes;

    address constant donationAddress = 0xDcE5d7b882840D443e107De4335EFCaE0Fd5c74A;

    mapping(address => uint256[]) stakeeTransactionArray;
    mapping(address => uint256[]) validatorTransactionArray;

    event NewStake(uint256 _id, string _task);

    event ValidatorConfirmation(uint256 _id, string _task);

    event TaskSuccess(uint256 _id, string _task);

    event TaskFailure(uint256 _id, string _task);

    event TaskStopped(uint256 _id, string _task);

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

    receive() external payable {}

    function commitStake(string memory name, string memory task, address stakeBuddy ) external payable nonReentrant returns(uint256) {
        require(msg.sender != stakeBuddy, "Stakee address cannot be the same as validator's address");
        require(msg.value > 0, "Amount entered cannot be 0. Add some incentive");

        Staker memory newStake = Staker(msg.sender, name, stakeBuddy, task, allStakes.length, msg.value, Status.Unconfirmed);

        allStakes.push(newStake);

        stakeeTransactionArray[msg.sender].push(allStakes.length - 1);
        validatorTransactionArray[stakeBuddy].push(allStakes.length - 1);

        emit NewStake(allStakes.length - 1, task);

        return allStakes.length - 1;

    }

    function getAllStakes() public view returns(Staker[] memory) {
        return allStakes;
    }

    function getStakeFromId(uint256 id) public view returns(Staker memory) {
        require(id < allStakes.length);
        return allStakes[id];
    }

    function getStakeeTransactionArray() public view returns(Staker[] memory) {
        uint256[] storage ids = stakeeTransactionArray[msg.sender];
        Staker[] memory tempStakeeTransactionArray = new Staker[](ids.length);
        for(uint i = 0; i < ids.length; i++) {
            tempStakeeTransactionArray[i] = getStakeFromId(ids[i]);
        }
        return tempStakeeTransactionArray;
    }

    function getValidatorTransactionArray() public view returns(Staker[] memory) {
        uint256[] storage ids = validatorTransactionArray[msg.sender];
        Staker[] memory validatorsTransactionArray = new Staker[](ids.length);
        for(uint i = 0; i < ids.length; i++) {
            validatorsTransactionArray[i] = getStakeFromId(ids[i]);
        }
        return validatorsTransactionArray;
    }

    function validatorConfirmation(uint256 id) external isUnconfirmed(id) nonReentrant {
        require(msg.sender == allStakes[id].validator, "Only the validating friend can confirm this stake");
        
        allStakes[id].status = Status.Pending;

        emit ValidatorConfirmation(id, allStakes[id].stakeTask);
    }

    function taskSuccess(uint256 id) external payable isPending(id) nonReentrant {
        require(msg.sender == allStakes[id].validator, "Only the validating friend can mark a task as successful");
        (bool sent, ) = allStakes[id].stakee.call{value: allStakes[id].amount}("");
        require(sent, "Failed to send ether");
        allStakes[id].status = Status.Success;
        emit TaskSuccess(id, allStakes[id].stakeTask);
    }

    function taskFailure(uint256 id) external payable isPending(id) nonReentrant {
        require(msg.sender == allStakes[id].validator, "Only the validating friend can mark a task as a failure");
        (bool sent, ) = donationAddress.call{value: allStakes[id].amount}("");
        require(sent, "Failure to send ether");
        allStakes[id].status = Status.Failure;
        emit TaskFailure(id, allStakes[id].stakeTask);
    }

    function abortTask(uint256 id) external payable isUnconfirmed(id) nonReentrant {
        require(msg.sender == allStakes[id].stakee, "Only the stakee can abort a transaction/task");
        (bool sent, ) = allStakes[id].stakee.call{value: msg.value}("");
        require(sent, "Failure to send ether");
        allStakes[id].status = Status.Stopped;
        emit TaskStopped(id, allStakes[id].stakeTask);
    }

}
