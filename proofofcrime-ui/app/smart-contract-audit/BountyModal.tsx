"use client"

import { X, ExternalLink, Users, Clock, Shield, AlertTriangle, CheckCircle2, Award, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { smartcontractbountyAbi } from "@/app/abi/smartcontractbountyAbi"
import { liskSepolia } from "@/config"
import { useState, useEffect } from "react"

interface BountyModalProps {
  isOpen: boolean
  onClose: () => void
  onBountyJoined?: (bountyId: string) => void
  bounty?: {
    id: string
    bountyId: string
    title: string
    description: string
    category: string
    totalReward: number
    severity: string
    status: string
    deadline: string
    company: {
      name: string
      logo?: string
      website?: string
      github?: string
      discord?: string
      telegram?: string
      description?: string
    }
    participants: any[]
    scope: string
  }
}


export default function BountyModal({ isOpen, onClose, bounty, onBountyJoined }: BountyModalProps) {
  const { isConnected, address } = useAccount()
  const [isJoining, setIsJoining] = useState(false)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const router = useRouter()
  
  // Vulnerability submission form fields
  const [vulnTitle, setVulnTitle] = useState("")
  const [vulnDescription, setVulnDescription] = useState("")
  const [vulnSeverity, setVulnSeverity] = useState("")
  const [vulnPoC, setVulnPoc] = useState("")
  const [vulnSteps, setVulnSteps] = useState("")
  
  const BOUNTY_CONTRACT_ADDRESS = "0xF439FbFC5a1BF5B70D87E6680b83F2328cF69279"

  // Write contract hook for joinBounty
  const { 
    data: joinHash, 
    writeContract: writeJoinBounty,
    isPending: isJoinPending 
  } = useWriteContract()

  // Wait for transaction
  const { isLoading: isJoinConfirming, isSuccess: isJoinSuccess } = 
    useWaitForTransactionReceipt({ hash: joinHash })

  if (!isOpen || !bounty) return null

  // Company details from API or use defaults
  const companyDetails = {
    logo: bounty.company.logo || "/placeholder-logo.png",
    name: bounty.company.name,
    website: bounty.company.website || "https://example.com",
    github: bounty.company.github || "https://github.com/example",
    discord: bounty.company.discord || "https://discord.gg/example",
    telegram: bounty.company.telegram || "https://t.me/example",
    description: bounty.company.description || "Leading decentralized exchange protocol."
  }

  const auditInfo = {
    totalReward: `$${bounty.totalReward.toLocaleString()}`,
    deadline: new Date(bounty.deadline).toLocaleDateString(),
    category: bounty.scope,
    participants: bounty.participants.length,
    objective: bounty.description
  }

  const scopeDetails = {
    inScope: [
      "Core AMM smart contracts (Solidity 0.8.x)",
      "Liquidity pool management logic",
      "Concentrated liquidity mechanisms",
      "Fee distribution system",
      "Oracle integration contracts"
    ],
    outOfScope: [
      "Frontend/UI vulnerabilities",
      "Off-chain infrastructure",
      "Third-party integrations",
      "Known issues in documentation",
      "Gas optimization suggestions"
    ]
  }

  const rewardBreakdown = [
    { severity: "Critical", reward: "$50,000", color: "text-red-500" },
    { severity: "High", reward: "$25,000", color: "text-orange-500" },
    { severity: "Medium", reward: "$10,000", color: "text-yellow-500" },
    { severity: "Low", reward: "$5,000", color: "text-blue-500" }
  ]

  const rules = [
    "All findings must be submitted with detailed proof of concept and reproduction steps",
    "Duplicate submissions will be rewarded to the first reporter only",
    "Findings must be kept confidential until the bounty period ends",
    "Automated scanner results without manual verification will not be accepted",
    "Participants must not exploit vulnerabilities beyond proof of concept",
    "All submissions must be made through the official platform",
    "Final reward amounts are subject to severity assessment by the security team"
  ]

  const handleAutofill = () => {
    setVulnTitle("Critical Reentrancy Vulnerability in withdraw() Function")
    setVulnDescription("Found a critical reentrancy vulnerability in the withdraw function that allows attackers to drain the entire pool balance by recursively calling the function before state updates.")
    setVulnSeverity("High")
    setVulnPoc("// Malicious contract\ncontract Attacker {\n  fallback() external payable {\n    // Recursive call to withdraw\n    VulnerableContract(target).withdraw();\n  }\n}")
    setVulnSteps("1. Deploy malicious contract with fallback function\n2. Call withdraw() from malicious contract\n3. Fallback function recursively calls withdraw()\n4. Drain entire pool balance before balance is updated")
  }

  const handleSubmitFinding = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first!")
      return
    }

    // Validation
    if (!vulnTitle || !vulnDescription || !vulnSeverity || !vulnPoC) {
      alert("Please fill in all required fields!")
      return
    }

    try {
      setIsJoining(true)
      // Extract numeric bountyId from the id (e.g., "AUDIT-001" -> 1)
      const bountyIdNum = parseInt(bounty.id) || 1
      
      writeJoinBounty({
        address: BOUNTY_CONTRACT_ADDRESS,
        abi: smartcontractbountyAbi,
        functionName: 'joinBounty',
        args: [BigInt(bountyIdNum)],
        chainId: liskSepolia.id,
      })
    } catch (err) {
      console.error('Error joining bounty:', err)
      alert('Failed to submit finding: ' + (err as any).message)
      setIsJoining(false)
    }
  }

  // Submit to API after blockchain transaction succeeds
  useEffect(() => {
    const submitToAPI = async () => {
      if (!isJoinSuccess || !isJoining) return
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://proof-of-crime-dogq.onrender.com'
        
        const submissionData = {
          bountyId: bounty.id,
          userId: address, // Will need proper user ID from backend
          title: vulnTitle,
          description: vulnDescription,
          severity: vulnSeverity,
          vulnerabilityType: "Smart Contract Vulnerability",
          pocDescription: vulnDescription,
          pocSteps: vulnSteps.split('\n'),
          pocCode: vulnPoC,
        }
        
        console.log('Submitting vulnerability to API:', submissionData)
        
        const response = await fetch(`${apiUrl}/api/bounties/${bounty.id}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: address }),
        })
        setIsJoining(false)
        alert("Finding submitted on-chain but failed to save details. Transaction confirmed!")
      }
    }
    
    submitToAPI()
  }, [isJoinSuccess, isJoining])

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="glass border-primary/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 fade-in duration-300 hide-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 glass border-b border-primary/20 p-6 flex items-start justify-between z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{bounty.title}</h2>
                <Badge 
                  variant="destructive" 
                  className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {bounty.severity}
                </Badge>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {bounty.company.name}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Company Details */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-primary mr-3 rounded-full" />
                Company Details
              </h3>
              <div className="glass-hover rounded-xl p-5 border border-primary/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{companyDetails.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{companyDetails.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href={companyDetails.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Website
                      </a>
                      <a 
                        href={companyDetails.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GitHub
                      </a>
                      <a 
                        href={companyDetails.discord} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Discord
                      </a>
                      <a 
                        href={companyDetails.telegram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Telegram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bounty Information */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-secondary mr-3 rounded-full" />
                Bounty Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-muted-foreground">Total Reward</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{auditInfo.totalReward}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Deadline</span>
                  </div>
                  <p className="text-xl font-semibold">{auditInfo.deadline}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Category</span>
                  </div>
                  <p className="text-lg font-medium">{auditInfo.category}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Participants</span>
                  </div>
                  <p className="text-xl font-semibold">{auditInfo.participants} Auditors</p>
                </div>
              </div>
              <div className="mt-4 glass-hover rounded-xl p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Audit Objective</h4>
                <p className="text-sm text-muted-foreground">{auditInfo.objective}</p>
              </div>
            </section>

            {/* Scope */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-primary mr-3 rounded-full" />
                Audit Scope
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* In Scope */}
                <div className="glass-hover rounded-xl p-5 border border-green-500/20">
                  <h4 className="font-semibold mb-3 flex items-center text-green-400">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    In Scope
                  </h4>
                  <ul className="space-y-2">
                    {scopeDetails.inScope.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-green-400 mr-2 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Out of Scope */}
                <div className="glass-hover rounded-xl p-5 border border-red-500/20">
                  <h4 className="font-semibold mb-3 flex items-center text-red-400">
                    <X className="w-4 h-4 mr-2" />
                    Out of Scope
                  </h4>
                  <ul className="space-y-2">
                    {scopeDetails.outOfScope.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-red-400 mr-2 mt-0.5">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Reward Breakdown */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-secondary mr-3 rounded-full" />
                Reward Breakdown
              </h3>
              <div className="glass-hover rounded-xl border border-primary/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary/5 border-b border-primary/10">
                    <tr>
                      <th className="text-left p-4 font-semibold">Severity Level</th>
                      <th className="text-right p-4 font-semibold">Reward Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardBreakdown.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className={`font-medium ${item.color}`}>{item.severity}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold text-green-400">{item.reward}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rules & Requirements */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-primary mr-3 rounded-full" />
                Rules & Requirements
              </h3>
              <div className="glass-hover rounded-xl p-5 border border-primary/10">
                <ol className="space-y-3">
                  {rules.map((rule, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="font-bold text-primary mr-3 mt-0.5">{index + 1}.</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>

          {/* Vulnerability Submission Form */}
          {showSubmissionForm && (
            <div className="p-6 space-y-6 border-t border-primary/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <div className="w-1 h-5 bg-primary mr-3 rounded-full" />
                  Submit Your Finding
                </h3>
                <Button
                  onClick={handleAutofill}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Autofill Example
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Vulnerability Title *</label>
                  <Input
                    value={vulnTitle}
                    onChange={(e) => setVulnTitle(e.target.value)}
                    placeholder="e.g., Reentrancy vulnerability in withdraw function"
                    className="bg-background/50 border-primary/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description *</label>
                  <Textarea
                    value={vulnDescription}
                    onChange={(e) => setVulnDescription(e.target.value)}
                    placeholder="Detailed description of the vulnerability and its impact"
                    rows={4}
                    className="bg-background/50 border-primary/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Severity *</label>
                  <Select value={vulnSeverity} onValueChange={setVulnSeverity}>
                    <SelectTrigger className="bg-background/50 border-primary/20">
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Proof of Concept (Code) *</label>
                  <Textarea
                    value={vulnPoC}
                    onChange={(e) => setVulnPoc(e.target.value)}
                    placeholder="Paste your PoC code here"
                    rows={6}
                    className="bg-background/50 border-primary/20 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Reproduction Steps</label>
                  <Textarea
                    value={vulnSteps}
                    onChange={(e) => setVulnSteps(e.target.value)}
                    placeholder="Step-by-step instructions to reproduce the vulnerability"
                    rows={4}
                    className="bg-background/50 border-primary/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="sticky bottom-0 glass border-t border-primary/20 p-6 flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/5"
            >
              Cancel
            </Button>
            {!showSubmissionForm ? (
              <Button
                onClick={() => setShowSubmissionForm(true)}
                disabled={!isConnected}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isConnected ? "Connect Wallet to Join" : "Join Bounty Now"}
              </Button>
            ) : (
              <Button
                onClick={handleSubmitFinding}
                disabled={!isConnected || isJoinPending || isJoinConfirming}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoinPending || isJoinConfirming ? "Submitting Finding..." : "Submit Finding"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
