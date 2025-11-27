"use client"

import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertCircle, 
  Shield, 
  Eye, 
  Activity, 
  Lock, 
  TrendingUp, 
  Users, 
  Wallet,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  FileText,
  Target,
  Zap
} from "lucide-react"

export default function FeaturesPage() {
  const activeBounties = [
    { id: "#CR-8472", title: "SafeMoon V2 Rugpull", amount: "$125K", status: "Hot", color: "red" },
    { id: "#CR-7391", title: "NFT Phishing Ring", amount: "$85K", status: "Active", color: "green" },
    { id: "#CR-6205", title: "DeFi Protocol Exploit", amount: "$215K", status: "Active", color: "green" },
    { id: "#CR-5184", title: "Pump & Dump Scheme", amount: "$50K", status: "Closed", color: "gray" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-secondary/40 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-secondary/30 rounded-full animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6 animate-fade-in">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-mono">BLOCKCHAIN FORENSICS</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Why <span className="text-primary neon-text-cyan">Proof of Crime</span>?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time blockchain forensics, AI-powered crime detection, and on-chain bounty enforcement.
          </p>
        </div>

        {/* Section 1 - Core Features (Bento Grid) */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <h2 className="text-2xl font-bold text-primary neon-text-cyan">Core Features</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 - Real-Time Crime Tracking */}
            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <AlertCircle className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-red-500/20 text-red-500 border-red-500/50">Live</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  Real-Time Crime Tracking
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Live detection of suspicious wallet movements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>AI scoring for risk levels (Critical / High / Medium)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Automated alerts for high-risk transactions</span>
                  </li>
                </ul>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="border-red-500/50 text-red-500 text-xs">Critical</Badge>
                  <Badge variant="outline" className="border-orange-500/50 text-orange-500 text-xs">High</Badge>
                  <Badge variant="outline" className="border-yellow-500/50 text-yellow-500 text-xs">Medium</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 - Case Dashboard */}
            <Card className="glass border-secondary/20 hover:border-secondary/40 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                    <FileText className="w-6 h-6 text-secondary" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/50">Active</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors">
                  Case Dashboard
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>View trending cases with #CR-XXXX format</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Track stolen amounts, tags, and severity levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Monitor victim chains and active investigators</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 glass rounded-lg border border-border/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">#CR-8472</span>
                    <span className="text-red-500 font-bold">$125K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 - Suspect Profiling Engine */}
            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/50">AI-Powered</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  Suspect Profiling Engine
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Anonymized wallet addresses with accuracy %</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Advanced behavioral pattern analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Cross-chain wallet tracking</span>
                  </li>
                </ul>
                <div className="mt-4 flex gap-2">
                  <Badge className="bg-red-500 text-white border-0 text-xs">WANTED</Badge>
                  <Badge className="bg-yellow-500 text-black border-0 text-xs">SUSPECT</Badge>
                  <Badge className="bg-blue-500 text-white border-0 text-xs">WATCHING</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Card 4 - Live Alerts Feed */}
            <Card className="glass border-secondary/20 hover:border-secondary/40 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                    <Activity className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs text-green-500">Live</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-secondary transition-colors">
                  Live Alerts Feed
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Real-time attack notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Mixer usage alerts and tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Bounty claim updates</span>
                  </li>
                </ul>
                <div className="mt-4 space-y-2">
                  <div className="p-2 glass rounded border border-border/30 text-xs">
                    <span className="text-red-500">⚠</span> New attack detected - 2 mins ago
                  </div>
                  <div className="p-2 glass rounded border border-border/30 text-xs">
                    <span className="text-yellow-500">⚡</span> Mixer usage alert - 5 mins ago
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 2 - Commitment Fee Mechanism */}
        <div className="mb-20">
          <Card className="glass border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
            <div className="absolute inset-0 border-2 border-primary/20 rounded-lg animate-pulse-glow" />
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-3 mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl md:text-4xl font-bold">
                    <span className="text-primary neon-text-cyan">$100 USDT</span> Lock
                  </h2>
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <p className="text-xl font-semibold mb-6">Investigator Commitment Fee</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 glass rounded-lg border border-primary/20">
                    <Lock className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Lock $100 USDT to submit or join investigations</p>
                  </div>
                  <div className="p-4 glass rounded-lg border border-primary/20">
                    <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Ensures serious contributors only</p>
                  </div>
                  <div className="p-4 glass rounded-lg border border-primary/20">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Fully refundable when investigation closes</p>
                  </div>
                </div>

                <div className="p-4 glass rounded-lg border border-green-500/30 bg-green-500/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Integrity Score</span>
                    <span className="text-sm font-bold text-green-500">100% Secure</span>
                  </div>
                  <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-primary animate-pulse" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3 - On-Chain Prize Pool */}
        <div className="mb-20">
          <Card className="glass border-secondary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
            <div className="absolute inset-0 border-2 border-secondary/20 rounded-lg" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-8 h-8 text-secondary" />
                <h2 className="text-3xl font-bold text-secondary neon-text-magenta">
                  Smart Contract Bounty Prize Pool
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 glass rounded-lg border border-secondary/20">
                  <div className="text-sm text-muted-foreground mb-2">Total Bounty Locked</div>
                  <div className="text-4xl font-bold text-secondary">$425,000</div>
                  <div className="text-xs text-muted-foreground mt-1">Across 47 active cases</div>
                </div>

                <div className="p-6 glass rounded-lg border border-secondary/20">
                  <div className="text-sm text-muted-foreground mb-4">Active Bounties</div>
                  <div className="space-y-2">
                    {activeBounties.map((bounty, index) => (
                      <div key={index} className="flex items-center justify-between p-2 glass rounded border border-border/30">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-mono">{bounty.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">{bounty.amount}</span>
                          <Badge 
                            className={`text-[10px] h-5 px-2 ${
                              bounty.color === 'red' ? 'bg-red-500/20 text-red-500 border-red-500/50' :
                              bounty.color === 'green' ? 'bg-green-500/20 text-green-500 border-green-500/50' :
                              'bg-gray-500/20 text-gray-500 border-gray-500/50'
                            }`}
                          >
                            {bounty.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 glass rounded-lg border border-secondary/20 bg-secondary/5">
                <p className="text-sm text-muted-foreground text-center">
                  <Lock className="w-4 h-4 inline mr-2 text-secondary" />
                  All bounty rewards are securely locked in a non-custodial smart contract. 
                  Payouts are automated based on investigation results.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 4 - How It Works */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <h2 className="text-2xl font-bold text-primary neon-text-cyan">How It Works</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 hidden md:block" style={{ transform: 'translateY(-50%)' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {[
                { icon: Wallet, title: "Connect Wallet", desc: "Link your Web3 wallet" },
                { icon: Lock, title: "Lock $100 USDT", desc: "Commitment fee" },
                { icon: FileText, title: "Choose Case", desc: "Submit evidence" },
                { icon: Users, title: "Contribute", desc: "Join investigation" },
                { icon: Zap, title: "Earn Bounty", desc: "From smart contract" },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center group-hover:border-primary/60 transition-all">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-xs text-primary font-mono mb-2">Step {index + 1}</div>
                      <h3 className="font-bold mb-2 text-sm">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                  {index < 4 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-primary/50 z-20" style={{ transform: 'translateY(-50%)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
            <CardContent className="p-12 relative z-10">
              <h2 className="text-3xl font-bold mb-4">
                Ready to <span className="text-primary neon-text-cyan">Fight Crime</span>?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of investigators tracking Web3 crimes and earning bounties for verified contributions.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold px-8"
              >
                Launch Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

      </main>
      
      <Footer />
    </div>
  )
}
