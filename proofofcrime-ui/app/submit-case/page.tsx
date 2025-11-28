"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, Shield, FileText, Sparkles, Coins, Code, Globe, Users, X, Plus } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { usdcrimeAbi } from "@/app/abi/usdcrimeAbi"
import { smartcontractbountyAbi } from "@/app/abi/smartcontractbountyAbi"
import { useEffect } from "react"
import { liskSepolia } from "@/config"
import { parseUnits, formatUnits } from "viem"

type ReportCategory = "smart-contract" | "web3-hacking" | "people-bounty"

export default function SubmitCasePage() {
  const [activeTab, setActiveTab] = useState<ReportCategory>("smart-contract")
  const [files, setFiles] = useState<File[]>([])
  
  // Common fields
  const [caseTitle, setCaseTitle] = useState("")
  const [description, setDescription] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  
  // Bounty creation fields (Smart Contract & Web3 Hacking)
  const [lockAmount, setLockAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [durationDays, setDurationDays] = useState("")
  const [lowPct, setLowPct] = useState("")
  const [mediumPct, setMediumPct] = useState("")
  const [highPct, setHighPct] = useState("")
  
  // Approvers configuration
  const [approvers, setApprovers] = useState<string[]>([""])
  const [requiredApprovals, setRequiredApprovals] = useState("")
  
  // Web3 Website Hacking specific (for bounty context)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [dappUrl, setDappUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [targetScope, setTargetScope] = useState("")
  
  // People Bounty fields (for reporting scammers)
  const [suspectName, setSuspectName] = useState("")
  const [suspectWallet, setSuspectWallet] = useState("")
  const [crimeType, setCrimeType] = useState("")
  const [blockchain, setBlockchain] = useState("")
  const [estimatedLoss, setEstimatedLoss] = useState("")
  const [numVictims, setNumVictims] = useState("")
  const [transactionHashes, setTransactionHashes] = useState("")
  const [yourName, setYourName] = useState("")
  const [email, setEmail] = useState("")

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

  const hasMinimumBalance = usdcrimeBalance ? Number(formatUnits(usdcrimeBalance as bigint, 6)) >= 100 : false
  
  // Faucet claim
  const { data: faucetHash, writeContract: writeFaucet, isPending: isFaucetPending, error: faucetError } = useWriteContract()
  const { isLoading: isFaucetConfirming, isSuccess: isFaucetSuccess } = useWaitForTransactionReceipt({
    hash: faucetHash,
  })
  
  // Approval transaction (for bounty creation)
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

  // Faucet claim handler
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

  // Auto-trigger bounty creation after approval succeeds
  useEffect(() => {
    if (isApprovalSuccess && !isBountySuccess) {
      handleCreateBounty()
    }
  }, [isApprovalSuccess])

  useEffect(() => {
    if (isBountySuccess) {
      alert('Bounty created successfully!')
      // Reset bounty fields
      setCaseTitle("")
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
      setConfirmed(false)
    }
  }, [isBountySuccess])

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
      setCaseTitle("Critical Smart Contract Audit - DeFi Protocol")
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
    } else if (activeTab === "web3-hacking") {
      setCaseTitle("Web3 DApp Security Audit Bounty")
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
      setCaseTitle("Suspected Rugpull by Known Scammer")
      setDescription("This person has launched multiple tokens and rugged each one, stealing millions from investors.")
      setSuspectName("CryptoScammer123")
      setSuspectWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0")
      setCrimeType("rugpull")
      setBlockchain("ethereum")
      setEstimatedLoss("500000")
      setNumVictims("150")
      setTransactionHashes("0xabc123...\n0xdef456...")
      setConfirmed(true)
    }
  }

  const handleApproveAndCreate = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    if (!hasMinimumBalance) {
      alert('You need at least 100 USDCRIME to create a bounty. Please claim from faucet first.')
      return
    }

    // Validation for bounty creation
    if (!caseTitle || !description || !lockAmount || !depositAmount || !durationDays || !lowPct || !mediumPct || !highPct) {
      alert('Please fill in all required fields!')
      return
    }

    // Validate approvers
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

      // First, approve USDCRIME
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

  // Approver management functions
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
      id: "smart-contract" as ReportCategory,
      label: "Smart Contract Bounty",
      icon: Code,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "web3-hacking" as ReportCategory,
      label: "Web3 Security Bounty",
      icon: Globe,
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: "people-bounty" as ReportCategory,
      label: "Report Scammer",
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
            <span className="text-sm text-primary font-mono">SECURE SUBMISSION</span>
          </div>
          
          {/* Claim Faucet Button & Balance Display */}
          <div className="mb-6 space-y-2">
            <Button
              onClick={handleClaimFaucet}
              disabled={isClaimingFaucet}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coins className="w-5 h-5 mr-2" />
              {isClaimingFaucet ? 'Claiming...' : 'Claim Faucet (1000 USDCRIME)'}
            </Button>
            
            {isConnected && (
              <div className="text-sm">
                <span className="text-muted-foreground">Your Balance: </span>
                <span className={`font-bold ${hasMinimumBalance ? 'text-green-500' : 'text-orange-500'}`}>
                  {usdcrimeBalance ? formatUnits(usdcrimeBalance as bigint, 6) : '0'} USDCRIME
                </span>
                {!hasMinimumBalance && (
                  <span className="text-orange-500 ml-2">(Min. 100 required for bounty creation)</span>
                )}
              </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {activeTab === "people-bounty" ? "Report a " : "Create a "}
            <span className="text-primary neon-text-cyan">
              {activeTab === "people-bounty" ? "Scammer" : "Bounty"}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {activeTab === "people-bounty" 
              ? "Help us track down scammers and protect the Web3 community."
              : "Post a bounty for security researchers to find vulnerabilities."
            }
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
                  {activeTab === "people-bounty" 
                    ? "All submissions are reviewed manually. False reports may result in account suspension. Please provide accurate and verifiable information."
                    : "You need at least 100 USDCRIME to create a bounty. Ensure you have sufficient balance to cover both lock and deposit amounts. Approvers will validate the bounty results."
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
              {activeTab === "web3-hacking" && "Web3 Application Security Bounty"}
              {activeTab === "people-bounty" && "Scammer Report"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Common Title Field */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {activeTab === "people-bounty" ? "Report Title" : "Bounty Title"} <span className="text-red-500">*</span>
              </label>
              <Input 
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder={
                  activeTab === "smart-contract" ? "e.g., Critical Smart Contract Audit - DeFi Protocol" :
                  activeTab === "web3-hacking" ? "e.g., Web3 DApp Security Audit Bounty" :
                  "e.g., Suspected Rugpull by Known Scammer"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Lock Amount (USDCRIME) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number"
                      value={lockAmount}
                      onChange={(e) => setLockAmount(e.target.value)}
                      placeholder="e.g., 10000"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Total reward pool for security researchers
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
                      placeholder="e.g., 5000"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Security deposit (refundable)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    placeholder="e.g., 30"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How long the bounty will be active
                  </p>
                </div>

                <div className="border-t border-border/30 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Reward Percentages by Severity</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Low Severity (%) <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="number"
                        value={lowPct}
                        onChange={(e) => setLowPct(e.target.value)}
                        placeholder="e.g., 10"
                        min="0"
                        max="100"
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Medium Severity (%) <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="number"
                        value={mediumPct}
                        onChange={(e) => setMediumPct(e.target.value)}
                        placeholder="e.g., 25"
                        min="0"
                        max="100"
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        High Severity (%) <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="number"
                        value={highPct}
                        onChange={(e) => setHighPct(e.target.value)}
                        placeholder="e.g., 50"
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
              </>
            )}

            {/* Web3 Security Bounty Fields */}
            {activeTab === "web3-hacking" && (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Lock Amount(USDCRIME) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number"
                      value={lockAmount}
                      onChange={(e) => setLockAmount(e.target.value)}
                      placeholder="e.g., 15000"
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
                      placeholder="e.g., 7500"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Security deposit (refundable)
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    placeholder="e.g., 45"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                <div className="border-t border-border/30 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Reward Percentages by Severity</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Low Severity (%) <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="number"
                        value={lowPct}
                        onChange={(e) => setLowPct(e.target.value)}
                        placeholder="e.g., 15"
                        min="0"
                        max="100"
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Medium Severity (%) <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="number"
                        value={mediumPct}
                        onChange={(e) => setMediumPct(e.target.value)}
                        placeholder="e.g., 30"
                        min="0"
                        max="100"
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        High Severity (%) <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        type="number"
                        value={highPct}
                        onChange={(e) => setHighPct(e.target.value)}
                        placeholder="e.g., 60"
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
              </>
            )}

            {/* People Bounty Fields (Report Scammer) */}
            {activeTab === "people-bounty" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Suspect Name/Alias
                    </label>
                    <Input 
                      value={suspectName}
                      onChange={(e) => setSuspectName(e.target.value)}
                      placeholder="Known name or alias"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Suspect Wallet Address <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      value={suspectWallet}
                      onChange={(e) => setSuspectWallet(e.target.value)}
                      placeholder="0x..."
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <SelectItem value="money-laundering">Money Laundering</SelectItem>
                        <SelectItem value="ponzi-scheme">Ponzi Scheme</SelectItem>
                        <SelectItem value="identity-theft">Identity Theft</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Blockchain <span className="text-red-500">*</span>
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
                        <SelectItem value="tron">Tron</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Number of Victims (if known)
                    </label>
                    <Input 
                      type="number"
                      value={numVictims}
                      onChange={(e) => setNumVictims(e.target.value)}
                      placeholder="e.g., 150"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Transaction Hash(es)
                  </label>
                  <Textarea 
                    value={transactionHashes}
                    onChange={(e) => setTransactionHashes(e.target.value)}
                    placeholder="Enter transaction hashes (one per line)"
                    className="min-h-[80px] bg-background/50 border-primary/20 focus:border-primary/50 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of the crime, including timeline, how it happened, and any relevant information..."
                    className="min-h-[150px] bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Upload Evidence
                  </label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Screenshots, documents, videos, proof (Max 50MB total)
                    </p>
                  </div>
                </div>

                <div className="border-t border-border/30 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information (Optional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Your Name
                      </label>
                      <Input 
                        value={yourName}
                        onChange={(e) => setYourName(e.target.value)}
                        placeholder="Anonymous"
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email Address
                      </label>
                      <Input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3">
                    Providing contact information helps us follow up if we need additional details. All information is kept confidential.
                  </p>
                </div>
              </>
            )}

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
                {activeTab === "people-bounty" 
                  ? "I confirm that all information provided is accurate to the best of my knowledge. I understand that submitting false information may result in legal consequences."
                  : "I confirm that I have sufficient USDCRIME balance and understand that the total amount (lock + deposit) will be transferred to the bounty contract. Approvers will validate the bounty results."
                } <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              {activeTab === "people-bounty" && (
                <Button 
                  variant="outline" 
                  className="flex-1 border-border/50"
                >
                  Save as Draft
                </Button>
              )}
              <Button 
                onClick={activeTab !== "people-bounty" ? handleApproveAndCreate : undefined}
                disabled={activeTab !== "people-bounty" ? (isBountyProcessing || !confirmed || !hasMinimumBalance) : false}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {activeTab !== "people-bounty" ? (
                  <>
                    <Coins className="w-5 h-5 mr-2" />
                    {isApprovalPending || isApprovalConfirming ? 'Approving USDCRIME...' :
                     isBountyPending || isBountyConfirming ? 'Creating Bounty...' :
                     'Approve & Create Bounty'}
                  </>
                ) : (
                  'Submit Report'
                )}
              </Button>
            </div>

            {/* Transaction Status (for bounty creation) */}
            {activeTab !== "people-bounty" && isBountyProcessing && (
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
              <h3 className="font-semibold mb-2">
                {activeTab === "people-bounty" ? "Secure & Anonymous" : "Secure & Transparent"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "people-bounty" 
                  ? "Your identity is protected. Submit anonymously if you prefer."
                  : "All funds are locked in smart contracts on-chain."
                }
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                {activeTab === "people-bounty" ? "Expert Review" : "Multisig Validation"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {activeTab === "people-bounty"
                  ? "Our team of security experts will review your submission."
                  : "Approvers validate bounty results before reward distribution."
                }
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              {activeTab === "people-bounty" ? (
                <>
                  <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Community Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    Help protect others from falling victim to similar attacks.
                  </p>
                </>
              ) : (
                <>
                  <Coins className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Fair Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Researchers are rewarded based on severity of findings.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
