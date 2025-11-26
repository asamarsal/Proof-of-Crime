"use client"

import { useRef } from "react"
import { TrendingUp, Bell, Users, DollarSign, Brain, Filter, ArrowUpRight, AlertCircle, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { HandcuffsIcon } from "@/components/icons/handcuffs-icon"
import { PadlockIcon } from "@/components/icons/padlock-icon"

const trendingCases = [
  { id: "#CR-0847", type: "DeFi Exploit", amount: "$2.4M", risk: "Critical" },
  { id: "#CR-0846", type: "Rug Pull", amount: "$890K", risk: "High" },
  { id: "#CR-0845", type: "Phishing", amount: "$156K", risk: "Medium" },
]

const liveAlerts = [
  { time: "2m ago", msg: "Suspicious wallet activity detected", severity: "high" },
  { time: "5m ago", msg: "New bounty claimed: $25,000", severity: "low" },
  { time: "12m ago", msg: "AI flagged potential mixer usage", severity: "medium" },
]

const suspectProfiles = [
  { address: "0x7f4d...3b2a", score: 94, tag: "WANTED" },
  { address: "0x9c2e...8f1d", score: 87, tag: "SUSPECT" },
  { address: "0x3a1b...7e9c", score: 76, tag: "WATCHING" },
]

const bounties = [
  { title: "Bridge Exploit Alpha", reward: "$150,000", status: "Active" },
  { title: "NFT Wash Trading", reward: "$75,000", status: "Active" },
  { title: "Flash Loan Attack", reward: "$200,000", status: "Hot" },
]

export default function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8" id="dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
            <Activity className="w-3 h-3 mr-1" />
            Live Dashboard
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-foreground">Investigation </span>
            <span className="text-primary neon-text-cyan">Command Center</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time blockchain forensics powered by advanced AI analysis
          </p>
        </div>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
        >
          {/* Trending Cases - Large */}
          <div className="lg:col-span-2 lg:row-span-2 glass glass-hover rounded-2xl p-6 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Trending Cases</h3>
                </div>
                <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                  {trendingCases.length} Active
                </Badge>
              </div>
              <div className="space-y-4">
                {trendingCases.map((caseItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-background/30 hover:bg-background/50 transition-colors cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                        <HandcuffsIcon className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <div className="font-mono text-sm text-primary">{caseItem.id}</div>
                        <div className="text-sm text-muted-foreground">{caseItem.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{caseItem.amount}</div>
                      <Badge
                        variant="outline"
                        className={
                          caseItem.risk === "Critical"
                            ? "border-red-500 text-red-500"
                            : caseItem.risk === "High"
                              ? "border-orange-500 text-orange-500"
                              : "border-yellow-500 text-yellow-500"
                        }
                      >
                        {caseItem.risk}
                      </Badge>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Alerts */}
          <div className="glass glass-hover rounded-2xl p-6 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <Bell className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold">Live Alerts</h3>
              </div>
              <div className="space-y-3">
                {liveAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity === "high"
                          ? "bg-red-500 animate-pulse"
                          : alert.severity === "medium"
                            ? "bg-orange-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div>
                      <div className="text-sm text-foreground">{alert.msg}</div>
                      <div className="text-xs text-muted-foreground">{alert.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suspect Profiles */}
          <div className="glass glass-hover rounded-2xl p-6 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-destructive/10 rounded-full blur-2xl group-hover:bg-destructive/20 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <Users className="w-5 h-5 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold">Suspect Profiles</h3>
              </div>
              <div className="space-y-3">
                {suspectProfiles.map((suspect, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-mono text-sm text-muted-foreground">{suspect.address}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">{suspect.score}%</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          suspect.tag === "WANTED"
                            ? "border-red-500 text-red-500"
                            : suspect.tag === "SUSPECT"
                              ? "border-orange-500 text-orange-500"
                              : "border-yellow-500 text-yellow-500"
                        }`}
                      >
                        {suspect.tag}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bounties */}
          <div className="lg:col-span-2 glass glass-hover rounded-2xl p-6 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold">Active Bounties</h3>
                </div>
                <Badge className="bg-accent/20 text-accent border-accent/30">$425K Total</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {bounties.map((bounty, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-background/30 hover:bg-background/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={
                          bounty.status === "Hot" ? "border-red-500 text-red-500" : "border-green-500 text-green-500"
                        }
                      >
                        {bounty.status}
                      </Badge>
                      <PadlockIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium mb-1">{bounty.title}</div>
                    <div className="text-lg font-bold text-accent">{bounty.reward}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Risk Engine */}
          <div className="glass glass-hover rounded-2xl p-6 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 group-hover:from-primary/10 group-hover:to-secondary/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">AI Risk Engine</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Model Accuracy</span>
                  <span className="text-sm font-semibold text-primary">98.7%</span>
                </div>
                <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full w-[98.7%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  <span>Processing 1.2M tx/hour</span>
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Filters */}
          <div className="glass glass-hover rounded-2xl p-6 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-muted">
                  <Filter className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Chain Filters</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Ethereum", "BSC", "Polygon", "Arbitrum", "Solana"].map((chain) => (
                  <Badge
                    key={chain}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20 hover:border-primary/50 transition-colors"
                  >
                    {chain}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
