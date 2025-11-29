"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Shield, FileText, Sparkles, Coins, Code, Globe, Users, X, Plus, Lock } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { usdcrimeAbi } from "@/app/abi/usdcrimeAbi"
import { smartcontractbountyAbi } from "@/app/abi/smartcontractbountyAbi"
import { useEffect } from "react"
import { liskSepolia } from "@/config"
import { parseUnits, formatUnits } from "viem"

type BountyCategory = "smart-contract" | "web3-security" | "people-bounty"

export default function SubmitCasePage() {
  const [activeTab, setActiveTab] = useState<BountyCategory>("smart-contract")
  
  // Common fields
  const [bountyTitle, setBountyTitle] = useState("")
  const [description, setDescription] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  
  // Bounty creation fields (all tabs)
  const [lockAmount, setLockAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [durationDays, setDurationDays] = useState("")
  const [lowPct, setLowPct] = useState("")
  const [mediumPct, setMediumPct] = useState("")
  const [highPct, setHighPct] = useState("")
  
  // Approvers configuration
  const [approvers, setApprovers] = useState<string[]>([""])
  const [requiredApprovals, setRequiredApprovals] = useState("")
  
  // Web3 Security specific
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [dappUrl, setDappUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [targetScope, setTargetScope] = useState("")
  
  // People Bounty specific (scammer/criminal info)
  const [suspectInfo, setSuspectInfo] = useState("")
  const [suspectWallet, setSuspectWallet] = useState("")
  const [crimeType, setCrimeType] = useState("")
  const [blockchain, setBlockchain] = useState("")
  const [estimatedLoss, setEstimatedLoss] = useState("")
  const [knownVictims, setKnownVictims] = useState("")
  const [evidenceLinks, setEvidenceLinks] = useState("")

  // Contract addresses
  const USDCRIME_CONTRACT_ADDRESS = "0x7898de8bB562B6e31C7A10FA3AE84AB036B1e9Cd" as `0x${string}`
  const BOUNTY_CONTRACT_ADDRESS = "0xF439FbFC5a1BF5B70D87E6680b83F2328cF69279" as `0x${string}`
  
  const { address, isConnected } = useAccount()
  
  // Read USDCRIME balance
  const { data: usdcrimeBalance } = useReadContract({
    address: USDCRIME_CONTRACT_ADDRESS,
    abi: usdcrimeAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  const currentBalance = usdcrimeBalance ? Number(formatUnits(usdcrimeBalance as bigint, 6)) : 0
  const hasMinimumBalance = currentBalance >= 100
  
  // Faucet claim
  const { data: faucetHash, writeContract: writeFaucet, isPending: isFaucetPending, error: faucetError } = useWriteContract()
  const { isLoading: isFaucetConfirming, isSuccess: isFaucetSuccess } = useWaitForTransactionReceipt({
    hash: faucetHash,
  })
  
  // Approval transaction
  const { 
    data: approvalHash, 
    writeContract: writeApproval, 
    isPending: isApprovalPending,
    error: approvalError 
  } = useWriteContract()
  
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  // Create bounty transaction
  const { 
    data: bountyHash, 
    writeContract: writeBounty, 
    isPending: isBountyPending,
    error: bountyError 
  } = useWriteContract()
  
  const { isLoading: isBountyConfirming, isSuccess: isBountySuccess } = useWaitForTransactionReceipt({
    hash: bountyHash,
  })

  // Faucet handlers
  useEffect(() => {
    if (isFaucetSuccess) {
      alert('Successfully claimed 1000 USDCRIME tokens!')
    }
  }, [isFaucetSuccess])

  useEffect(() => {
    if (faucetError) {
      console.error('Faucet claim error:', faucetError)
      const message = faucetError.message || 'Unknown error'
      if (message.includes('User rejected') || message.includes('denied')) {
        alert('Transaction rejected by user')
      } else if (message.includes('network') || message.includes('chain')) {
        alert('Please make sure you are connected to Lisk Sepolia network')
      } else {
        alert('Failed to claim faucet: ' + message)
      }
    }
  }, [faucetError])

  const handleClaimFaucet = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    try {
      writeFaucet({
        address: USDCRIME_CONTRACT_ADDRESS,
        abi: usdcrimeAbi,
        functionName: 'claimFaucet',
        chainId: liskSepolia.id,
      })
    } catch (err) {
      console.error('Error initiating claim:', err)
    }
  }

  const isClaimingFaucet = isFaucetPending || isFaucetConfirming

  // Bounty creation handlers
  useEffect(() => {
    if (isApprovalSuccess && !isBountySuccess) {
      handleCreateBounty()
    }
  }, [isApprovalSuccess])

  useEffect(() => {
    const submitBountyToAPI = async () => {
      if (!isBountySuccess || !bountyHash) return
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://proof-of-crime-dogq.onrender.com'
        
        // Calculate deadline date
        const deadlineDate = new Date()
        deadlineDate.setDate(deadlineDate.getDate() + parseInt(durationDays || '30'))
        
        // Determine category
        const categoryValue = activeTab === "smart-contract" ? "SMART_CONTRACT_AUDIT" : 
                        activeTab === "web3-security" ? "WEB3_WEBSITE_HACKING" : "PEOPLE_BOUNTY"
        
        // Generate unique bountyId
        const prefix = activeTab === "smart-contract" ? "SC" : 
                      activeTab === "web3-security" ? "WEB3" : "PEOPLE"
        const uniqueId = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
        const bountyId = `${prefix}-${uniqueId}-${Date.now().toString().slice(-4)}`

        // 1. Get or Create Company
        let companyId = ""
        try {
          // Try to get existing companies
          const companiesRes = await fetch(`${apiUrl}/api/companies`)
          if (companiesRes.ok) {
            const companies = await companiesRes.json()
            if (companies.length > 0) {
              // Use the first available company for now
              companyId = companies[0].id
            }
          }

          // If no company found, create one
          if (!companyId) {
            const newCompanyRes = await fetch(`${apiUrl}/api/companies`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: address ? `Company ${address.slice(0, 6)}` : "Anonymous Company",
                description: "Auto-generated company for bounty submission"
              })
            })
            if (newCompanyRes.ok) {
              const newCompany = await newCompanyRes.json()
              companyId = newCompany.id
            }
          }
        } catch (err) {
          console.error("Error handling company:", err)
          // Fallback ID if everything fails (this might fail on backend if ID doesn't exist)
          // We'll hope the fetch/create worked. If not, the POST /bounties will likely fail with 500.
        }
        
        // Prepare bounty data matching backend API structure
        const bountyData = {
          // Required fields
          bountyId: bountyId,
          title: bountyTitle || "Untitled Bounty",
          description: description || "No description provided",
          category: categoryValue,
          companyId: companyId, // Required by backend
          totalReward: parseFloat(lockAmount) || 0,
          severity: "HIGH", // Default to HIGH as backend requires enum
          deadline: deadlineDate.toISOString(),
          
          // Optional fields
          rewardToken: "USDCRIME",
          scope: activeTab === "smart-contract" ? "Smart Contract Audit" :
                 activeTab === "web3-security" ? (targetScope || "Web3 Security Audit") : 
                 "People Bounty",
          inScope: targetScope ? targetScope.split(',').map(s => s.trim()).filter(Boolean) : ["General security audit"],
          outOfScope: ["Frontend vulnerabilities", "Off-chain infrastructure"],
          techStack: activeTab === "web3-security" ? ["React", "Web3.js", "Solidity"] : ["Solidity"],
          securityFocus: description || "Comprehensive security assessment",
        }
        
        console.log('Submitting bounty to API:', bountyData)
        
        const response = await fetch(`${apiUrl}/api/bounties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bountyData),
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error Response:', errorText)
          throw new Error(`API Error: ${response.status} - ${errorText}`)
        }
        
        const result = await response.json()
        console.log('Bounty submitted to API successfully:', result)
        
        alert(`Bounty created successfully!\nTransaction: ${bountyHash}\nYou can now view it on the Smart Contract Audit page.`)
      } catch (error) {
        console.error('Error submitting to API:', error)
        alert(`Bounty created on blockchain but failed to save to database.\nTransaction: ${bountyHash}\nPlease contact support.`)
      }
      
      // Reset form fields
      setBountyTitle("")
      setDescription("")
      setLockAmount("")
      setDepositAmount("")
      setDurationDays("")
      setLowPct("")
      setMediumPct("")
      setHighPct("")
      setApprovers([""])
      setRequiredApprovals("")
      setWebsiteUrl("")
      setDappUrl("")
      setGithubUrl("")
      setTargetScope("")
      setSuspectInfo("")
      setSuspectWallet("")
      setCrimeType("")
      setBlockchain("")
      setEstimatedLoss("")
      setKnownVictims("")
      setEvidenceLinks("")
      setConfirmed(false)
    }
    
    submitBountyToAPI()
  }, [isBountySuccess, bountyHash])

  useEffect(() => {
    if (approvalError) {
      console.error('Approval error:', approvalError)
      alert('Failed to approve USDCRIME: ' + approvalError.message)
    }
  }, [approvalError])

  useEffect(() => {
    if (bountyError) {
      console.error('Bounty creation error:', bountyError)
      alert('Failed to create bounty: ' + bountyError.message)
    }
  }, [bountyError])

  const handleAutofill = () => {
    if (activeTab === "smart-contract") {
      setBountyTitle("Critical Smart Contract Audit - DeFi Protocol")
      setDescription("We need security researchers to audit our DeFi lending protocol smart contract. The contract handles user deposits, lending, and liquidations. We're offering rewards based on severity of findings.")
      setLockAmount("10000")
      setDepositAmount("5000")
      setDurationDays("30")
      setLowPct("10")
      setMediumPct("25")
      setHighPct("50")
      setApprovers([
        "0xfeff727205fe524a3a8a16c404fec9cfe4124acd",
        "0xF776fFbFD7AA96CF878a133d744c70ee83270026",
        "0xE4a05518Cf22aE1226C8c4B0aC669E2cd50c48f3"
      ])
      setRequiredApprovals("2")
      setConfirmed(true)
    } else if (activeTab === "web3-security") {
      setBountyTitle("Web3 DApp Security Audit Bounty")
      setDescription("Looking for security researchers to find vulnerabilities in our Web3 application. Focus on wallet integration, smart contract interactions, and frontend security.")
      setWebsiteUrl("https://example-defi.com")
      setDappUrl("https://app.example-defi.com")
      setGithubUrl("https://github.com/example/defi-dapp")
      setTargetScope("Wallet connection, Smart contract integration, User authentication, NFT marketplace")
      setLockAmount("15000")
      setDepositAmount("7500")
      setDurationDays("45")
      setLowPct("15")
      setMediumPct("30")
      setHighPct("60")
      setApprovers([
        "0xfeff727205fe524a3a8a16c404fec9cfe4124acd",
        "0xF776fFbFD7AA96CF878a133d744c70ee83270026",
        "0xE4a05518Cf22aE1226C8c4B0aC669E2cd50c48f3"
      ])
      setRequiredApprovals("2")
      setConfirmed(true)
    } else if (activeTab === "people-bounty") {
      setBountyTitle("Wanted: CryptoScammer123 - Rugpull Suspect")
      setDescription("We are offering a bounty for information leading to the identification and location of a serial scammer who has conducted multiple rugpulls. This person has stolen over $500,000 from victims across multiple chains.")
      setSuspectInfo("Known as CryptoScammer123, ScamDev, and RugMaster. Launched 5 tokens in past 6 months, all ended in rugpulls.")
      setSuspectWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0")
      setCrimeType("rugpull")
      setBlockchain("ethereum")
      setEstimatedLoss("500000")
      setKnownVictims("150")
      setEvidenceLinks("https://etherscan.io/tx/0xabc123...\nhttps://twitter.com/victim1/status/...")
      setLockAmount("20000")
      setDepositAmount("10000")
      setDurationDays("60")
      setLowPct("20")
      setMediumPct("40")
      setHighPct("70")
      setApprovers([
        "0xfeff727205fe524a3a8a16c404fec9cfe4124acd",
        "0xF776fFbFD7AA96CF878a133d744c70ee83270026",
        "0xE4a05518Cf22aE1226C8c4B0aC669E2cd50c48f3"
      ])
      setRequiredApprovals("2")
      setConfirmed(true)
    }
  }

  const handleApproveAndCreate = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    if (!hasMinimumBalance) {
      alert('🔒 Sybil Filter: You need at least 100 USDCRIME to create a bounty. Please claim from faucet first.')
      return
    }

    // Validation
    if (!bountyTitle || !description || !lockAmount || !depositAmount || !durationDays || !lowPct || !mediumPct || !highPct) {
      alert('Please fill in all required fields!')
      return
    }

    const validApprovers = approvers.filter(addr => addr.trim() !== "" && addr.startsWith("0x"))
    if (validApprovers.length === 0) {
      alert('Please add at least one approver address!')
      return
    }

    if (!requiredApprovals || parseInt(requiredApprovals) === 0) {
      alert('Please set required approvals!')
      return
    }

    if (parseInt(requiredApprovals) > validApprovers.length) {
      alert('Required approvals cannot be greater than number of approvers!')
      return
    }

    if (!confirmed) {
      alert('Please confirm the terms!')
      return
    }

    const totalPct = parseInt(lowPct) + parseInt(mediumPct) + parseInt(highPct)
    if (totalPct > 100) {
      alert('Total reward percentages cannot exceed 100%!')
      return
    }

    try {
      const lockAmountWei = parseUnits(lockAmount, 6)
      const depositAmountWei = parseUnits(depositAmount, 6)
      const totalAmount = lockAmountWei + depositAmountWei

      writeApproval({
        address: USDCRIME_CONTRACT_ADDRESS,
        abi: usdcrimeAbi,
        functionName: 'approve',
        args: [BOUNTY_CONTRACT_ADDRESS, totalAmount],
        chainId: liskSepolia.id,
      })
    } catch (err) {
      console.error('Error initiating approval:', err)
    }
  }

  const handleCreateBounty = async () => {
    try {
      const lockAmountWei = parseUnits(lockAmount, 6)
      const depositAmountWei = parseUnits(depositAmount, 6)
      const duration = parseInt(durationDays)
      const low = parseInt(lowPct)
      const medium = parseInt(mediumPct)
      const high = parseInt(highPct)

      writeBounty({
        address: BOUNTY_CONTRACT_ADDRESS,
        abi: smartcontractbountyAbi,
        functionName: 'createBounty',
        args: [lockAmountWei, depositAmountWei, duration, low, medium, high],
        chainId: liskSepolia.id,
      })
    } catch (err) {
      console.error('Error creating bounty:', err)
    }
  }

  const isBountyProcessing = isApprovalPending || isApprovalConfirming || isBountyPending || isBountyConfirming

  // Approver management
  const addApprover = () => {
    setApprovers([...approvers, ""])
  }

  const removeApprover = (index: number) => {
    if (approvers.length > 1) {
      setApprovers(approvers.filter((_, i) => i !== index))
    }
  }

  const updateApprover = (index: number, value: string) => {
    const newApprovers = [...approvers]
    newApprovers[index] = value
    setApprovers(newApprovers)
  }

  const tabs = [
    {
      id: "smart-contract" as BountyCategory,
      label: "Smart Contract Bounty",
      icon: Code,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "web3-security" as BountyCategory,
      label: "Web3 Security Bounty",
      icon: Globe,
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: "people-bounty" as BountyCategory,
      label: "Scammer Hunt Bounty",
      icon: Users,
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-mono">BOUNTY CREATION</span>
          </div>
          
          {/* Claim Faucet Button & Balance Display */}
          <div className="mb-6 space-y-3">
            <Button
              onClick={handleClaimFaucet}
              disabled={isClaimingFaucet}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coins className="w-5 h-5 mr-2" />
              {isClaimingFaucet ? 'Claiming...' : 'Claim Faucet (1000 USDCRIME)'}
            </Button>
            
            {isConnected && (
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Your Balance: </span>
                  <span className={`font-bold ${hasMinimumBalance ? 'text-green-500' : 'text-orange-500'}`}>
                    {currentBalance.toFixed(2)} USDCRIME
                  </span>
                </div>
                
                {!hasMinimumBalance && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <Lock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-500 font-semibold">
                      🔒 Sybil Filter: Minimum 100 USDCRIME required to create bounty
                    </span>
                  </div>
                )}
                
                {hasMinimumBalance && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-semibold">
                      ✓ Verified: You can create bounties
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Create a <span className="text-primary neon-text-cyan">Bounty</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Post bounties for security researchers to find vulnerabilities or track down Web3 criminals.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300
                    ${isActive 
                      ? 'border-primary bg-gradient-to-br ' + tab.color + ' bg-opacity-10 shadow-lg shadow-primary/20' 
                      : 'border-border/30 glass hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`
                      p-3 rounded-lg transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-br ' + tab.color + ' text-white shadow-lg' 
                        : 'bg-background/50 text-muted-foreground'
                      }
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`
                      text-sm font-semibold text-center transition-colors
                      ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {tab.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Autofill Button */}
        <div className="mb-8 text-center">
          <Button
            onClick={handleAutofill}
            variant="outline"
            className="px-6 py-3 rounded-lg border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 font-semibold transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Autofill with Demo Data
          </Button>
        </div>

        {/* Alert Box */}
        <Card className="glass border-orange-500/30 mb-8">
          <CardContent className="px-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-500 mb-1">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  {!hasMinimumBalance 
                    ? "🔒 Sybil Filter Active: You need at least 100 USDCRIME in your wallet to create bounties. This prevents spam and ensures serious submissions. Please claim from the faucet above."
                    : "Ensure you have sufficient USDCRIME balance to cover both lock and deposit amounts. Approvers will validate the bounty results before reward distribution."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {activeTab === "smart-contract" && "Smart Contract Security Bounty"}
              {activeTab === "web3-security" && "Web3 Application Security Bounty"}
              {activeTab === "people-bounty" && "Scammer/Criminal Hunt Bounty"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Bounty Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Bounty Title <span className="text-red-500">*</span>
              </label>
              <Input 
                value={bountyTitle}
                onChange={(e) => setBountyTitle(e.target.value)}
                placeholder={
                  activeTab === "smart-contract" ? "e.g., Critical Smart Contract Audit - DeFi Protocol" :
                  activeTab === "web3-security" ? "e.g., Web3 DApp Security Audit Bounty" :
                  "e.g., Wanted: CryptoScammer123 - Rugpull Suspect"
                }
                className="bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Smart Contract Bounty Fields */}
            {activeTab === "smart-contract" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the smart contract audit scope, what you want researchers to focus on, and any important security concerns..."
                    className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>
              </>
            )}

            {/* Web3 Security Bounty Fields */}
            {activeTab === "web3-security" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your Web3 application, what security aspects you want researchers to focus on, and any known concerns..."
                    className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Website URL <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      DApp URL
                    </label>
                    <Input 
                      value={dappUrl}
                      onChange={(e) => setDappUrl(e.target.value)}
                      placeholder="https://app.example.com"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    GitHub Repository (Optional)
                  </label>
                  <Input 
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Target Scope <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    value={targetScope}
                    onChange={(e) => setTargetScope(e.target.value)}
                    placeholder="e.g., Wallet connection, Smart contract integration, User authentication, NFT marketplace, Payment system..."
                    className="min-h-[80px] bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>
              </>
            )}

            {/* People Bounty Fields (Scammer Hunt) */}
            {activeTab === "people-bounty" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Bounty Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe why you're offering this bounty, what information you're seeking, and the impact of the crime..."
                    className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Suspect Information <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    value={suspectInfo}
                    onChange={(e) => setSuspectInfo(e.target.value)}
                    placeholder="Known aliases, social media handles, Telegram usernames, Discord handles, or any identifying information..."
                    className="min-h-[80px] bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Suspect Wallet Address(es) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      value={suspectWallet}
                      onChange={(e) => setSuspectWallet(e.target.value)}
                      placeholder="0x... (comma-separated if multiple)"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Crime Type <span className="text-red-500">*</span>
                    </label>
                    <Select value={crimeType} onValueChange={setCrimeType}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue placeholder="Select crime type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rugpull">Rug Pull</SelectItem>
                        <SelectItem value="pump-dump">Pump & Dump</SelectItem>
                        <SelectItem value="nft-scam">NFT Scam</SelectItem>
                        <SelectItem value="phishing">Phishing</SelectItem>
                        <SelectItem value="wallet-drainer">Wallet Drainer</SelectItem>
                        <SelectItem value="money-laundering">Money Laundering</SelectItem>
                        <SelectItem value="ponzi-scheme">Ponzi Scheme</SelectItem>
                        <SelectItem value="identity-theft">Identity Theft</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Primary Blockchain <span className="text-red-500">*</span>
                    </label>
                    <Select value={blockchain} onValueChange={setBlockchain}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="avalanche">Avalanche</SelectItem>
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                        <SelectItem value="base">Base</SelectItem>
                        <SelectItem value="tron">Tron</SelectItem>
                        <SelectItem value="multiple">Multiple Chains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Estimated Loss (USD)
                    </label>
                    <Input 
                      type="number"
                      value={estimatedLoss}
                      onChange={(e) => setEstimatedLoss(e.target.value)}
                      placeholder="e.g., 500000"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Known Victims Count
                  </label>
                  <Input 
                    type="number"
                    value={knownVictims}
                    onChange={(e) => setKnownVictims(e.target.value)}
                    placeholder="e.g., 150"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Evidence Links
                  </label>
                  <Textarea 
                    value={evidenceLinks}
                    onChange={(e) => setEvidenceLinks(e.target.value)}
                    placeholder="Transaction hashes, Etherscan/Explorer links, Twitter/social media posts, screenshots hosted links (one per line)"
                    className="min-h-[100px] bg-background/50 border-primary/20 focus:border-primary/50 font-mono text-xs"
                  />
                </div>
              </>
            )}

            {/* Common Bounty Fields (Lock, Deposit, Duration, Percentages) */}
            <div className="border-t border-border/30 pt-6">
              <h3 className="text-lg font-semibold mb-4">Bounty Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Lock Amount (USDCRIME) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    value={lockAmount}
                    onChange={(e) => setLockAmount(e.target.value)}
                    placeholder={activeTab === "people-bounty" ? "e.g., 20000" : "e.g., 10000"}
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Total reward pool
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Deposit Amount (USDCRIME) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder={activeTab === "people-bounty" ? "e.g., 10000" : "e.g., 5000"}
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Security deposit (refundable)
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder={activeTab === "people-bounty" ? "e.g., 60" : "e.g., 30"}
                  className="bg-background/50 border-primary/20 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long the bounty will be active
                </p>
              </div>
            </div>

            {/* Reward Percentages */}
            <div className="border-t border-border/30 pt-6">
              <h3 className="text-lg font-semibold mb-4">Reward Percentages by Information Quality</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Low Quality (%) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    value={lowPct}
                    onChange={(e) => setLowPct(e.target.value)}
                    placeholder={activeTab === "people-bounty" ? "e.g., 20" : "e.g., 10"}
                    min="0"
                    max="100"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Medium Quality (%) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    value={mediumPct}
                    onChange={(e) => setMediumPct(e.target.value)}
                    placeholder={activeTab === "people-bounty" ? "e.g., 40" : "e.g., 25"}
                    min="0"
                    max="100"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    High Quality (%) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    value={highPct}
                    onChange={(e) => setHighPct(e.target.value)}
                    placeholder={activeTab === "people-bounty" ? "e.g., 70" : "e.g., 50"}
                    min="0"
                    max="100"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Total: {(parseInt(lowPct || "0") + parseInt(mediumPct || "0") + parseInt(highPct || "0"))}% 
                (Maximum 100%)
              </p>
            </div>

            {/* Approvers Configuration */}
            <div className="border-t border-border/30 pt-6">
              <h3 className="text-lg font-semibold mb-4">Approvers Configuration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set the wallet addresses that will approve the bounty results.
              </p>
              
              <div className="space-y-3">
                {approvers.map((approver, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={approver}
                      onChange={(e) => updateApprover(index, e.target.value)}
                      placeholder="0x..."
                      className="bg-background/50 border-primary/20 focus:border-primary/50 flex-1"
                    />
                    {approvers.length > 1 && (
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeApprover(index)}
                        className="border-red-500/30 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addApprover}
                  className="w-full border-primary/30 hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Approver
                </Button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">
                  Required Approvals <span className="text-red-500">*</span>
                </label>
                <Input 
                  type="number"
                  value={requiredApprovals}
                  onChange={(e) => setRequiredApprovals(e.target.value)}
                  placeholder="e.g., 2"
                  min="1"
                  max={approvers.filter(a => a.trim() !== "").length}
                  className="bg-background/50 border-primary/20 focus:border-primary/50"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Number of approvers needed to validate results (max: {approvers.filter(a => a.trim() !== "").length})
                </p>
              </div>
            </div>

            {/* Confirmation */}
            <div className="flex items-start gap-3 p-4 glass rounded-lg border border-primary/20">
              <input 
                type="checkbox" 
                id="confirm-accuracy"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-primary cursor-pointer"
              />
              <label htmlFor="confirm-accuracy" className="text-sm text-muted-foreground cursor-pointer">
                I confirm that I have sufficient USDCRIME balance and understand that the total amount (lock + deposit) will be transferred to the bounty contract. Approvers will validate the bounty results before reward distribution. <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleApproveAndCreate}
                disabled={isBountyProcessing || !confirmed || !hasMinimumBalance}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Coins className="w-5 h-5 mr-2" />
                {!hasMinimumBalance ? '🔒 Need 100 USDCRIME to Create' :
                 isApprovalPending || isApprovalConfirming ? 'Approving USDCRIME...' :
                 isBountyPending || isBountyConfirming ? 'Creating Bounty...' :
                 'Approve & Create Bounty'}
              </Button>
            </div>

            {/* Transaction Status */}
            {isBountyProcessing && (
              <div className="text-center p-4 glass rounded-lg border border-primary/20">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    {isApprovalPending || isApprovalConfirming ? 'Waiting for USDCRIME approval...' : 'Creating bounty...'}
                  </span>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure & Transparent</h3>
              <p className="text-sm text-muted-foreground">
                All funds are locked in smart contracts on-chain.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Multisig Validation</h3>
              <p className="text-sm text-muted-foreground">
                Approvers validate bounty results before reward distribution.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <Coins className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fair Rewards</h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "people-bounty" 
                  ? "Rewards based on quality of information provided."
                  : "Researchers rewarded based on severity of findings."
                }
              </p>
            </CardContent>
          </Card>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
