// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enroll() public payable{
        require(msg.value > 0.01 ether);

        players.push(msg.sender);
    }

    function randomNumberGenerator() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public onlyManager {
        uint random = randomNumberGenerator() % players.length;
        payable(players[random]).transfer(address(this).balance);
        players = new address[](0);
    }

    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    }


}