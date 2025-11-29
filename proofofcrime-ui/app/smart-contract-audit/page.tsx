"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Clock, Users, ArrowRight, CheckCircle } from "lucide-react"
import BountyModal from "./BountyModal"
import { useAccount } from "wagmi"

interface Bounty {
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
  }
  participants: any[]
  scope: string
}

export default function SmartContractAuditPage() {
  const { address } = useAccount()
  const [selectedBounty, setSelectedBounty] = useState<string | null>(null)
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [joinedBounties, setJoinedBounties] = useState<Set<string>>(new Set())

  // Load joined bounties from localStorage on mount
  useEffect(() => {
    if (address) {
      const savedJoined = localStorage.getItem(`joinedBounties_${address}`)
      if (savedJoined) {
        setJoinedBounties(new Set(JSON.parse(savedJoined)))
      }
    }
  }, [address])

  useEffect(() => {
    fetchBounties()
  }, [])

  const fetchBounties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://proof-of-crime-dogq.onrender.com'
      
      const response = await fetch(`${apiUrl}/api/bounties?category=SMART_CONTRACT_AUDIT`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Fetched bounties:', data)
      
      // Map data ke format yang sesuai
      const formattedBounties = data.bounties?.map((bounty: any) => ({
        id: bounty.id,
        bountyId: `AUDIT-${bounty.id.slice(0, 8)}`,
        title: bounty.title,
        description: bounty.description,
        category: bounty.category,
        totalReward: bounty.totalReward || 0,
        severity: bounty.severity || 'High',
        status: bounty.status || 'active',
        deadline: bounty.deadline,
        company: {
          name: bounty.company?.name || 'Unknown Company',
          logo: bounty.company?.logo,
        },
        participants: bounty.participants || [],
        scope: bounty.scope || 'Smart Contract Audit',
      })) || []

      setBounties(formattedBounties)
    } catch (error) {
      console.error('Error fetching bounties:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch bounties')
      // Fallback ke mock data jika API gagal
      setBounties([
        {
          id: '1',
          bountyId: 'AUDIT-001',
          title: 'DeFi Protocol Security Audit',
          description: 'Comprehensive security assessment of our DeFi lending protocol.',
          category: 'SMART_CONTRACT_AUDIT',
          totalReward: 150000,
          severity: 'Critical',
          status: 'active',
          deadline: '2025-12-10',
          company: { name: 'CryptoSwap DEX' },
          participants: [],
          scope: 'Smart Contract Audit',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Handle successful bounty join
  const handleBountyJoined = (bountyId: string) => {
    if (!address) return
    
    const updated = new Set(joinedBounties)
    updated.add(bountyId)
    setJoinedBounties(updated)
    
    // Save to localStorage
    localStorage.setItem(`joinedBounties_${address}`, JSON.stringify(Array.from(updated)))
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-primary neon-text-cyan">Smart Contract</span>{" "}
            <span className="text-secondary neon-text-magenta">Audit Bounties</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure the future of DeFi by auditing smart contracts and earning substantial rewards. 
            Find critical vulnerabilities before they are exploited.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="glass border-red-500/30 mb-8">
            <CardContent className="p-4">
              <p className="text-red-500 text-sm">⚠️ {error}</p>
              <p className="text-xs text-muted-foreground mt-1">Showing fallback data. Check if Render API is running.</p>
            </CardContent>
          </Card>
        )}

        {/* Tabs and Content */}
        <Tabs defaultValue="active" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 glass">
              <TabsTrigger 
                value="active"
                className="data-[state=active]:text-primary data-[state=active]:neon-text-cyan"
              >
                Active Bounties
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:text-primary data-[state=active]:neon-text-cyan"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading bounties...</p>
              </div>
            ) : bounties.length === 0 ? (
              <div className="text-center py-20 glass rounded-lg border border-dashed border-muted-foreground/20">
                <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-muted-foreground">No active bounties</h3>
                <p className="text-sm text-muted-foreground/60 mt-2">Check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {bounties.map((bounty) => (
                  <Card key={bounty.id} className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] group">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {bounty.company.name}
                        </Badge>
                        {joinedBounties.has(bounty.id) && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Already Joined
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {bounty.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {bounty.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Shield className="w-4 h-4 mr-2 text-primary" />
                          {bounty.scope}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2 text-secondary" />
                          {bounty.participants.length} Participants
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                          {new Date(bounty.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center font-bold text-green-400">
                          <span className="mr-2">💰</span>
                          ${bounty.totalReward.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => setSelectedBounty(bounty.id)}
                        className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      >
                        Join Bounty <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            <div className="text-center py-20 glass rounded-lg border border-dashed border-muted-foreground/20">
              <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-muted-foreground">No completed audits yet</h3>
              <p className="text-sm text-muted-foreground/60 mt-2">Check back later for historical data.</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="glass p-8 rounded-2xl border border-primary/20 max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-secondary/5" />
            <h2 className="text-2xl font-bold mb-4 relative z-10">Need an Audit?</h2>
            <p className="text-muted-foreground mb-6 relative z-10">
              Ensure your protocol is secure before launch. Our community of top-tier security researchers is ready to help.
            </p>
            <Button size="lg" className="relative z-10">
              Talk with Us
            </Button>
          </div>
        </div>
      </main>

      {/* Bounty Modal */}
      {selectedBounty !== null && (
        <BountyModal
          isOpen={selectedBounty !== null}
          onClose={() => setSelectedBounty(null)}
          bounty={bounties.find(b => b.id === selectedBounty)}
          onBountyJoined={handleBountyJoined}
        />
      )}
    </div>
  )
}
