"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, User, DollarSign, Users, MapPin, Calendar, X, Copy, Wallet, AlertTriangle, FileText, Upload } from "lucide-react"
import Image from "next/image"

export default function PeopleBountyPage() {
  const [selectedSuspect, setSelectedSuspect] = useState<any>(null)
  const [showEvidenceModal, setShowEvidenceModal] = useState(false)
  // Mock Data for Suspects
  const suspects = [
    {
      id: 1,
      name: "Viktor Petrov",
      alias: "CryptoGhost",
      status: "WANTED",
      riskLevel: "EXTREME RISK",
      bounty: "500,000 USDT",
      estimatedLoss: "$12.5M",
      victims: "2,500+",
      nationality: "Russia",
      age: "34",
      sex: "Male",
      crimes: ["Rug Pull", "Identity Theft", "Money Laundering"],
      image: "/suspect-photo/viktorpetrov.jpg",
    },
    {
      id: 2,
      name: "Sarah Chen",
      alias: "PhantomQueen",
      status: "INVESTIGATING",
      riskLevel: "HIGH RISK",
      bounty: "250,000 USDT",
      estimatedLoss: "$5.8M",
      victims: "1,200+",
      nationality: "China",
      age: "28",
      sex: "Female",
      crimes: ["NFT Fraud", "Phishing", "Social Engineering"],
      image: "/suspect-photo/sarahchen.jpg",
    },
    {
      id: 3,
      name: "Marcus Johnson",
      alias: "DarkNode",
      status: "WANTED",
      riskLevel: "EXTREME RISK",
      bounty: "750,000 USDT",
      estimatedLoss: "$20M",
      victims: "5,000+",
      nationality: "USA",
      age: "42",
      sex: "Male",
      crimes: ["Pump & Dump", "Market Manipulation", "Insider Trading"],
      image: "/suspect-photo/marcusjohnson.jpg",
    },
    {
      id: 4,
      name: "Dmitri Volkov",
      alias: "ShadowMiner",
      status: "WANTED",
      riskLevel: "HIGH RISK",
      bounty: "300,000 USDT",
      estimatedLoss: "$8.2M",
      victims: "1,800+",
      nationality: "Ukraine",
      age: "31",
      sex: "Male",
      crimes: ["Mining Scam", "Ponzi Scheme", "Wire Fraud"],
      image: "https://placehold.co/200x200/1a1a1a/FFF?text=DV",
    },
    {
      id: 5,
      name: "Yuki Tanaka",
      alias: "SilentWhale",
      status: "INVESTIGATING",
      riskLevel: "MEDIUM RISK",
      bounty: "150,000 USDT",
      estimatedLoss: "$3.5M",
      victims: "800+",
      nationality: "Japan",
      age: "26",
      sex: "Female",
      crimes: ["Wash Trading", "Fake Volume", "Token Manipulation"],
      image: "https://placehold.co/200x200/1a1a1a/FFF?text=YT",
    },
    {
      id: 6,
      name: "Ahmed Al-Rashid",
      alias: "DesertFox",
      status: "WANTED",
      riskLevel: "EXTREME RISK",
      bounty: "600,000 USDT",
      estimatedLoss: "$15M",
      victims: "3,500+",
      nationality: "UAE",
      age: "38",
      sex: "Male",
      crimes: ["Smart Contract Exploit", "DeFi Hack", "Rug Pull"],
      image: "https://placehold.co/200x200/1a1a1a/FFF?text=AR",
    },
  ]

  const getStatusColor = (status: string) => {
    return status === "WANTED" ? "bg-red-500" : "bg-orange-500"
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "EXTREME RISK":
        return "bg-red-500/20 text-red-500 border-red-500/50"
      case "HIGH RISK":
        return "bg-orange-500/20 text-orange-500 border-orange-500/50"
      case "MEDIUM RISK":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      default:
        return "bg-green-500/20 text-green-500 border-green-500/50"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-primary neon-text-cyan">People & Suspected</span>{" "}
            <span className="text-secondary neon-text-magenta">Name Bounty</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Report criminals and submit evidence. Help bring justice to the crypto space and earn substantial rewards for verified information.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search by name or alias..." className="pl-10 bg-background/50 border-primary/20 focus:border-primary/50" />
          </div>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[140px] bg-background/50 border-primary/20">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wanted">Wanted</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="captured">Captured</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px] bg-background/50 border-primary/20">
                <SelectValue placeholder="Danger Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="extreme">Extreme</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px] bg-background/50 border-primary/20">
                <SelectValue placeholder="Crime Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rugpull">Rug Pull</SelectItem>
                <SelectItem value="nft">NFT Fraud</SelectItem>
                <SelectItem value="phishing">Phishing</SelectItem>
                <SelectItem value="hack">Hack</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center mb-8 p-4 glass rounded-lg border border-border/50">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-bold text-foreground">{suspects.length}</span> suspects
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Your Balance: <span className="text-green-500 font-bold">2,500 USDT</span></span>
          </div>
        </div>

        {/* Suspects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {suspects.map((suspect) => (
            <Card key={suspect.id} className="glass border-border/50 hover:border-primary/30 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-0">
                {/* Header with Status and Risk */}
                <div className="p-4 border-b border-border/30 flex justify-between items-center">
                  <Badge className={`${getStatusColor(suspect.status)} text-white font-bold px-3 py-1`}>
                    {suspect.status}
                  </Badge>
                  <Badge variant="outline" className={`${getRiskColor(suspect.riskLevel)} font-bold px-3 py-1`}>
                    {suspect.riskLevel}
                  </Badge>
                </div>

                {/* Image */}
                <div className="relative w-full h-48 bg-muted/20">
                  <Image 
                    src={suspect.image} 
                    alt={suspect.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {suspect.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    aka "<span className="text-primary font-medium">{suspect.alias}</span>"
                  </p>

                  {/* Bounty Amount */}
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Bounty Reward</div>
                    <div className="text-2xl font-bold text-green-500">{suspect.bounty}</div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Estimated Loss</div>
                      <div className="font-bold text-red-500">{suspect.estimatedLoss}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Victims</div>
                      <div className="font-bold">{suspect.victims}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Nationality</div>
                      <div className="font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {suspect.nationality}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Age / Sex</div>
                      <div className="font-medium">{suspect.age} / {suspect.sex}</div>
                    </div>
                  </div>

                  {/* Crime Tags */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-2">Crime Types</div>
                    <div className="flex flex-wrap gap-2">
                      {suspect.crimes.map((crime, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                          {crime}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => setSelectedSuspect(suspect)}
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="glass p-8 rounded-2xl border border-primary/20 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
            <h2 className="text-2xl font-bold mb-4 relative z-10">Have Information?</h2>
            <p className="text-muted-foreground mb-6 relative z-10">
              If you have credible information about any of these individuals or other crypto criminals, contact us securely. Verified tips are rewarded.
            </p>
            <Button size="lg" className="relative z-10">
              Talk with Us
            </Button>
          </div>
        </div>

        {/* Profile Modal */}
        <Dialog open={!!selectedSuspect} onOpenChange={(open) => !open && setSelectedSuspect(null)}>
          <DialogContent className="w-[1000px] max-w-[95vw] max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-md border-primary/20">
            {selectedSuspect && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-3xl font-bold mb-2">{selectedSuspect.name}</DialogTitle>
                    <p className="text-lg text-primary">aka "{selectedSuspect.alias}"</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className={`${getStatusColor(selectedSuspect.status)} text-white font-bold`}>
                        {selectedSuspect.status}
                      </Badge>
                      <Badge variant="outline" className={`${getRiskColor(selectedSuspect.riskLevel)} font-bold`}>
                        {selectedSuspect.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Bounty Reward</div>
                    <div className="text-3xl font-bold text-green-500">{selectedSuspect.bounty}</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">Nationality</div>
                      <div className="text-lg font-bold">{selectedSuspect.nationality}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">Age / Sex</div>
                      <div className="text-lg font-bold">{selectedSuspect.age} / {selectedSuspect.sex}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">Estimated Loss</div>
                      <div className="text-lg font-bold text-red-500">{selectedSuspect.estimatedLoss}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass border-border/50">
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground mb-1">Total Victims</div>
                      <div className="text-lg font-bold">{selectedSuspect.victims}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Description</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Expert in NFT marketplace exploits and sophisticated phishing campaigns targeting high-value collectors.
                  </p>
                </div>

                {/* Type of Crimes */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h3 className="text-lg font-bold">Type of Crimes</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSuspect.crimes.map((crime: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-red-500/50 text-red-500 px-3 py-1">
                        {crime}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Activity Period */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-bold">Activity Period</h3>
                  </div>
                  <p className="text-foreground">2022 - Present</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-orange-500 font-medium">Last Seen:</span> Hong Kong - Dec 2023
                  </p>
                </div>

                {/* Known Wallet Addresses */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold">Known Wallet Addresses</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 glass rounded-lg border border-border/50">
                      <code className="text-sm text-primary">0x1a2b...45cd</code>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary">
                          <Wallet className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 glass rounded-lg border border-border/50">
                      <code className="text-sm text-primary">0x8e7f...90ab</code>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary">
                          <Wallet className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Evidence CTA */}
                <Card className="glass border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Submit Evidence & Claim Bounty</h3>
                    <p className="text-muted-foreground mb-4">
                      Have information about this suspect? Submit verified evidence to claim the bounty reward.
                    </p>
                    <Button 
                      onClick={() => setShowEvidenceModal(true)}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold"
                      size="lg"
                    >
                      Submit Evidence Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Evidence Submission Modal */}
        <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
          <DialogContent className="w-[800px] max-w-[90vw] max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-md border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Submit Evidence</DialogTitle>
              <DialogDescription>
                Provide detailed evidence to help verify the suspect's activities and claim the bounty reward.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {/* File Upload Grid - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo Evidence */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Photo Evidence</label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                    <Button variant="outline" className="mb-2 border-primary/50 text-primary">
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground">No file chosen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Files will be marked as "Uncollectable"
                    </p>
                  </div>
                </div>

                {/* Video Evidence */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Video Evidence</label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                    <Button variant="outline" className="mb-2 border-primary/50 text-primary">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground">No file chosen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Files will be marked as "Uncollectable"
                    </p>
                  </div>
                </div>

                {/* Voice Note */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Voice Note</label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                    <Button variant="outline" className="mb-2 border-primary/50 text-primary">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground">No file chosen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Files will be marked as "Uncollectable"
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Documents</label>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-background/50">
                    <Button variant="outline" className="mb-2 border-primary/50 text-primary">
                      Choose Files
                    </Button>
                    <p className="text-xs text-muted-foreground">No file chosen</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: Files will be marked as "Uncollectable"
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Your Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Enter your name"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    type="email"
                    placeholder="your@email.com"
                    className="bg-background/50 border-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Wallet Address for Reward */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Your Wallet Address (for bounty payment) <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="0x..."
                  className="bg-background/50 border-primary/20 focus:border-primary/50"
                />
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 p-4 glass rounded-lg border border-primary/20">
                <input 
                  type="checkbox" 
                  id="confirm-evidence"
                  className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                />
                <label htmlFor="confirm-evidence" className="text-sm text-muted-foreground cursor-pointer">
                  I confirm that all evidence provided is authentic and accurate. I understand that submitting false information may result in account suspension and legal action. <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 border-border/50"
                  onClick={() => setShowEvidenceModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold"
                >
                  Submit Evidence
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
    </div>
  )
}
