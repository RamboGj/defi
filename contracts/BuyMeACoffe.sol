// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BuyMeACoffe {
    // Event to emit when a Memo is created
    event NewMemo(
        address indexed sender,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address sender;
        uint256 timestamp;
        string name;
        string message;
    }

    //List of Memos received
    Memo[] memos;

    // Address of contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    // buy coffe for contract owner
    function buyCoffe(string memory _coffeBuyer, string memory _message) public payable {
        require(msg.value > 0, "Insuficient Funds");

        //Add the Memo to memos var, in the storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _coffeBuyer,
            _message
        ));

        // Emit a event when Memo is created
        emit NewMemo(msg.sender, block.timestamp, _coffeBuyer, _message);
    }

    // send the entire contract balance to the contract owner wallet
    function withdrawTips() public payable {
        require(owner.send(address(this).balance));
    }

    // returns us all the memos stored on the blockchain
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }

    function getOwnerAddress() public view returns(address) {
        return owner;
    }

    function getContractFunds() public view returns(uint256) {
        return address(this).balance;
    }
    
}

