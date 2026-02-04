// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./RewardToken.sol";

/// @title CharityCrowdfunding - testnet crowdfunding with ERC-20 rewards
/// @notice Educational only. Uses test ETH, deploy to Sepolia/Holesky/local.
contract CharityCrowdfunding is ReentrancyGuard {
    struct Campaign {
        string title;
        uint256 goal;       //УДyghjrekfnw,dmfkji
        uint256 deadline;    // unix timestamp
        address creator;
        address beneficiary;
        uint256 totalRaised; // wei
        bool finalized;
        bool successful;
    }

    RewardToken public immutable rewardToken;

    // campaignId => campaign
    mapping(uint256 => Campaign) public campaigns;

    // campaignId => (user => amountWei)
    mapping(uint256 => mapping(address => uint256)) public contributions;

    uint256 public campaignCount;

    /// @dev Reward rate: how many tokens per 1 wei contributed.
    /// Example: if RATE = 1000, then 0.01 ETH (1e16 wei) => 1e19 token units (with 18 decimals).
    /// You can change this number for nicer UI later.
    uint256 public constant REWARD_RATE = 1000;

    event CampaignCreated(
        uint256 indexed id,
        address indexed creator,
        address indexed beneficiary,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event Contributed(
        uint256 indexed id,
        address indexed contributor,
        uint256 amountWei,
        uint256 rewardMinted
    );

    event Finalized(uint256 indexed id, bool successful, uint256 totalRaised);
    event Refunded(uint256 indexed id, address indexed contributor, uint256 amountWei);

    error InvalidGoal();
    error InvalidDuration();
    error InvalidBeneficiary();
    error CampaignNotFound();
    error CampaignEnded();
    error ZeroContribution();
    error TooEarly();
    error AlreadyFinalized();
    error NotRefundable();
    error NothingToRefund();
    error TransferFailed();

    constructor(address rewardTokenAddress) {
        rewardToken = RewardToken(rewardTokenAddress);
    }

    /// @notice Create a charity campaign
    /// @param title Campaign title
    /// @param goalWei Funding goal in wei
    /// @param durationSeconds Duration from now
    /// @param beneficiary Address that receives funds if successful
    function createCampaign(
        string calldata title,
        uint256 goalWei,
        uint256 durationSeconds,
        address beneficiary
    ) external returns (uint256 id) {
        if (goalWei == 0) revert InvalidGoal();
        if (durationSeconds == 0) revert InvalidDuration();
        if (beneficiary == address(0)) revert InvalidBeneficiary();

        id = campaignCount++;
        Campaign storage c = campaigns[id];

        c.title = title;
        c.goal = goalWei;
        c.deadline = block.timestamp + durationSeconds;
        c.creator = msg.sender;
        c.beneficiary = beneficiary;

        emit CampaignCreated(id, msg.sender, beneficiary, title, goalWei, c.deadline);
    }

    /// @notice Contribute test ETH to an active campaign + mint reward tokens
    function contribute(uint256 id) external payable nonReentrant {
        if (id >= campaignCount) revert CampaignNotFound();

        Campaign storage c = campaigns[id];
        if (block.timestamp >= c.deadline) revert CampaignEnded();
        if (msg.value == 0) revert ZeroContribution();

        contributions[id][msg.sender] += msg.value;
        c.totalRaised += msg.value;

        uint256 rewardAmount = msg.value * REWARD_RATE;
        rewardToken.mint(msg.sender, rewardAmount);

        emit Contributed(id, msg.sender, msg.value, rewardAmount);
    }

    /// @notice Finalize after deadline; send funds to beneficiary if successful
    function finalizeCampaign(uint256 id) external nonReentrant {
        if (id >= campaignCount) revert CampaignNotFound();

        Campaign storage c = campaigns[id];
        if (c.finalized) revert AlreadyFinalized();
        if (block.timestamp < c.deadline) revert TooEarly();

        c.finalized = true;

        if (c.totalRaised >= c.goal) {
            c.successful = true;

            (bool ok, ) = c.beneficiary.call{value: c.totalRaised}("");
            if (!ok) revert TransferFailed();
        } else {
            c.successful = false;
            // funds remain for refunds
        }

        emit Finalized(id, c.successful, c.totalRaised);
    }

    /// @notice Refund if campaign failed (after finalize)
    function refund(uint256 id) external nonReentrant {
        if (id >= campaignCount) revert CampaignNotFound();

        Campaign storage c = campaigns[id];
        if (!c.finalized) revert TooEarly();
        if (c.successful) revert NotRefundable();

        uint256 amount = contributions[id][msg.sender];
        if (amount == 0) revert NothingToRefund();

        contributions[id][msg.sender] = 0;

        (bool ok, ) = msg.sender.call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Refunded(id, msg.sender, amount);
    }

    /// @notice Helper: campaign status for frontend
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
}
