"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Upload, Shield, FileText } from "lucide-react"

export default function SubmitCasePage() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
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
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Case Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Case Title */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Case Title <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="e.g., Rugpull on XYZ Token"
                className="bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>

            {/* Crime Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Crime Type <span className="text-red-500">*</span>
              </label>
              <Select>
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
              <Select>
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
                  placeholder="0x..."
                  className="bg-background/50 border-primary/20 focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Contract Address (if applicable)
                </label>
                <Input 
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
