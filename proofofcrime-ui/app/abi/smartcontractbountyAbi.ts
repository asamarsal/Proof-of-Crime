export const smartcontractbountyAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "usdcrimeAddress",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "_approvers",
                "type": "address[]"
            },
            {
                "internalType": "uint8",
                "name": "_requiredApprovals",
                "type": "uint8"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "bountyId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "company",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "lockedAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "depositAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "lowPct",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "mediumPct",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "highPct",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "deadline",
                "type": "uint64"
            }
        ],
        "name": "BountyCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "lockAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "depositAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint32",
                "name": "durationDays",
                "type": "uint32"
            },
            {
                "internalType": "uint8",
                "name": "lowPct",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "mediumPct",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "highPct",
                "type": "uint8"
            }
        ],
        "name": "createBounty",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bountyId",
                "type": "uint256"
            }
        ],
        "name": "joinBounty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bountyId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "hunterWinner",
                "type": "address"
            },
            {
                "internalType": "enum SmartContractBounty.Severity",
                "name": "severity",
                "type": "uint8"
            }
        ],
        "name": "evaluateBounty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "bountyId",
                "type": "uint256"
            }
        ],
        "name": "approveVault",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;
