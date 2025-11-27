"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, Shield, FileText, Sparkles, Coins } from "lucide-react"
import { ethers } from "ethers"

export default function SubmitCasePage() {
  const [files, setFiles] = useState<File[]>([])
  const [caseTitle, setCaseTitle] = useState("")
  const [crimeType, setCrimeType] = useState("")
  const [blockchain, setBlockchain] = useState("")
  const [suspectWallet, setSuspectWallet] = useState("")
  const [contractAddress, setContractAddress] = useState("")
  const [estimatedLoss, setEstimatedLoss] = useState("")
  const [numVictims, setNumVictims] = useState("")
  const [description, setDescription] = useState("")
  const [transactionHashes, setTransactionHashes] = useState("")
  const [yourName, setYourName] = useState("")
  const [email, setEmail] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false)

  const USDCRIME_CONTRACT_ADDRESS = "0x7898de8bB562B6e31C7A10FA3AE84AB036B1e9Cd"
  const USDCRIME_ABI = [
    "function claimFaucet() external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function name() external view returns (string)",
    "function symbol() external view returns (string)"
  ]

  const handleClaimFaucet = async () => {
    try {
      setIsClaimingFaucet(true)
      
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask or another Web3 wallet!')
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum as any)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      
      const contract = new ethers.Contract(
        USDCRIME_CONTRACT_ADDRESS,
        USDCRIME_ABI,
        signer
      )

      const tx = await contract.claimFaucet()
      await tx.wait()
      
      alert('Successfully claimed 1000 USDCRIME tokens!')
    } catch (error: any) {
      console.error('Faucet claim error:', error)
      if (error.code === 'ACTION_REJECTED') {
        alert('Transaction rejected by user')
      } else if (error.message?.includes('faucet empty')) {
        alert('Faucet is empty. Maximum supply reached.')
      } else {
        alert('Failed to claim faucet: ' + (error.message || 'Unknown error'))
      }
    } finally {
      setIsClaimingFaucet(false)
    }
  }

  const handleAutoFill = () => {
    setCaseTitle("SafeMoon V2 Rugpull Investigation")
    setCrimeType("rugpull")
    setBlockchain("bsc")
    setSuspectWallet("0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3")
    setContractAddress("0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5")
    setEstimatedLoss("1200000")
    setNumVictims("8300")
    setDescription("SafeMoon V2 token experienced a coordinated pump and dump scheme. The developers created artificial hype through social media campaigns, causing the token price to surge 300% in 48 hours. Shortly after reaching peak price, the team executed a massive sell-off, draining liquidity pools and leaving retail investors with worthless tokens. Evidence shows coordinated wallet movements and suspicious transaction patterns indicating premeditated fraud.")
    setTransactionHashes("0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z\n0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a")
    setYourName("Anonymous Investigator")
    setEmail("investigator@proofofcrime.com")
    setConfirmed(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navigation />
      
      {/* Floating Claim Faucet Button */}
      <div className="fixed top-24 right-6 z-40">
        <button
          onClick={handleClaimFaucet}
          disabled={isClaimingFaucet}
          className="px-5 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed neon-glow-green"
        >
          <Coins className="w-5 h-5" />
          {isClaimingFaucet ? 'Claiming...' : 'Claim Faucet'}
        </button>
      </div>
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-mono">SECURE SUBMISSION</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Submit a <span className="text-primary neon-text-cyan">Crime Case</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us track and prevent Web3 crimes. Your submission will be reviewed by our team and added to our database if verified.
          </p>
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

        {/* Form */}
        <Card className="glass border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Case Information
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAutoFill}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Auto Fill Demo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Case Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Case Title <span className="text-red-500">*</span>
              </label>
              <Input 
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="e.g., Rugpull on XYZ Token"
                className="bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Crime Type */}
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
                  <SelectItem value="smart-contract-exploit">Smart Contract Exploit</SelectItem>
                  <SelectItem value="identity-theft">Identity Theft</SelectItem>
                  <SelectItem value="ponzi-scheme">Ponzi Scheme</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Blockchain */}
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

            {/* Wallet Address / Contract Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Suspect Wallet Address
                </label>
                <Input 
                  value={suspectWallet}
                  onChange={(e) => setSuspectWallet(e.target.value)}
                  placeholder="0x..."
                  className="bg-background/50 border-primary/20 focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Contract Address (if applicable)
                </label>
                <Input 
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="bg-background/50 border-primary/20 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Estimated Loss */}
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

            {/* Description */}
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

            {/* Transaction Hash */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Transaction Hash(es)
              </label>
              <Textarea 
                value={transactionHashes}
                onChange={(e) => setTransactionHashes(e.target.value)}
                placeholder="Enter transaction hashes (one per line)"
                className="min-h-[80px] bg-background/50 border-primary/20 focus:border-primary/50"
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
                  Screenshots, documents, videos (Max 50MB total)
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
                Submit Case
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
                Our team of blockchain analysts will review your submission.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community Impact</h3>
              <p className="text-sm text-muted-foreground">
                Help protect others from falling victim to similar crimes.
              </p>
            </CardContent>
          </Card>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
