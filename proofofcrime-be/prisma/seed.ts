import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Create companies
    const company1 = await prisma.company.upsert({
        where: { name: 'DeFi Protocol Inc' },
        update: {},
        create: {
            name: 'DeFi Protocol Inc',
            logo: 'https://via.placeholder.com/150',
            website: 'https://defiprotocol.example.com',
            dappUrl: 'https://app.defiprotocol.example.com',
            github: 'https://github.com/defiprotocol',
            documentation: 'https://docs.defiprotocol.example.com',
            discord: 'https://discord.gg/defiprotocol',
            telegram: 'https://t.me/defiprotocol',
            description: 'Leading DeFi lending and borrowing protocol',
        },
    })

    const company2 = await prisma.company.upsert({
        where: { name: 'NFT Marketplace DAO' },
        update: {},
        create: {
            name: 'NFT Marketplace DAO',
            logo: 'https://via.placeholder.com/150',
            website: 'https://nftmarket.example.com',
            dappUrl: 'https://app.nftmarket.example.com',
            github: 'https://github.com/nftmarket',
            description: 'Decentralized NFT marketplace for creators',
        },
    })

    const company3 = await prisma.company.upsert({
        where: { name: 'Web3 Security Labs' },
        update: {},
        create: {
            name: 'Web3 Security Labs',
            logo: 'https://via.placeholder.com/150',
            website: 'https://web3security.example.com',
            description: 'Security auditing and bug bounty platform',
        },
    })

    console.log('✅ Companies created')

    // Create test users
    const user1 = await prisma.user.upsert({
        where: { walletAddress: '0x742d35cc6634c0532925a3b844bc9e7595f0beb0' },
        update: {},
        create: {
            walletAddress: '0x742d35cc6634c0532925a3b844bc9e7595f0beb0',
            name: 'Alice SecResearcher',
            email: 'alice@example.com',
            role: 'INVESTIGATOR',
            reputation: 95,
        },
    })

    const user2 = await prisma.user.upsert({
        where: { walletAddress: '0x1234567890abcdef1234567890abcdef12345678' },
        update: {},
        create: {
            walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
            name: 'Bob Bounty Hunter',
            email: 'bob@example.com',
            role: 'USER',
            reputation: 78,
        },
    })

    const user3 = await prisma.user.upsert({
        where: { walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' },
        update: {},
        create: {
            walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            name: 'Charlie Auditor',
            email: 'charlie@example.com',
            role: 'INVESTIGATOR',
            reputation: 85,
        },
    })

    console.log('✅ Users created')

    // Create bounties
    const bounty1 = await prisma.bounty.create({
        data: {
            bountyId: 'SC-0001',
            title: 'Critical Smart Contract Audit - DeFi Lending Pool',
            description:
                'We need security researchers to audit our DeFi lending protocol. Focus on reentrancy attacks, oracle manipulation, and liquidation logic vulnerabilities.',
            category: 'SMART_CONTRACT_AUDIT',
            companyId: company1.id,
            totalReward: 50000,
            rewardToken: 'USDC',
            severity: 'CRITICAL',
            status: 'ACTIVE',
            deadline: new Date('2025-12-31'),
            scope: 'LendingPool.sol, InterestRateModel.sol, Liquidator.sol',
            inScope: [
                'Reentrancy vulnerabilities',
                'Oracle manipulation attacks',
                'Liquidation logic flaws',
                'Access control issues',
            ],
            outOfScope: [
                'Gas optimization issues',
                'Frontend vulnerabilities',
                'Known issues in dependencies',
            ],
            techStack: ['Solidity 0.8.19', 'Hardhat', 'OpenZeppelin', 'Chainlink Oracles'],
            securityFocus: 'Focus on high-severity vulnerabilities that could lead to fund loss',
            rewardBreakdown: {
                create: [
                    { severity: 'CRITICAL', amount: 20000, description: 'Critical vulnerabilities' },
                    { severity: 'HIGH', amount: 10000, description: 'High severity findings' },
                    { severity: 'MEDIUM', amount: 5000, description: 'Medium severity issues' },
                    { severity: 'LOW', amount: 1000, description: 'Low severity findings' },
                ],
            },
            rules: {
                create: [
                    {
                        ruleNumber: 1,
                        ruleText: 'Only submit original findings not publicly disclosed',
                    },
                    {
                        ruleNumber: 2,
                        ruleText: 'Provide detailed proof of concept with reproduction steps',
                    },
                    {
                        ruleNumber: 3,
                        ruleText: 'Do not exploit vulnerabilities beyond proof of concept',
                    },
                    {
                        ruleNumber: 4,
                        ruleText: 'Follow responsible disclosure guidelines',
                    },
                    {
                        ruleNumber: 5,
                        ruleText: 'Duplicates will be rewarded on first-come-first-served basis',
                    },
                ],
            },
        },
    })

    const bounty2 = await prisma.bounty.create({
        data: {
            bountyId: 'WEB3-0001',
            title: 'NFT Marketplace Web3 Security Audit',
            description:
                'Looking for security researchers to find vulnerabilities in our NFT marketplace dApp. Focus on wallet integration, smart contract interactions, and frontend security.',
            category: 'WEB3_WEBSITE_HACKING',
            companyId: company2.id,
            totalReward: 30000,
            rewardToken: 'USDC',
            severity: 'HIGH',
            status: 'ACTIVE',
            deadline: new Date('2025-11-30'),
            scope: 'Web3 dApp, Wallet integration, NFT minting flow',
            inScope: [
                'Wallet connection vulnerabilities',
                'Smart contract interaction flaws',
                'XSS and CSRF attacks',
                'Transaction manipulation',
            ],
            outOfScope: ['Backend API vulnerabilities', 'Database issues', 'DDoS attacks'],
            techStack: ['Next.js', 'Web3.js', 'MetaMask', 'WalletConnect', 'IPFS'],
            securityFocus: 'Web3-specific vulnerabilities and wallet security',
            rewardBreakdown: {
                create: [
                    { severity: 'CRITICAL', amount: 15000, description: 'Critical web3 vulnerabilities' },
                    { severity: 'HIGH', amount: 7500, description: 'High severity findings' },
                    { severity: 'MEDIUM', amount: 3000, description: 'Medium severity issues' },
                    { severity: 'LOW', amount: 500, description: 'Low severity findings' },
                ],
            },
            rules: {
                create: [
                    { ruleNumber: 1, ruleText: 'Test only on testnet, not mainnet' },
                    { ruleNumber: 2, ruleText: 'Provide video proof of concept' },
                    { ruleNumber: 3, ruleText: 'Do not steal user funds or NFTs' },
                    { ruleNumber: 4, ruleText: 'Report findings within 24 hours of discovery' },
                ],
            },
        },
    })

    const bounty3 = await prisma.bounty.create({
        data: {
            bountyId: 'PEOPLE-0001',
            title: 'Wanted: CryptoScammer - Multi-Chain Rugpull Suspect',
            description:
                'Offering bounty for information leading to the identification of a serial scammer responsible for multiple rugpulls across Ethereum and BSC. Total victim losses exceed $500,000.',
            category: 'PEOPLE_BOUNTY',
            companyId: company3.id,
            totalReward: 25000,
            rewardToken: 'USDC',
            severity: 'CRITICAL',
            status: 'ACTIVE',
            deadline: new Date('2026-03-31'),
            scope: 'Identity verification, location tracking, asset recovery',
            inScope: [
                'Real identity of scammer',
                'Physical location',
                'Connected wallet addresses',
                'Social media profiles',
            ],
            outOfScope: ['Illegal hacking methods', 'Physical confrontation'],
            techStack: ['Blockchain Analytics', 'OSINT', 'Chainalysis'],
            securityFocus: 'Legal methods only, coordinate with law enforcement',
            rewardBreakdown: {
                create: [
                    {
                        severity: 'CRITICAL',
                        amount: 15000,
                        description: 'Full identity with location leading to arrest',
                    },
                    { severity: 'HIGH', amount: 7000, description: 'Verified identity information' },
                    {
                        severity: 'MEDIUM',
                        amount: 3000,
                        description: 'Connected wallets and social profiles',
                    },
                ],
            },
            rules: {
                create: [
                    { ruleNumber: 1, ruleText: 'Use only legal investigation methods' },
                    { ruleNumber: 2, ruleText: 'Verify all information before submission' },
                    { ruleNumber: 3, ruleText: 'Coordinate with law enforcement when appropriate' },
                    { ruleNumber: 4, ruleText: 'Protect victim privacy' },
                ],
            },
        },
    })

    console.log('✅ Bounties created')

    // Add participants to bounties
    await prisma.bountyParticipant.create({
        data: { bountyId: bounty1.id, userId: user1.id },
    })
    await prisma.bountyParticipant.create({
        data: { bountyId: bounty1.id, userId: user2.id },
    })
    await prisma.bountyParticipant.create({
        data: { bountyId: bounty2.id, userId: user1.id },
    })
    await prisma.bountyParticipant.create({
        data: { bountyId: bounty3.id, userId: user3.id },
    })

    console.log('✅ Bounty participants added')

    // Create cases
    const case1 = await prisma.case.create({
        data: {
            caseTitle: 'Suspicious DEX Rugpull - $2.5M Stolen',
            reportCategory: 'PEOPLE_BOUNTY',
            crimeType: 'RUGPULL',
            blockchain: 'ETHEREUM',
            suspectWallet: '0x9876543210fedcba9876543210fedcba98765432',
            estimatedLoss: 2500000,
            numVictims: 250,
            description:
                'A new DEX token launched with high APY promises. After 48 hours and $2.5M in liquidity, developers removed all funds via hidden backdoor function.',
            transactionHashes:
                '0xabc123def456..., 0x789ghi012jkl..., 0x345mno678pqr...',
            status: 'VERIFIED',
            submitterId: user1.id,
            submitterName: 'Alice SecResearcher',
            submitterEmail: 'alice@example.com',
            suspectName: 'Unknown (Alias: DeFiWizard)',
            verifiedAt: new Date(),
            verifiedBy: 'Admin',
        },
    })

    const case2 = await prisma.case.create({
        data: {
            caseTitle: 'NFT Phishing Attack on OpenSea Users',
            reportCategory: 'PEOPLE_BOUNTY',
            crimeType: 'PHISHING',
            blockchain: 'ETHEREUM',
            suspectWallet: '0x1111222233334444555566667777888899990000',
            estimatedLoss: 150000,
            numVictims: 45,
            description:
                'Fake OpenSea website sent malicious signature requests to users, draining NFTs worth $150K. Attack lasted 3 days before detection.',
            transactionHashes: '0xphish001..., 0xphish002..., 0xphish003...',
            status: 'UNDER_REVIEW',
            submitterId: user2.id,
            submitterName: 'Bob Bounty Hunter',
            submitterEmail: 'bob@example.com',
        },
    })

    const case3 = await prisma.case.create({
        data: {
            caseTitle: 'Smart Contract Reentrancy Vulnerability - Uniswap Fork',
            reportCategory: 'SMART_CONTRACT_AUDIT',
            crimeType: 'SMART_CONTRACT_EXPLOIT',
            blockchain: 'BSC',
            contractAddress: '0xaabbccddeeaabbccddeeaabbccddeeaabbccddee',
            vulnerabilityType: 'Reentrancy',
            severity: 'CRITICAL',
            estimatedLoss: 800000,
            description:
                'Critical reentrancy vulnerability found in liquidity removal function of Uniswap V2 fork on BSC. Allows attacker to drain pools.',
            contractSource: 'contract LiquidityPool { ... reentrancy here ... }',
            status: 'VERIFIED',
            submitterId: user3.id,
            submitterName: 'Charlie Auditor',
            submitterEmail: 'charlie@example.com',
            verifiedAt: new Date(),
        },
    })

    console.log('✅ Cases created')

    // Create submissions
    await prisma.bountySubmission.create({
        data: {
            bountyId: bounty1.id,
            userId: user1.id,
            title: 'Reentrancy Vulnerability in withdraw() Function',
            description:
                'Found critical reentrancy vulnerability in the withdraw function that allows draining the entire pool',
            severity: 'CRITICAL',
            vulnerabilityType: 'Reentrancy Attack',
            pocDescription:
                'The withdraw function updates balance after external call, allowing recursive withdrawals',
            pocSteps: [
                'Deploy malicious contract with fallback function',
                'Call withdraw() from malicious contract',
                'Fallback function recursively calls withdraw()',
                'Drain entire pool balance',
            ],
            pocVideoUrl: 'https://example.com/poc-video-1.mp4',
            status: 'ACCEPTED',
            reviewedAt: new Date(),
            reviewedBy: company1.id,
            reviewNotes: 'Excellent finding, critical vulnerability confirmed',
            rewardAmount: 20000,
            rewardPaid: true,
            paidAt: new Date(),
        },
    })

    await prisma.bountySubmission.create({
        data: {
            bountyId: bounty2.id,
            userId: user1.id,
            title: 'Wallet Connection Signature Manipulation',
            description:
                'Users can be tricked into signing malicious transactions during wallet connection',
            severity: 'HIGH',
            vulnerabilityType: 'Transaction Manipulation',
            pocDescription: 'Wallet connect flow does not verify transaction contents before signing',
            pocSteps: [
                'User clicks connect wallet',
                'Malicious signature request is hidden in UI',
                'User signs thinking it is wallet connection',
                'Funds are transferred to attacker',
            ],
            status: 'UNDER_REVIEW',
            reviewedAt: new Date(),
            reviewedBy: company2.id,
        },
    })

    console.log('✅ Submissions created')

    // Create statistics
    await prisma.statistics.upsert({
        where: { date: new Date('2025-11-29') },
        update: {},
        create: {
            date: new Date('2025-11-29'),
            totalCases: 3,
            totalBounties: 3,
            totalRewardsDistributed: 20000,
            totalUsers: 3,
            activeBounties: 3,
        },
    })

    console.log('✅ Statistics created')

    console.log('🎉 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
