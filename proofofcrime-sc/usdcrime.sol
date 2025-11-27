// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract USDCRIME {
    // ===== Token Metadata =====
    string public constant name = "USDCRIME";
    string public constant symbol = "USDCRIME";
    uint8 public constant decimals = 6;

    // ===== Supply Config =====
    uint256 public constant MAX_SUPPLY = 1_000_000 * (10 ** 6); // 1,000,000 with 6 decimals
    uint256 public constant FAUCET_AMOUNT = 1_000 * (10 ** 6);   // 1,000 per faucet claim

    uint256 private _totalSupply;

    // ===== Mappings =====
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    // ===== Events (ERC-20 standard) =====
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // ===== ERC-20 View Functions =====

    /// @notice Total token in circulation
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /// @notice Balance of a given address
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    /// @notice Allowance from owner to spender
    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    // ===== ERC-20 Core Functions =====

    /// @notice Transfer tokens to another address
    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    /// @notice Approve spender to use your tokens
    function approve(address spender, uint256 amount) external returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /// @notice Spender moves tokens from `from` to `to` using allowance
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "USDCRIME: transfer amount exceeds allowance");

        _approve(from, msg.sender, currentAllowance - amount);
        _transfer(from, to, amount);
        return true;
    }

    // ===== Faucet Mint Function =====

    /// @notice Claim faucet: mints 1000 USDCRIME to caller until MAX_SUPPLY is reached
    function claimFaucet() external returns (bool) {
        require(
            _totalSupply + FAUCET_AMOUNT <= MAX_SUPPLY,
            "USDCRIME: faucet empty, max supply reached"
        );

        _mint(msg.sender, FAUCET_AMOUNT);
        return true;
    }

    // ===== Internal Helpers =====

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "USDCRIME: transfer from the zero address");
        require(to != address(0), "USDCRIME: transfer to the zero address");
        require(_balances[from] >= amount, "USDCRIME: transfer amount exceeds balance");

        _balances[from] -= amount;
        _balances[to] += amount;

        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "USDCRIME: mint to the zero address");

        _totalSupply += amount;
        _balances[to] += amount;

        emit Transfer(address(0), to, amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "USDCRIME: approve from the zero address");
        require(spender != address(0), "USDCRIME: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}
