export const peoplebountyAbi = [


	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "caseId",
				"type": "uint256"
			}
		],
		"name": "approveVault",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "usdcrimeAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "stableAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_platformWallet",
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
				"name": "caseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "authority",
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
				"internalType": "uint64",
				"name": "deadline",
				"type": "uint64"
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
			}
		],
		"name": "CaseCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "caseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "reporter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum ProofOfCrimeBounty.Severity",
				"name": "severity",
				"type": "uint8"
			}
		],
		"name": "CaseEvaluated",
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
			}
		],
		"name": "createCase",
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
				"name": "caseId",
				"type": "uint256"
			},
			{
				"internalType": "enum ProofOfCrimeBounty.Severity",
				"name": "severity",
				"type": "uint8"
			}
		],
		"name": "evaluateCase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "caseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "reporter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "evidenceUri",
				"type": "string"
			}
		],
		"name": "EvidenceSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "caseId",
				"type": "uint256"
			}
		],
		"name": "refundExpiredCase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "caseId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "evidenceUri",
				"type": "string"
			}
		],
		"name": "submitEvidence",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "caseId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "VaultApproved",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "caseId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rewardAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "platformFee",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "reporter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refundToAuthority",
				"type": "uint256"
			}
		],
		"name": "VaultOpened",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "approvalCount",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "approvers",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "caseCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cases",
		"outputs": [
			{
				"internalType": "address",
				"name": "authority",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "lockedAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "depositAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint64",
				"name": "deadline",
				"type": "uint64"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "evaluated",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "vaultOpened",
				"type": "bool"
			},
			{
				"internalType": "address",
				"name": "reporter",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "evidenceUri",
				"type": "string"
			},
			{
				"internalType": "enum ProofOfCrimeBounty.Severity",
				"name": "resultSeverity",
				"type": "uint8"
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
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DECIMALS",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getApprovers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasApproved",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isApprover",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_AUTHORITY_BALANCE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MIN_REPORTER_STABLE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "PLATFORM_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformWallet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "requiredApprovals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stableToken",
		"outputs": [
			{
				"internalType": "contract IStableToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "usdcrime",
		"outputs": [
			{
				"internalType": "contract IUSDCRIME",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}


] as const