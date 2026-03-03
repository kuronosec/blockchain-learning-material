// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Voting - minimal one-person-one-vote contract
contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] private candidates;
    mapping(address => bool) private hasVoted;

    event Voted(address indexed voter, uint256 indexed candidateIndex);

    constructor(string[] memory candidateNames) {
        require(candidateNames.length > 0, "At least one candidate required");

        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 candidateIndex) external {
        require(!hasVoted[msg.sender], "You already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount += 1;

        emit Voted(msg.sender, candidateIndex);
    }

    function getCandidate(uint256 candidateIndex) external view returns (string memory name, uint256 voteCount) {
        require(candidateIndex < candidates.length, "Invalid candidate");
        Candidate memory candidate = candidates[candidateIndex];
        return (candidate.name, candidate.voteCount);
    }

    function getCandidatesCount() external view returns (uint256) {
        return candidates.length;
    }

    function hasAddressVoted(address voter) external view returns (bool) {
        return hasVoted[voter];
    }
}
