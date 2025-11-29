"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Clock, Users, ArrowRight, CheckCircle, Globe, AlertTriangle } from "lucide-react"
import Web3HackingModal from "./Web3HackingModal"

export default function Web3WebsiteHackingPage() {
  const [selectedBounty, setSelectedBounty] = useState<string | number | null>(null)
  const [bounties, setBounties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        const response = await fetch('https://proof-of-crime-dogq.onrender.com/api/bounties?category=WEB3_WEBSITE_HACKING')
        const data = await response.json()
        if (data.bounties) {
          const mappedBounties = data.bounties.map((b: any) => ({
            id: b.id,
            title: b.title,
            company: b.company.name,
            description: b.description,
            reward: `$${parseInt(b.totalReward).toLocaleString()}`,
            severity: b.severity.charAt(0).toUpperCase() + b.severity.slice(1).toLowerCase(),
            scope: b.scope,
            participants: b._count.participants,
            deadline: new Date(b.deadline).toISOString().split('T')[0],
            status: b.status.toLowerCase(),
          }))
          setBounties(mappedBounties)
        }
      } catch (error) {
        console.error('Error fetching bounties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBounties()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-primary neon-text-cyan">Web3 Website</span>{" "}
            <span className="text-secondary neon-text-magenta">Hacking Bounties</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover security flaws in Web3 platforms and decentralized applications. 
            Help secure the future of blockchain technology and earn substantial rewards.
          </p>
        </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {bounties.map((bounty) => (
                <Card key={bounty.id} className="glass border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {bounty.company}
                      </Badge>
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
                        <Globe className="w-4 h-4 mr-2 text-primary" />
                        {bounty.scope}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-2 text-secondary" />
                        {bounty.participants} Participants
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                        {bounty.deadline}
                      </div>
                      <div className="flex items-center font-bold text-green-400">
                        <span className="mr-2">💰</span>
                        {bounty.reward}
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
            <h2 className="text-2xl font-bold mb-4 relative z-10">Need a Security Audit?</h2>
            <p className="text-muted-foreground mb-6 relative z-10">
              Ensure your Web3 platform is secure before launch. Our community of expert security researchers is ready to help identify vulnerabilities.
            </p>
            <Button size="lg" className="relative z-10">
              Talk with Us
            </Button>
          </div>
        </div>
      </main>

      {/* Web3 Hacking Modal */}
      {selectedBounty !== null && (
        <Web3HackingModal
          isOpen={selectedBounty !== null}
          onClose={() => setSelectedBounty(null)}
          bounty={bounties.find(b => b.id === selectedBounty)!}
        />
      )}
    </div>
  )
}
