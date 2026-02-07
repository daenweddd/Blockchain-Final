// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./RewardToken.sol";

/// @title CharityCrowdfunding - testnet crowdfunding with ERC-20 rewards
/// @notice Educational project. Uses only test ETH on Sepolia (or local).
contract CharityCrowdfunding is ReentrancyGuard {

    // Campaign data stored on-chain
    struct Campaign {
        string title;          // campaign name
        uint256 goal;          // goal in wei
        uint256 deadline;      // unix timestamp (seconds)
        address creator;       // who created the campaign
        address beneficiary;   // who receives funds if successful
        uint256 totalRaised;   // total collected in wei
        bool finalized;        // true after finalizeCampaign()
        bool successful;       // true if totalRaised >= goal
    }

    // ERC-20 reward token contract
    RewardToken public immutable rewardToken;

    // campaignId => Campaign
    mapping(uint256 => Campaign) public campaigns;

    // campaignId => user => contributed wei
    mapping(uint256 => mapping(address => uint256)) public contributions;

    // total number of campaigns created
    uint256 public campaignCount;

    // Reward rate: token units per 1 wei contributed
    uint256 public constant REWARD_RATE = 1000;

    // Duration limits to avoid very small/very large deadlines
    uint256 public constant MIN_DURATION = 60;         // 1 minute
    uint256 public constant MAX_DURATION = 30 days;    // 30 days

    // Emitted when a new campaign is created
    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        address indexed beneficiary,
        string title,
        uint256 goal,
        uint256 deadline
    );

    // Emitted when someone contributes
    event Contributed(
        uint256 indexed id,
        address indexed contributor,
        uint256 amountWei,
        uint256 rewardMinted
    );

    // Emitted when campaign is finalized
    event Finalized(uint256 indexed id, bool successful, uint256 totalRaised);

    // Emitted when a contributor gets a refund
    event Refunded(uint256 indexed id, address indexed contributor, uint256 amountWei);

    // Custom errors 
    error InvalidGoal();
    error InvalidDuration();
    error InvalidTitle();
    error InvalidBeneficiary();
    error CampaignNotFound();
    error CampaignEnded();
    error ZeroContribution();
    error TooEarly();
    error AlreadyFinalized();
    error NotRefundable();
    error NothingToRefund();
    error TransferFailed();

    // Save token address 
    constructor(address rewardTokenAddress) {
        rewardToken = RewardToken(rewardTokenAddress);
    }

    // Create a new campaign
    function createCampaign(
        string calldata title,
        uint256 goalWei,
        uint256 durationSeconds,
        address beneficiary
    ) external returns (uint256 id) {

        // basic input checks
        if (bytes(title).length == 0) revert InvalidTitle();
        if (goalWei == 0) revert InvalidGoal();
        if (durationSeconds < MIN_DURATION || durationSeconds > MAX_DURATION) revert InvalidDuration();
        if (beneficiary == address(0)) revert InvalidBeneficiary();

        // create campaign id
        id = campaignCount++;

        // store campaign data
        Campaign storage c = campaigns[id];
        c.title = title;
        c.goal = goalWei;
        c.deadline = block.timestamp + durationSeconds;
        c.creator = msg.sender;
        c.beneficiary = beneficiary;

        emit CampaignCreated(id, msg.sender, beneficiary, title, goalWei, c.deadline);
    }

    // Contribute ETH and mint reward tokens
    function contribute(uint256 id) external payable nonReentrant {

        // check campaign exists
        if (id >= campaignCount) revert CampaignNotFound();

        Campaign storage c = campaigns[id];

        // campaign must be active
        if (block.timestamp >= c.deadline) revert CampaignEnded();
        if (msg.value == 0) revert ZeroContribution();

        // update storage
        contributions[id][msg.sender] += msg.value;
        c.totalRaised += msg.value;

        // mint reward tokens to contributor
        uint256 rewardAmount = msg.value * REWARD_RATE;
        rewardToken.mint(msg.sender, rewardAmount);

        emit Contributed(id, msg.sender, msg.value, rewardAmount);
    }

    // Finalize after deadline: send funds if success, else allow refunds
    function finalizeCampaign(uint256 id) external nonReentrant {

        // check campaign exists
        if (id >= campaignCount) revert CampaignNotFound();

        Campaign storage c = campaigns[id];

        // only once
        if (c.finalized) revert AlreadyFinalized();

        // must be after deadline
        if (block.timestamp < c.deadline) revert TooEarly();

        c.finalized = true;

        // success: send ETH to beneficiary
        if (c.totalRaised >= c.goal) {
            c.successful = true;

            (bool ok, ) = c.beneficiary.call{value: c.totalRaised}("");
            if (!ok) revert TransferFailed();
        } else {
            // failed: ETH stays in contract for refunds
            c.successful = false;
        }

        emit Finalized(id, c.successful, c.totalRaised);
    }

    // Refund contributor if campaign failed and was finalized
    function refund(uint256 id) external nonReentrant {

        // check campaign exists
        if (id >= campaignCount) revert CampaignNotFound();

        Campaign storage c = campaigns[id];

        // refund only after finalize and only if failed
        if (!c.finalized) revert TooEarly();
        if (c.successful) revert NotRefundable();

        uint256 amount = contributions[id][msg.sender];
        if (amount == 0) revert NothingToRefund();

        // update state first (important for safety)
        contributions[id][msg.sender] = 0;

        // send ETH back to contributor
        (bool ok, ) = msg.sender.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Refunded(id, msg.sender, amount);
    }

    // Quick status helper for UI
    function getStatus(uint256 id)
        external
        view
        returns (bool active, bool ended, bool finalized, bool successful)
    {
        if (id >= campaignCount) revert CampaignNotFound();
        Campaign storage c = campaigns[id];

        active = block.timestamp < c.deadline && !c.finalized;
        ended = block.timestamp >= c.deadline;
        finalized = c.finalized;
        successful = c.successful;
    }

    // One-call getter for frontend
    function getCampaign(uint256 id)
        external
        view
        returns (
            string memory title,
            uint256 goal,
            uint256 deadline,
            address creator,
            address beneficiary,
            uint256 totalRaised,
            bool finalized,
            bool successful
        )
    {
        if (id >= campaignCount) revert CampaignNotFound();
        Campaign storage c = campaigns[id];

        return (
            c.title,
            c.goal,
            c.deadline,
            c.creator,
            c.beneficiary,
            c.totalRaised,
            c.finalized,
            c.successful
        );
    }
}
