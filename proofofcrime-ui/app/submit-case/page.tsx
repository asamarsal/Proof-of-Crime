"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Shield, FileText, Sparkles, Coins, Briefcase } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { usdcrimeAbi } from "@/app/abi/usdcrimeAbi"
import { smartcontractbountyAbi } from "@/app/abi/smartcontractbountyAbi"
import { useEffect } from "react"
import { liskSepolia } from "@/config"
import { parseUnits } from "viem"

export default function SubmitCasePage() {
  // Bounty fields
  const [bountyTitle, setBountyTitle] = useState("")
  const [description, setDescription] = useState("")
  const [lockAmount, setLockAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [durationDays, setDurationDays] = useState("")
  const [lowPct, setLowPct] = useState("")
  const [mediumPct, setMediumPct] = useState("")
  const [highPct, setHighPct] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  // Contract addresses
  const USDCRIME_CONTRACT_ADDRESS = "0x7898de8bB562B6e31C7A10FA3AE84AB036B1e9Cd" as `0x${string}`
  const BOUNTY_CONTRACT_ADDRESS = "0xF439FbFC5a1BF5B70D87E6680b83F2328cF69279" as `0x${string}`
  
  const { address, isConnected } = useAccount()
  
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

  // Auto-trigger bounty creation after approval succeeds
  useEffect(() => {
    if (isApprovalSuccess && !isBountySuccess) {
      handleCreateBounty()
    }
  }, [isApprovalSuccess])

  useEffect(() => {
    if (isBountySuccess) {
      alert('Bounty created successfully!')
      // Reset form
      setBountyTitle("")
      setDescription("")
      setLockAmount("")
      setDepositAmount("")
      setDurationDays("")
      setLowPct("")
      setMediumPct("")
      setHighPct("")
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
    setBountyTitle("Critical Smart Contract Audit - DeFi Protocol")
    setDescription("We need security researchers to audit our DeFi lending protocol smart contract. The contract handles user deposits, lending, and liquidations. We're offering rewards based on severity of findings.")
    setLockAmount("10000") // 10,000 USDCRIME
    setDepositAmount("5000") // 5,000 USDCRIME
    setDurationDays("30") // 30 days
    setLowPct("10") // 10% for Low severity
    setMediumPct("25") // 25% for Medium severity
    setHighPct("50") // 50% for High severity
    setConfirmed(true)
  }

  const handleApproveAndCreate = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    // Validation
    if (!bountyTitle || !description || !lockAmount || !depositAmount || !durationDays || !lowPct || !mediumPct || !highPct) {
      alert('Please fill in all required fields!')
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
      // Calculate total amount to approve (lockAmount + depositAmount)
      const lockAmountWei = parseUnits(lockAmount, 6) // USDCRIME has 6 decimals
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

  const isProcessing = isApprovalPending || isApprovalConfirming || isBountyPending || isBountyConfirming

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-mono">COMPANY BOUNTY CREATION</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Create a <span className="text-primary neon-text-cyan">Bounty</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Post a bounty for security researchers to find vulnerabilities in your smart contracts.
          </p>
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
                  You will need to approve USDCRIME tokens before creating the bounty. Make sure you have enough balance to cover both the lock amount and deposit amount.
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
              Bounty Details
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
                placeholder="e.g., Critical Smart Contract Audit - DeFi Protocol"
                className="bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want security researchers to audit, the scope, and any important details..."
                className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Lock Amount and Deposit Amount */}
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
                  Total reward pool for bounty hunters
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

            {/* Duration */}
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

            {/* Reward Percentages */}
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
                I confirm that I have sufficient USDCRIME balance and understand that the total amount (lock + deposit) will be transferred to the bounty contract. <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleApproveAndCreate}
                disabled={isProcessing || !confirmed}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Coins className="w-5 h-5 mr-2" />
                {isApprovalPending || isApprovalConfirming ? 'Approving USDCRIME...' :
                 isBountyPending || isBountyConfirming ? 'Creating Bounty...' :
                 'Approve & Create Bounty'}
              </Button>
            </div>

            {/* Transaction Status */}
            {isProcessing && (
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
              <h3 className="font-semibold mb-2">Expert Review</h3>
              <p className="text-sm text-muted-foreground">
                Security experts will audit your smart contracts.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <Coins className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Fair Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Researchers are rewarded based on severity of findings.
              </p>
            </CardContent>
          </Card>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
