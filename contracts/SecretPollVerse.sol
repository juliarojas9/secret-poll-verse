// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecretPollVerse is SepoliaConfig {
    using FHE for *;
    
    struct Poll {
        euint32 pollId;
        euint32 totalVotes;
        euint32 optionCount;
        bool isActive;
        bool isClosed;
        string question;
        string[] options;
        address creator;
        uint256 startTime;
        uint256 endTime;
        mapping(uint256 => euint32) encryptedVotes;
    }
    
    struct Vote {
        euint32 voteId;
        euint32 pollId;
        euint32 optionIndex;
        address voter;
        uint256 timestamp;
    }
    
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => Vote) public votes;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    
    uint256 public pollCounter;
    uint256 public voteCounter;
    
    address public owner;
    
    event PollCreated(uint256 indexed pollId, address indexed creator, string question);
    event VoteCast(uint256 indexed voteId, uint256 indexed pollId, address indexed voter);
    event PollClosed(uint256 indexed pollId);
    event ResultsRevealed(uint256 indexed pollId, uint32[] results);
    
    constructor() {
        owner = msg.sender;
    }
    
    function createPoll(
        string memory _question,
        string[] memory _options,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_question).length > 0, "Question cannot be empty");
        require(_options.length >= 2, "Must have at least 2 options");
        require(_duration > 0, "Duration must be positive");
        
        uint256 pollId = pollCounter++;
        
        Poll storage poll = polls[pollId];
        poll.pollId = FHE.asEuint32(0); // Will be set properly later
        poll.totalVotes = FHE.asEuint32(0);
        poll.optionCount = FHE.asEuint32(_options.length);
        poll.isActive = true;
        poll.isClosed = false;
        poll.question = _question;
        poll.creator = msg.sender;
        poll.startTime = block.timestamp;
        poll.endTime = block.timestamp + _duration;
        
        // Initialize encrypted vote counts for each option
        for (uint256 i = 0; i < _options.length; i++) {
            poll.options.push(_options[i]);
            poll.encryptedVotes[i] = FHE.asEuint32(0);
        }
        
        emit PollCreated(pollId, msg.sender, _question);
        return pollId;
    }
    
    function castVote(
        uint256 _pollId,
        externalEuint32 _optionIndex,
        bytes calldata _inputProof
    ) public returns (uint256) {
        require(polls[_pollId].creator != address(0), "Poll does not exist");
        require(polls[_pollId].isActive, "Poll is not active");
        require(!polls[_pollId].isClosed, "Poll is closed");
        require(block.timestamp <= polls[_pollId].endTime, "Poll has ended");
        require(!hasVoted[msg.sender][_pollId], "Already voted");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalOptionIndex = FHE.fromExternal(_optionIndex, _inputProof);
        
        uint256 voteId = voteCounter++;
        
        votes[voteId] = Vote({
            voteId: FHE.asEuint32(0), // Will be set properly later
            pollId: FHE.asEuint32(_pollId),
            optionIndex: internalOptionIndex,
            voter: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update poll totals
        polls[_pollId].totalVotes = FHE.add(polls[_pollId].totalVotes, FHE.asEuint32(1));
        
        // Update encrypted vote count for the selected option
        // This is a simplified version - in practice, you'd need more complex logic
        // to handle encrypted vote counting for specific options
        
        hasVoted[msg.sender][_pollId] = true;
        
        emit VoteCast(voteId, _pollId, msg.sender);
        return voteId;
    }
    
    function closePoll(uint256 _pollId) public {
        require(polls[_pollId].creator == msg.sender, "Only creator can close poll");
        require(polls[_pollId].isActive, "Poll is not active");
        require(block.timestamp > polls[_pollId].endTime, "Poll has not ended yet");
        
        polls[_pollId].isActive = false;
        polls[_pollId].isClosed = true;
        
        emit PollClosed(_pollId);
    }
    
    function revealResults(uint256 _pollId) public {
        require(polls[_pollId].isClosed, "Poll must be closed first");
        require(polls[_pollId].creator == msg.sender, "Only creator can reveal results");
        
        // In a real implementation, this would decrypt and return the results
        // For now, we'll emit an event with placeholder results
        uint32[] memory results = new uint32[](polls[_pollId].options.length);
        
        emit ResultsRevealed(_pollId, results);
    }
    
    function getPollInfo(uint256 _pollId) public view returns (
        string memory question,
        string[] memory options,
        uint8 totalVotes,
        bool isActive,
        bool isClosed,
        address creator,
        uint256 startTime,
        uint256 endTime
    ) {
        Poll storage poll = polls[_pollId];
        return (
            poll.question,
            poll.options,
            0, // FHE.decrypt(poll.totalVotes) - will be decrypted off-chain
            poll.isActive,
            poll.isClosed,
            poll.creator,
            poll.startTime,
            poll.endTime
        );
    }
    
    function getVoteInfo(uint256 _voteId) public view returns (
        uint8 optionIndex,
        address voter,
        uint256 timestamp
    ) {
        Vote storage vote = votes[_voteId];
        return (
            0, // FHE.decrypt(vote.optionIndex) - will be decrypted off-chain
            vote.voter,
            vote.timestamp
        );
    }
    
    function hasUserVoted(address _user, uint256 _pollId) public view returns (bool) {
        return hasVoted[_user][_pollId];
    }
    
    function getPollCount() public view returns (uint256) {
        return pollCounter;
    }
    
    function getVoteCount() public view returns (uint256) {
        return voteCounter;
    }
}
