"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, Shield, FileText, Sparkles, Coins, Code, Globe, Users } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { usdcrimeAbi } from "@/app/abi/usdcrimeAbi"
import { useEffect } from "react"
import { liskSepolia } from "@/config"

type ReportCategory = "smart-contract" | "web3-hacking" | "people-bounty"

export default function SubmitCasePage() {
  const [activeTab, setActiveTab] = useState<ReportCategory>("smart-contract")
  const [files, setFiles] = useState<File[]>([])
  
  // Common fields
  const [caseTitle, setCaseTitle] = useState("")
  const [description, setDescription] = useState("")
  const [yourName, setYourName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  
  // Smart Contract Audit fields
  const [contractAddress, setContractAddress] = useState("")
  const [blockchain, setBlockchain] = useState("")
  const [contractSource, setContractSource] = useState("")
  const [vulnerabilityType, setVulnerabilityType] = useState("")
  const [severity, setSeverity] = useState("")
  
  // Web3 Website Hacking fields
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [dappUrl, setDappUrl] = useState("")
  const [exploitType, setExploitType] = useState("")
  const [affectedComponents, setAffectedComponents] = useState("")
  
  // People Bounty fields
  const [suspectName, setSuspectName] = useState("")
  const [suspectWallet, setSuspectWallet] = useState("")
  const [crimeType, setCrimeType] = useState("")
  const [estimatedLoss, setEstimatedLoss] = useState("")
  const [numVictims, setNumVictims] = useState("")
  const [transactionHashes, setTransactionHashes] = useState("")

  const USDCRIME_CONTRACT_ADDRESS = "0x7898de8bB562B6e31C7A10FA3AE84AB036B1e9Cd" as `0x${string}`
  
  const { address, isConnected } = useAccount()
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isSuccess) {
      alert('Successfully claimed 1000 USDCRIME tokens!')
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      console.error('Faucet claim error:', error)
      const message = error.message || 'Unknown error'
      if (message.includes('User rejected') || message.includes('denied')) {
        alert('Transaction rejected by user')
      } else if (message.includes('network') || message.includes('chain')) {
        alert('Please make sure you are connected to Lisk Sepolia network')
      } else {
        alert('Failed to claim faucet: ' + message)
      }
    }
  }, [error])

  const handleClaimFaucet = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!')
      return
    }

    try {
      writeContract({
        address: USDCRIME_CONTRACT_ADDRESS,
        abi: usdcrimeAbi,
        functionName: 'claimFaucet',
        chainId: liskSepolia.id,
      })
    } catch (err) {
      console.error('Error initiating claim:', err)
    }
  }

  const isClaimingFaucet = isPending || isConfirming

  const tabs = [
    {
      id: "smart-contract" as ReportCategory,
      label: "Smart Contract Audit",
      icon: Code,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: "web3-hacking" as ReportCategory,
      label: "Web3 Website Hacking",
      icon: Globe,
      color: "from-cyan-500 to-blue-500"
    },
    {
      id: "people-bounty" as ReportCategory,
      label: "People Bounty",
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
          
          {/* Claim Faucet Button */}
          <div className="mb-6">
            <Button
              onClick={handleClaimFaucet}
              disabled={isClaimingFaucet}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coins className="w-5 h-5 mr-2" />
              {isClaimingFaucet ? 'Claiming...' : 'Claim Faucet'}
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Submit a <span className="text-primary neon-text-cyan">Report</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the type of report you want to submit and help us make Web3 safer.
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

        {/* Alert Box */}
        <Card className="glass border-orange-500/30 mb-8">
          <CardContent className="px-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-500 mb-1">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  All submissions are reviewed manually. False reports may result in account suspension. 
                  Please provide accurate and verifiable information.
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
              {activeTab === "smart-contract" && "Smart Contract Audit Report"}
              {activeTab === "web3-hacking" && "Web3 Website Hacking Report"}
              {activeTab === "people-bounty" && "People Bounty Report"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Common Fields */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Report Title <span className="text-red-500">*</span>
              </label>
              <Input 
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder={
                  activeTab === "smart-contract" ? "e.g., Critical Reentrancy Vulnerability in DeFi Protocol" :
                  activeTab === "web3-hacking" ? "e.g., XSS Vulnerability in DApp Frontend" :
                  "e.g., Suspected Rugpull by Known Scammer"
                }
                className="bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Smart Contract Audit Fields */}
            {activeTab === "smart-contract" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Contract Address <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      placeholder="0x..."
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
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
                        <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        <SelectItem value="optimism">Optimism</SelectItem>
                        <SelectItem value="avalanche">Avalanche</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Vulnerability Type <span className="text-red-500">*</span>
                    </label>
                    <Select value={vulnerabilityType} onValueChange={setVulnerabilityType}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reentrancy">Reentrancy</SelectItem>
                        <SelectItem value="overflow">Integer Overflow/Underflow</SelectItem>
                        <SelectItem value="access-control">Access Control</SelectItem>
                        <SelectItem value="front-running">Front-Running</SelectItem>
                        <SelectItem value="logic-error">Logic Error</SelectItem>
                        <SelectItem value="oracle-manipulation">Oracle Manipulation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Severity <span className="text-red-500">*</span>
                    </label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Contract Source Code (Optional)
                  </label>
                  <Textarea 
                    value={contractSource}
                    onChange={(e) => setContractSource(e.target.value)}
                    placeholder="Paste the vulnerable contract code or provide a link to verified source..."
                    className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/50 font-mono text-xs"
                  />
                </div>
              </>
            )}

            {/* Web3 Website Hacking Fields */}
            {activeTab === "web3-hacking" && (
              <>
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
                      DApp URL (if applicable)
                    </label>
                    <Input 
                      value={dappUrl}
                      onChange={(e) => setDappUrl(e.target.value)}
                      placeholder="https://app.example.com"
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Exploit Type <span className="text-red-500">*</span>
                    </label>
                    <Select value={exploitType} onValueChange={setExploitType}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xss">Cross-Site Scripting (XSS)</SelectItem>
                        <SelectItem value="csrf">Cross-Site Request Forgery (CSRF)</SelectItem>
                        <SelectItem value="sql-injection">SQL Injection</SelectItem>
                        <SelectItem value="wallet-drainer">Wallet Drainer</SelectItem>
                        <SelectItem value="phishing">Phishing Attack</SelectItem>
                        <SelectItem value="session-hijacking">Session Hijacking</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Severity <span className="text-red-500">*</span>
                    </label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger className="bg-background/50 border-primary/20">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Affected Components
                  </label>
                  <Input 
                    value={affectedComponents}
                    onChange={(e) => setAffectedComponents(e.target.value)}
                    placeholder="e.g., Login page, Wallet connection, NFT marketplace"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>
              </>
            )}

            {/* People Bounty Fields */}
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
                      placeholder="e.g., 50000"
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
                      placeholder="e.g., 100"
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
              </>
            )}

            {/* Common Description Field */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  activeTab === "smart-contract" 
                    ? "Describe the vulnerability, how it can be exploited, potential impact, and steps to reproduce..."
                    : activeTab === "web3-hacking"
                    ? "Describe the exploit, how it works, potential impact, and proof of concept..."
                    : "Provide a detailed description of the crime, including timeline, how it happened, and any relevant information..."
                }
                className="min-h-[150px] bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Evidence Upload */}
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
                  Screenshots, documents, videos, POC code (Max 50MB total)
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-border/30 pt-6 mt-6">
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
                I confirm that all information provided is accurate to the best of my knowledge. I understand that submitting false information may result in legal consequences. <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-border/50"
              >
                Save as Draft
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold"
              >
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure & Anonymous</h3>
              <p className="text-sm text-muted-foreground">
                Your identity is protected. Submit anonymously if you prefer.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Expert Review</h3>
              <p className="text-sm text-muted-foreground">
                Our team of security experts will review your submission.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community Impact</h3>
              <p className="text-sm text-muted-foreground">
                Help protect others from falling victim to similar attacks.
              </p>
            </CardContent>
          </Card>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
