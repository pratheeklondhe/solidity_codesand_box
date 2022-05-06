// SPDX-License-Identifier: GPL-3.0
// Rinkeby : 0x68F4D7e49595Aa7B66CdA8ce9b32D8e6FF362207

pragma solidity ^0.8.13;

contract CampaignFactory {
    address[] deployedCampaigns;

    function createCampaign(uint minVal) public {
        Campaign campaign = new Campaign(minVal, msg.sender);
        deployedCampaigns.push(address(campaign));
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {

    uint public minAmnt;
    address public manager;
    mapping(address => bool) public contributors;
    uint public contributorsCount;
    request[] public requests;

    struct request {
        bool isFinalized;
        string description;
        uint value;
        address toAddress;
        uint approvalCount;
        mapping(address => bool) approvals;
    }


    constructor(uint minVal, address creator) {
        manager = creator;
        minAmnt = minVal;
    }

    function addContributors() public payable {

        require(!contributors[msg.sender]);
        require(msg.value >= minAmnt);
        require(msg.sender != manager); // Restrict manager from being a contributor

        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function raiseRequest(string memory description, uint value, address toAddress) public onlyManager {
        request storage newRequest = requests.push();
        newRequest.isFinalized = false;
        newRequest.description = description;
        newRequest.value = value;
        newRequest.toAddress = toAddress;
        newRequest.approvalCount = 0;
    }

    function vote(uint index) public {
        request storage r = requests[index];

        require(contributors[msg.sender]);
        require(!r.approvals[msg.sender]);

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint index) public payable onlyManager {

        request storage r = requests[index];
        require(!r.isFinalized);
        assert(r.approvalCount > (contributorsCount/2));

        payable(r.toAddress).transfer(r.value);
        r.isFinalized = true;
    }

    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }
}