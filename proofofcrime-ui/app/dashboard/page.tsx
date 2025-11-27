"use client"

import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Activity, AlertCircle, DollarSign, Clock, Users, Shield } from "lucide-react"

export default function DashboardPage() {
  // Mock Data for Trending Cases
  const trendingCases = [
    {
      id: 1,
      name: "SQUID Token",
      type: "Rugpull",
      risk: "Critical",
      riskScore: 98,
      totalAmount: "$3.3M",
      walletsInvolved: "12.5k",
      txVolume: "45.2k",
      blockchain: "BSC",
      description: "Play-to-earn game token that prevented selling, developers vanished with funds",
    },
    {
      id: 2,
      name: "SafeMoon V2",
      type: "Pump & Dump",
      risk: "High",
      riskScore: 87,
      totalAmount: "$1.2M",
      walletsInvolved: "8.3k",
      txVolume: "32.1k",
      blockchain: "BSC",
      description: "Coordinated pump and dump scheme targeting retail investors",
    },
    {
      id: 3,
      name: "Tornado Cash",
      type: "Money Laundering",
      risk: "High",
      riskScore: 92,
      totalAmount: "$100M+",
      walletsInvolved: "50k+",
      txVolume: "200k+",
      blockchain: "Ethereum",
      description: "Cryptocurrency mixer used for laundering stolen funds",
    },
    {
      id: 4,
      name: "Solana Monkey Business",
      type: "NFT Scam",
      risk: "Medium",
      riskScore: 65,
      totalAmount: "$500k",
      walletsInvolved: "2.1k",
      txVolume: "5.8k",
      blockchain: "Solana",
      description: "Fake NFT collection with plagiarized artwork",
    },
    {
      id: 5,
      name: "Tron Supernode",
      type: "Phishing",
      risk: "High",
      riskScore: 78,
      totalAmount: "$2M",
      walletsInvolved: "5.6k",
      txVolume: "18.9k",
      blockchain: "Tron",
      description: "Phishing campaign targeting Tron wallet users",
    },
    {
      id: 6,
      name: "AnubisDAO",
      type: "Rugpull",
      risk: "Critical",
      riskScore: 95,
      totalAmount: "$60M",
      walletsInvolved: "15k",
      txVolume: "25k",
      blockchain: "Ethereum",
      description: "DeFi protocol rugpull within 24 hours of launch",
    },
  ]

  // Mock Data for Live Feed
  const liveFeed = [
    { id: 1, address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", action: "Large Transfer", amount: "500 ETH", time: "2 mins ago", risk: "High", chain: "ETH" },
    { id: 2, address: "0x3b3ae790Df4F312e745D270119c6052904FB6790", action: "Contract Deploy", amount: "-", time: "5 mins ago", risk: "Medium", chain: "BSC" },
    { id: 3, address: "0x1d85568eEAbad713fBB5293B45ea066e552A90De", action: "Mixer Deposit", amount: "10 BTC", time: "12 mins ago", risk: "Critical", chain: "BTC" },
    { id: 4, address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", action: "Token Mint", amount: "1B TOK", time: "15 mins ago", risk: "Low", chain: "ETH" },
    { id: 5, address: "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f", action: "Liquidity Remove", amount: "$200k", time: "20 mins ago", risk: "High", chain: "ETH" },
    { id: 6, address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", action: "Suspicious Swap", amount: "100 WBTC", time: "25 mins ago", risk: "Medium", chain: "ETH" },
    { id: 7, address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", action: "Mass Transfer", amount: "$1.5M USDT", time: "30 mins ago", risk: "High", chain: "ETH" },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "bg-red-500"
      case "High":
        return "bg-orange-500"
      case "Medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getRiskTextColor = (risk: string) => {
    switch (risk) {
      case "Critical":
        return "text-red-500"
      case "High":
        return "text-orange-500"
      case "Medium":
        return "text-yellow-500"
      default:
        return "text-green-500"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Track Web3's <span className="text-primary neon-text-cyan">Dark Side</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Uncover criminal activities across blockchains. Monitor pump & dump schemes, rugpulls, NFT scams, money laundering, and terrorism financing in real-time.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search by address, transaction hash, or case name..." 
                className="pl-12 h-14 text-base bg-card/50 border-border focus:border-primary/50"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Shield className="w-4 h-4 mr-2" />
              Blockchain
            </Button>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              <AlertCircle className="w-4 h-4 mr-2" />
              Crime Categories
            </Button>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Clock className="w-4 h-4 mr-2" />
              Time Range
            </Button>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              Verified Cases Only
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Total Cases</div>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">1,248</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="glass border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Total Volume</div>
                <DollarSign className="w-4 h-4 text-secondary" />
              </div>
              <div className="text-3xl font-bold text-secondary">$42.5M</div>
              <p className="text-xs text-muted-foreground mt-1">Suspected illicit funds</p>
            </CardContent>
          </Card>
          
          <Card className="glass border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Active Alerts</div>
                <AlertCircle className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-500">342</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card className="glass border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">Wallets Tracked</div>
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500">125k</div>
              <p className="text-xs text-muted-foreground mt-1">Across all chains</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trending Cases */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Trending Cases
              </h2>
              <Button variant="link" className="text-primary">View All →</Button>
            </div>
            
            <div className="space-y-4">
              {trendingCases.map((item) => (
                <Card key={item.id} className="glass border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Risk Indicator */}
                      <div className={`w-1.5 h-20 rounded-full ${getRiskColor(item.risk)} flex-shrink-0`} />
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary">{item.type}</Badge>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{item.blockchain}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${getRiskTextColor(item.risk)}`}>
                              Risk Score: {item.riskScore}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground text-xs">Total Amount</div>
                            <div className="font-bold text-foreground">{item.totalAmount}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Wallets</div>
                            <div className="font-bold text-foreground">{item.walletsInvolved}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Transactions</div>
                            <div className="font-bold text-foreground">{item.txVolume}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Live Feed */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-500" />
                Live Feed
              </h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>

            <Card className="glass border-border/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border/30 max-h-[800px] overflow-y-auto">
                  {liveFeed.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-muted/5 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs text-primary truncate pr-2">{item.address}</span>
                        <Badge variant="outline" className="text-[10px] border-muted-foreground/30 text-muted-foreground flex-shrink-0">
                          {item.chain}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.action}</span>
                        <span className="text-sm font-bold">{item.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] h-5 px-2 ${
                            item.risk === 'Critical' ? 'border-red-500/50 text-red-500' : 
                            item.risk === 'High' ? 'border-orange-500/50 text-orange-500' : 
                            item.risk === 'Medium' ? 'border-yellow-500/50 text-yellow-500' :
                            'border-green-500/50 text-green-500'
                          }`}
                        >
                          {item.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
