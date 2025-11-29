"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Shield, Users } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { smartcontractbountyAbi } from "@/app/abi/smartcontractbountyAbi"
import { liskSepolia } from "@/config"

interface Bounty {
  id: string
  bountyId: string
  title: string
  totalReward: number
  company: {
    name: string
  }
  evaluated: boolean
  vaultOpened: boolean
  approvalCount?: number
  participants: any[]
}

export default function ManageBountyPage() {
  const { address, isConnected } = useAccount()
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)

  // Evaluation form
  const [selectedBountyId, setSelectedBountyId] = useState("")
  const [hunterWinner, setHunterWinner] = useState("")
  const [severity, setSeverity] = useState("")

  const BOUNTY_CONTRACT_ADDRESS = "0xF439FbFC5a1BF5B70D87E6680b83F2328cF69279"

  // Evaluate bounty
  const { 
    data: evaluateHash, 
    writeContract: writeEvaluate,
    isPending: isEvaluatePending 
  } = useWriteContract()

  const { isLoading: isEvaluateConfirming, isSuccess: isEvaluateSuccess } = 
    useWaitForTransactionReceipt({ hash: evaluateHash })

  // Approve vault
  const { 
    data: approveHash, 
    writeContract: writeApprove,
    isPending: isApprovePending 
  } = useWriteContract()

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = 
    useWaitForTransactionReceipt({ hash: approveHash })

  useEffect(() => {
    fetchBounties()
  }, [])

  useEffect(() => {
    if (isEvaluateSuccess) {
      alert("Bounty evaluated successfully!")
      fetchBounties()
    }
  }, [isEvaluateSuccess])

  useEffect(() => {
    if (isApproveSuccess) {
      alert("Vault approved successfully!")
      fetchBounties()
    }
  }, [isApproveSuccess])

  const fetchBounties = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://proof-of-crime-dogq.onrender.com'
      const response = await fetch(`${apiUrl}/api/bounties?category=SMART_CONTRACT_AUDIT`)
      if (response.ok) {
        const data = await response.json()
        setBounties(data.bounties || [])
      }
    } catch (error) {
      console.error('Error fetching bounties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEvaluate = async () => {
    if (!isConnected) {
      alert("Please connect your wallet!")
      return
    }

    if (!selectedBountyId || !hunterWinner || !severity) {
      alert("Please fill in all fields!")
      return
    }

    try {
      const bountyIdNum = parseInt(selectedBountyId)
      const severityNum = severity === "Low" ? 1 : severity === "Medium" ? 2 : 3

      writeEvaluate({
        address: BOUNTY_CONTRACT_ADDRESS,
        abi: smartcontractbountyAbi,
        functionName: 'evaluateBounty',
        args: [BigInt(bountyIdNum), hunterWinner as `0x${string}`, severityNum],
        chainId: liskSepolia.id,
      })
    } catch (err) {
      console.error('Error evaluating bounty:', err)
      alert('Failed to evaluate: ' + (err as any).message)
    }
  }

  const handleApprove = async (bountyId: string) => {
    if (!isConnected) {
      alert("Please connect your wallet!")
      return
    }

    try {
      const bountyIdNum = parseInt(bountyId)

      writeApprove({
        address: BOUNTY_CONTRACT_ADDRESS,
        abi: smartcontractbountyAbi,
        functionName: 'approveVault',
        args: [BigInt(bountyIdNum)],
        chainId: liskSepolia.id,
      })
    } catch (err) {
      console.error('Error approving vault:', err)
      alert('Failed to approve: ' + (err as any).message)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Manage Bounties
          </h1>
          <p className="text-muted-foreground">
            Evaluate submissions and approve vault distributions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Evaluate Bounty */}
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Evaluate Bounty (Owner Only)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Bounty</label>
                <Select value={selectedBountyId} onValueChange={setSelectedBountyId}>
                  <SelectTrigger className="bg-background/50 border-primary/20">
                    <SelectValue placeholder="Select a bounty to evaluate" />
                  </SelectTrigger>
                  <SelectContent>
                    {bounties.filter(b => !b.evaluated).map((bounty) => (
                      <SelectItem key={bounty.id} value={bounty.id}>
                        {bounty.bountyId}: {bounty.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Winner Address</label>
                <Input
                  value={hunterWinner}
                  onChange={(e) => setHunterWinner(e.target.value)}
                  placeholder="0x..."
                  className="bg-background/50 border-primary/20"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger className="bg-background/50 border-primary/20">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleEvaluate}
                disabled={!isConnected || isEvaluatePending || isEvaluateConfirming}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isEvaluatePending || isEvaluateConfirming ? "Evaluating..." : "Evaluate Bounty"}
              </Button>
            </CardContent>
          </Card>

          {/* Bounties List */}
          <Card className="glass border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Bounties Pending Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-muted-foreground text-center py-4">Loading bounties...</p>
                ) : bounties.filter(b => b.evaluated && !b.vaultOpened).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No bounties pending approval</p>
                ) : (
                  bounties.filter(b => b.evaluated && !b.vaultOpened).map((bounty) => (
                    <div key={bounty.id} className="glass-hover rounded-lg p-4 border border-primary/10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{bounty.title}</h3>
                          <p className="text-sm text-muted-foreground">{bounty.company.name}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Evaluated
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <span className="text-muted-foreground">
                          Reward: <span className="text-green-400 font-bold">${bounty.totalReward.toLocaleString()}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Approvals: <span className="text-primary font-bold">{bounty.approvalCount || 0}/3</span>
                        </span>
                      </div>

                      <Button
                        onClick={() => handleApprove(bounty.id)}
                        disabled={!isConnected || isApprovePending || isApproveConfirming}
                        className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                        variant="outline"
                      >
                        {isApprovePending || isApproveConfirming ? "Approving..." : "Approve Vault"}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Bounties */}
        <Card className="glass border-primary/20 mt-8">
          <CardHeader>
            <CardTitle>All Bounties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {bounties.map((bounty) => (
                <div key={bounty.id} className="glass-hover rounded-lg p-4 border border-primary/10 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{bounty.bountyId}: {bounty.title}</h3>
                    <p className="text-sm text-muted-foreground">{bounty.company.name} - ${bounty.totalReward.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {bounty.evaluated ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Evaluated
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Pending Evaluation
                      </Badge>
                    )}
                    {bounty.vaultOpened && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Vault Opened
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
