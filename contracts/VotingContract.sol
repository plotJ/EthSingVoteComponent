// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    mapping(address => bool) public hasVoted;
    uint256[4] public votes; // [Red, Blue, Green, Yellow]

    event VoteCast(address voter, uint256 option);

    function vote(uint256 option) external {
        require(option < 4, "Invalid option");
        require(!hasVoted[msg.sender], "Already voted");

        votes[option]++;
        hasVoted[msg.sender] = true;

        emit VoteCast(msg.sender, option);
    }

    function getVotes() external view returns (uint256[4] memory) {
        return votes;
    }
}