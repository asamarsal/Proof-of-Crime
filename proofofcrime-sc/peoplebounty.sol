// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal interface USDCRIME (ERC20-like, decimals 6)
interface IUSDCRIME {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

/// @notice Minimal interface stablecoin (contoh: USDT) untuk sybil filter pelapor
interface IStableToken {
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title ProofOfCrimeBounty v2
 * @notice Versi refactor agar tidak terkena error "Stack too deep"
 *         Fitur sama persis dengan versi sebelumnya:
 *         - Authority lock bounty pakai USDCRIME
 *         - Pelapor harus punya min 100 stable (USDT) → sybil filter
 *         - Pelapor submit evidence (evidenceUri)
 *         - Owner menilai: Low / Medium / High
 *         - Multisig approver approve vault
 *         - Reward: 5% / 10% / 20% dari lockedAmount
 *         - Fee tetap: 10 USDCRIME ke wallet platform
 *         - Sisa dikembalikan ke authority
 */
contract ProofOfCrimeBounty {
    // =========================
    // ======== TYPES ==========
    // =========================

    enum Severity {
        None,
        Low,
        Medium,
        High
    }

    struct CaseBounty {
        address authority;
        uint256 lockedAmount;
        uint256 depositAmount;
        uint64 deadline;
        bool active;
        bool evaluated;
        bool vaultOpened;
        address reporter;
        string evidenceUri;
        Severity resultSeverity;
        uint8 lowPct;
        uint8 mediumPct;
        uint8 highPct;
    }

    // =========================
    // ======== STORAGE ========
    // =========================

    IUSDCRIME public immutable usdcrime;
    IStableToken public immutable stableToken;

    uint256 public constant DECIMALS = 10 ** 6;

    // Minimal saldo USDCRIME yang harus dimiliki authority (FBI/polisi)
    uint256 public constant MIN_AUTHORITY_BALANCE = 100 * DECIMALS;

    // Minimal stable (USDT) yang harus dimiliki pelapor (sybil filter)
    uint256 public constant MIN_REPORTER_STABLE = 100 * DECIMALS;

    // Fee tetap ke wallet dApps (10 USDCRIME)
    uint256 public constant PLATFORM_FEE = 10 * DECIMALS;

    // Wallet platform Proof of Crime (menerima fee)
    address public immutable platformWallet;

    // Semua case disimpan di 1 kontrak
    uint256 public caseCount;
    mapping(uint256 => CaseBounty) public cases;

    // --- Multisig approver (wallet1, wallet2, wallet3, dll) ---
    address public owner;
    address[] public approvers;
    mapping(address => bool) public isApprover;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(uint256 => uint8) public approvalCount;
    uint8 public immutable requiredApprovals; // misal 2 dari 3

    // =========================
    // ========= EVENTS ========
    // =========================

    event CaseCreated(
        uint256 indexed caseId,
        address indexed authority,
        uint256 lockedAmount,
        uint256 depositAmount,
        uint64 deadline,
        uint8 lowPct,
        uint8 mediumPct,
        uint8 highPct
    );

    event EvidenceSubmitted(
        uint256 indexed caseId,
        address indexed reporter,
        string evidenceUri
    );

    event CaseEvaluated(
        uint256 indexed caseId,
        address indexed reporter,
        Severity severity
    );

    event VaultApproved(uint256 indexed caseId, address indexed approver);

    event VaultOpened(
        uint256 indexed caseId,
        uint256 rewardAmount,
        uint256 platformFee,
        address indexed reporter,
        uint256 refundToAuthority
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
     * @param usdcrimeAddress address token USDCRIME
     * @param stableAddress address token stable (USDT) untuk sybil filter pelapor
     * @param _platformWallet wallet Proof of Crime (penerima fee 10 USDCRIME)
     * @param _approvers list approver untuk multisig vault
     * @param _requiredApprovals jumlah minimal approval untuk open vault
     */
    constructor(
        address usdcrimeAddress,
        address stableAddress,
        address _platformWallet,
        address[] memory _approvers,
        uint8 _requiredApprovals
    ) {
        require(usdcrimeAddress != address(0), "Invalid USDCRIME address");
        require(stableAddress != address(0), "Invalid stable address");
        require(_platformWallet != address(0), "Invalid platform wallet");
        require(_approvers.length > 0, "No approvers");
        require(
            _requiredApprovals > 0 && _requiredApprovals <= _approvers.length,
            "Bad required approvals"
        );

        owner = msg.sender;
        usdcrime = IUSDCRIME(usdcrimeAddress);
        stableToken = IStableToken(stableAddress);
        platformWallet = _platformWallet;
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
     * @notice Authority (FBI/polisi) membuat case + lock bounty.
     * @param lockAmount jumlah USDCRIME yang dikunci sebagai bounty pool
     * @param depositAmount optional deposit/jaminan (boleh 0)
     * @param durationDays durasi case dalam hari (misal 30 hari)
     *
     * Persentase reward default:
     *  - Low: 5%
     *  - Medium: 10%
     *  - High: 20%
     */
    function createCase(
        uint256 lockAmount,
        uint256 depositAmount,
        uint32 durationDays
    ) external returns (uint256) {
        require(lockAmount > 0, "Lock amount 0");
        require(durationDays > 0, "Duration 0");

        // Authority harus punya minimal 100 USDCRIME di wallet
        require(
            usdcrime.balanceOf(msg.sender) >= MIN_AUTHORITY_BALANCE,
            "Not enough USDCRIME balance (authority)"
        );

        // Transfer dana dari authority ke kontrak
        uint256 totalTransfer = lockAmount + depositAmount;
        require(
            usdcrime.transferFrom(msg.sender, address(this), totalTransfer),
            "USDCRIME transfer failed"
        );

        // Buat case baru
        uint256 caseId = ++caseCount;
        uint64 deadline = uint64(
            block.timestamp + uint256(durationDays) * 1 days
        );

        // Assignment field-by-field (menghindari struct literal yang besar)
        CaseBounty storage c = cases[caseId];
        c.authority = msg.sender;
        c.lockedAmount = lockAmount;
        c.depositAmount = depositAmount;
        c.deadline = deadline;
        c.active = true;
        c.evaluated = false;
        c.vaultOpened = false;
        c.reporter = address(0);
        c.evidenceUri = "";
        c.resultSeverity = Severity.None;
        c.lowPct = 5;
        c.mediumPct = 10;
        c.highPct = 20;

        emit CaseCreated(
            caseId,
            msg.sender,
            lockAmount,
            depositAmount,
            deadline,
            5,
            10,
            20
        );

        return caseId;
    }

    /**
     * @notice Pelapor submit bukti (off-chain link/hash) untuk sebuah case.
     *         Harus punya minimal 100 stable (USDT) di wallet (sybil filter).
     *         Versi sederhana: hanya 1 reporter "utama" per case.
     */
    function submitEvidence(
        uint256 caseId,
        string calldata evidenceUri
    ) external {
        CaseBounty storage c = cases[caseId];
        require(c.active, "Case not active");
        require(block.timestamp <= c.deadline, "Case expired");
        require(bytes(evidenceUri).length > 0, "Evidence empty");

        // Sybil filter: pelapor wajib punya 100 stable (misal USDT)
        require(
            stableToken.balanceOf(msg.sender) >= MIN_REPORTER_STABLE,
            "Not enough stable balance (reporter)"
        );

        require(c.reporter == address(0), "Reporter already set");

        c.reporter = msg.sender;
        c.evidenceUri = evidenceUri;

        emit EvidenceSubmitted(caseId, msg.sender, evidenceUri);
    }

    /**
     * @notice Owner platform menilai kualitas info pelapor:
     *         Low / Medium / High.
     */
    function evaluateCase(
        uint256 caseId,
        Severity severity
    ) external onlyOwner {
        CaseBounty storage c = cases[caseId];
        require(c.active, "Case not active");
        require(!c.evaluated, "Already evaluated");
        require(c.reporter != address(0), "No reporter");
        require(severity != Severity.None, "Invalid severity");

        c.evaluated = true;
        c.resultSeverity = severity;

        emit CaseEvaluated(caseId, c.reporter, severity);
    }

    // =========================
    // ======== MULTISIG =======
    // =========================

    /**
     * @notice Approver menyetujui pembukaan vault.
     *         Jika approval >= requiredApprovals → vault otomatis terbuka.
     */
    function approveVault(uint256 caseId) external onlyApprover {
        CaseBounty storage c = cases[caseId];

        require(c.evaluated, "Not evaluated");
        require(!c.vaultOpened, "Vault already opened");

        require(!hasApproved[caseId][msg.sender], "Already approved");
        hasApproved[caseId][msg.sender] = true;

        approvalCount[caseId] += 1;
        emit VaultApproved(caseId, msg.sender);

        if (approvalCount[caseId] >= requiredApprovals) {
            _openVault(caseId);
        }
    }

    /**
     * @dev Internal: hitung reward, fee platform, dan refund authority.
     */
    function _openVault(uint256 caseId) internal {
        CaseBounty storage c = cases[caseId];

        require(!c.vaultOpened, "Vault opened");
        require(c.evaluated, "Not evaluated");

        uint256 reward = _calcReward(c.lockedAmount, c);
        require(reward > 0, "Reward 0");

        uint256 totalPool = c.lockedAmount + c.depositAmount;
        uint256 needed = reward + PLATFORM_FEE;
        require(totalPool >= needed, "Pool < reward + fee");

        c.vaultOpened = true;
        c.active = false;

        // 1) Reward ke pelapor
        require(
            usdcrime.transfer(c.reporter, reward),
            "Reward transfer failed"
        );

        // 2) Fee ke wallet platform
        require(
            usdcrime.transfer(platformWallet, PLATFORM_FEE),
            "Platform fee transfer failed"
        );

        // 3) Refund sisa ke authority
        uint256 refund = totalPool - needed;
        if (refund > 0) {
            require(
                usdcrime.transfer(c.authority, refund),
                "Refund transfer failed"
            );
        }

        emit VaultOpened(caseId, reward, PLATFORM_FEE, c.reporter, refund);
    }

    /**
     * @dev Hitung reward berdasarkan severity & persentase per case.
     */
    function _calcReward(
        uint256 lockedAmount,
        CaseBounty storage c
    ) internal view returns (uint256) {
        Severity sev = c.resultSeverity;
        if (sev == Severity.Low) {
            return (lockedAmount * c.lowPct) / 100;
        } else if (sev == Severity.Medium) {
            return (lockedAmount * c.mediumPct) / 100;
        } else if (sev == Severity.High) {
            return (lockedAmount * c.highPct) / 100;
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
     * @notice Authority atau owner bisa refund case yang expired &
     *         belum dievaluasi dan belum open vault.
     */
    function refundExpiredCase(uint256 caseId) external {
        CaseBounty storage c = cases[caseId];
        require(
            msg.sender == c.authority || msg.sender == owner,
            "Not authorized"
        );
        require(c.active, "Not active");
        require(!c.evaluated, "Already evaluated");
        require(block.timestamp > c.deadline, "Not expired");

        c.active = false;

        uint256 totalPool = c.lockedAmount + c.depositAmount;
        require(
            usdcrime.transfer(c.authority, totalPool),
            "Refund transfer failed"
        );
    }

    /**
     * @notice Ganti owner platform (opsional).
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero owner");
        owner = newOwner;
    }
}
