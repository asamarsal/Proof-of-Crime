// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal interface USDCRIME (ERC20-like)
interface IUSDCRIME {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

/**
 * @title SmartContractBounty
 * @notice Global bounty manager for smart contract / security audits
 *         - Uses USDCRIME as reward token
 *         - One contract can handle many bounties
 *         - Reward % is configurable per bounty (Low/Medium/High)
 */
contract SmartContractBounty {
    // =========================
    // ======== TYPES ==========
    // =========================

    enum Severity {
        None,
        Low,
        Medium,
        High
    }

    struct Bounty {
        // Who created this bounty
        address company;
        // Token locked as bounty pool
        uint256 lockedAmount;
        // Extra deposit (jaminan) from company
        uint256 depositAmount;
        // Bounty deadline (unix timestamp)
        uint64 deadline;
        // Status flags
        bool active;
        bool evaluated;
        bool vaultOpened;
        // Result
        address hunterWinner;
        Severity resultSeverity;
        // Reward percentages (per bounty, in %)
        uint8 lowPct;
        uint8 mediumPct;
        uint8 highPct;
    }

    // =========================
    // ======== STORAGE ========
    // =========================

    IUSDCRIME public immutable usdcrime;

    // minimal saldo USDCRIME yang harus dimiliki perusahaan
    // 100 * 10^6 (karena decimals = 6)
    uint256 public constant MIN_COMPANY_BALANCE = 100 * 10 ** 6;

    // semua bounty disimpan di dalam 1 kontrak
    uint256 public bountyCount;
    mapping(uint256 => Bounty) public bounties;

    // --- Multisig approver (wallet1, wallet2, wallet3, dll) ---
    address public owner;
    address[] public approvers;
    mapping(address => bool) public isApprover;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(uint256 => uint8) public approvalCount;
    uint8 public immutable requiredApprovals; // ex: 3

    // =========================
    // ========= EVENTS ========
    // =========================

    event BountyCreated(
        uint256 indexed bountyId,
        address indexed company,
        uint256 lockedAmount,
        uint256 depositAmount,
        uint8 lowPct,
        uint8 mediumPct,
        uint8 highPct,
        uint64 deadline
    );

    event HunterJoined(uint256 indexed bountyId, address indexed hunter);

    event BountyEvaluated(
        uint256 indexed bountyId,
        address indexed hunterWinner,
        Severity severity
    );

    event VaultApproved(uint256 indexed bountyId, address indexed approver);

    event VaultOpened(
        uint256 indexed bountyId,
        uint256 rewardAmount,
        address indexed hunterWinner,
        uint256 refundToCompany
    );

    // =========================
    // ======== MODIFIER =======
    // =========================

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyApprover() {
        require(isApprover[msg.sender], "Not approver");
        _;
    }

    // =========================
    // ======= CONSTRUCTOR =====
    // =========================

    /**
     * @param usdcrimeAddress address USDCRIME token
     * @param _approvers list approver untuk multisig vault (misal 3 wallet)
     * @param _requiredApprovals jumlah minimal approval untuk open vault
     */
    constructor(
        address usdcrimeAddress,
        address[] memory _approvers,
        uint8 _requiredApprovals
    ) {
        require(usdcrimeAddress != address(0), "Invalid USDCRIME address");
        require(_approvers.length > 0, "No approvers");
        require(
            _requiredApprovals > 0 && _requiredApprovals <= _approvers.length,
            "Bad required approvals"
        );

        owner = msg.sender;
        usdcrime = IUSDCRIME(usdcrimeAddress);

        requiredApprovals = _requiredApprovals;

        for (uint256 i = 0; i < _approvers.length; i++) {
            address a = _approvers[i];
            require(a != address(0), "Approver zero");
            require(!isApprover[a], "Duplicate approver");
            approvers.push(a);
            isApprover[a] = true;
        }
    }

    // =========================
    // ====== CORE LOGIC =======
    // =========================

    /**
     * @notice Create new bounty
     * @param lockAmount jumlah USDCRIME yang dikunci sebagai bounty pool
     * @param depositAmount jumlah USDCRIME sebagai jaminan (opsional / aturan platform)
     * @param durationDays durasi bounty dalam hari (ex: 14 hari)
     * @param lowPct persentase reward untuk Low severity (0-100)
     * @param mediumPct persentase reward untuk Medium severity (0-100)
     * @param highPct persentase reward untuk High severity (0-100)
     *
     * Contoh: low=10, medium=20, high=30 (total 60%, sisanya bisa direfund ke company)
     */
    function createBounty(
        uint256 lockAmount,
        uint256 depositAmount,
        uint32 durationDays,
        uint8 lowPct,
        uint8 mediumPct,
        uint8 highPct
    ) external returns (uint256) {
        require(lockAmount > 0, "Lock amount 0");
        require(durationDays > 0, "Duration 0");

        // Pastikan perusahaan punya minimal saldo tertentu (di wallet mereka)
        require(
            usdcrime.balanceOf(msg.sender) >= MIN_COMPANY_BALANCE,
            "Not enough USDCRIME balance"
        );

        // Persentase tidak wajib 100%, tapi total tidak boleh > 100
        uint256 totalPct = uint256(lowPct) +
            uint256(mediumPct) +
            uint256(highPct);
        require(totalPct <= 100, "Total percentage > 100");

        // Transfer dana dari company ke kontrak
        uint256 totalTransfer = lockAmount + depositAmount;
        require(
            usdcrime.transferFrom(msg.sender, address(this), totalTransfer),
            "USDCRIME transfer failed"
        );

        // Buat bounty baru
        uint256 bountyId = ++bountyCount;
        uint64 deadline = uint64(
            block.timestamp + uint256(durationDays) * 1 days
        );

        bounties[bountyId] = Bounty({
            company: msg.sender,
            lockedAmount: lockAmount,
            depositAmount: depositAmount,
            deadline: deadline,
            active: true,
            evaluated: false,
            vaultOpened: false,
            hunterWinner: address(0),
            resultSeverity: Severity.None,
            lowPct: lowPct,
            mediumPct: mediumPct,
            highPct: highPct
        });

        emit BountyCreated(
            bountyId,
            msg.sender,
            lockAmount,
            depositAmount,
            lowPct,
            mediumPct,
            highPct,
            deadline
        );

        return bountyId;
    }

    /**
     * @notice Hunter join bounty (untuk log saja, tidak mengunci apa-apa di kontrak)
     */
    function joinBounty(uint256 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(b.active, "Bounty not active");
        require(block.timestamp <= b.deadline, "Bounty expired");

        emit HunterJoined(bountyId, msg.sender);
    }

    /**
     * @notice Evaluasi bounty dan tentukan pemenang + severity
     * @dev Untuk contoh ini, hanya owner (platform) yang boleh menilai.
     *      Bisa kamu modif nanti jadi role-based evaluator.
     */
    function evaluateBounty(
        uint256 bountyId,
        address hunterWinner,
        Severity severity
    ) external onlyOwner {
        Bounty storage b = bounties[bountyId];
        require(b.active, "Bounty not active");
        require(!b.evaluated, "Already evaluated");
        require(hunterWinner != address(0), "Winner zero");
        require(severity != Severity.None, "Invalid severity");

        b.evaluated = true;
        b.hunterWinner = hunterWinner;
        b.resultSeverity = severity;

        emit BountyEvaluated(bountyId, hunterWinner, severity);
    }

    // =========================
    // ======== MULTISIG =======
    // =========================

    /**
     * @notice Approver menyetujui pembukaan vault untuk bounty tertentu.
     *         Jika jumlah approval >= requiredApprovals → vault otomatis terbuka.
     */
    function approveVault(uint256 bountyId) external onlyApprover {
        Bounty storage b = bounties[bountyId];

        require(b.evaluated, "Not evaluated");
        require(!b.vaultOpened, "Vault already opened");

        require(!hasApproved[bountyId][msg.sender], "Already approved");
        hasApproved[bountyId][msg.sender] = true;

        approvalCount[bountyId] += 1;
        emit VaultApproved(bountyId, msg.sender);

        if (approvalCount[bountyId] >= requiredApprovals) {
            _openVault(bountyId);
        }
    }

    /**
     * @dev Internal: menghitung reward dan mengirim token ke hunter & company
     */
    function _openVault(uint256 bountyId) internal {
        Bounty storage b = bounties[bountyId];

        require(!b.vaultOpened, "Vault opened");
        require(b.evaluated, "Not evaluated");

        uint256 reward = _calcReward(b.lockedAmount, b.resultSeverity, b);
        require(reward > 0, "Reward 0");
        require(b.lockedAmount >= reward, "Locked < reward");

        b.vaultOpened = true;
        b.active = false;

        // kirim reward ke hunter
        require(
            usdcrime.transfer(b.hunterWinner, reward),
            "Reward transfer failed"
        );

        // sisa dana (locked + deposit - reward) direfund ke company
        uint256 totalPool = b.lockedAmount + b.depositAmount;
        uint256 refund = 0;
        if (totalPool > reward) {
            refund = totalPool - reward;
            require(
                usdcrime.transfer(b.company, refund),
                "Refund transfer failed"
            );
        }

        emit VaultOpened(bountyId, reward, b.hunterWinner, refund);
    }

    /**
     * @dev hitung reward berdasarkan severity dan persentase per bounty
     */
    function _calcReward(
        uint256 lockedAmount,
        Severity severity,
        Bounty storage b
    ) internal view returns (uint256) {
        if (severity == Severity.Low) {
            return (lockedAmount * b.lowPct) / 100;
        } else if (severity == Severity.Medium) {
            return (lockedAmount * b.mediumPct) / 100;
        } else if (severity == Severity.High) {
            return (lockedAmount * b.highPct) / 100;
        }
        return 0;
    }

    // =========================
    // ====== EXTRA HELPERS ====
    // =========================

    function getApprovers() external view returns (address[] memory) {
        return approvers;
    }

    /**
     * @notice Company bisa menarik kembali dana jika bounty kadaluarsa,
     *         belum dievaluasi, dan belum ada vault opened.
     */
    function refundExpiredBounty(uint256 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(
            msg.sender == b.company || msg.sender == owner,
            "Not authorized"
        );
        require(b.active, "Not active");
        require(!b.evaluated, "Already evaluated");
        require(block.timestamp > b.deadline, "Not expired");

        b.active = false;

        uint256 totalPool = b.lockedAmount + b.depositAmount;
        require(
            usdcrime.transfer(b.company, totalPool),
            "Refund transfer failed"
        );
    }

    /**
     * @notice Ganti owner (opsional untuk maintenance platform)
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero owner");
        owner = newOwner;
    }
}
