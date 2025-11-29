"use client"

import { X, ExternalLink, Users, Clock, Shield, AlertTriangle, CheckCircle2, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface BountyModalProps {
  isOpen: boolean
  onClose: () => void
  bounty?: {
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
      website?: string
      github?: string
      discord?: string
      telegram?: string
      description?: string
    }
    participants: any[]
    scope: string
  }
}


export default function BountyModal({ isOpen, onClose, bounty }: BountyModalProps) {
  if (!isOpen || !bounty) return null

  // Company details from API or use defaults
  const companyDetails = {
    logo: bounty.company.logo || "/placeholder-logo.png",
    name: bounty.company.name,
    website: bounty.company.website || "https://example.com",
    github: bounty.company.github || "https://github.com/example",
    discord: bounty.company.discord || "https://discord.gg/example",
    telegram: bounty.company.telegram || "https://t.me/example",
    description: bounty.company.description || "Leading decentralized exchange protocol."
  }

  const auditInfo = {
    totalReward: `$${bounty.totalReward.toLocaleString()}`,
    deadline: new Date(bounty.deadline).toLocaleDateString(),
    category: bounty.scope,
    participants: bounty.participants.length,
    objective: bounty.description
  }

  const scopeDetails = {
    inScope: [
      "Core AMM smart contracts (Solidity 0.8.x)",
      "Liquidity pool management logic",
      "Concentrated liquidity mechanisms",
      "Fee distribution system",
      "Oracle integration contracts"
    ],
    outOfScope: [
      "Frontend/UI vulnerabilities",
      "Off-chain infrastructure",
      "Third-party integrations",
      "Known issues in documentation",
      "Gas optimization suggestions"
    ]
  }

  const rewardBreakdown = [
    { severity: "Critical", reward: "$50,000", color: "text-red-500" },
    { severity: "High", reward: "$25,000", color: "text-orange-500" },
    { severity: "Medium", reward: "$10,000", color: "text-yellow-500" },
    { severity: "Low", reward: "$5,000", color: "text-blue-500" }
  ]

  const rules = [
    "All findings must be submitted with detailed proof of concept and reproduction steps",
    "Duplicate submissions will be rewarded to the first reporter only",
    "Findings must be kept confidential until the bounty period ends",
    "Automated scanner results without manual verification will not be accepted",
    "Participants must not exploit vulnerabilities beyond proof of concept",
    "All submissions must be made through the official platform",
    "Final reward amounts are subject to severity assessment by the security team"
  ]

  const handleJoinBounty = () => {
    // Handle join bounty logic
    console.log("Joining bounty:", bounty.id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="glass border-primary/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 fade-in duration-300 hide-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 glass border-b border-primary/20 p-6 flex items-start justify-between z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{bounty.title}</h2>
                <Badge 
                  variant="destructive" 
                  className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {bounty.severity}
                </Badge>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {bounty.company.name}
              </Badge>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Company Details */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-primary mr-3 rounded-full" />
                Company Details
              </h3>
              <div className="glass-hover rounded-xl p-5 border border-primary/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{companyDetails.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{companyDetails.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <a 
                        href={companyDetails.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Website
                      </a>
                      <a 
                        href={companyDetails.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GitHub
                      </a>
                      <a 
                        href={companyDetails.discord} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Discord
                      </a>
                      <a 
                        href={companyDetails.telegram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Telegram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bounty Information */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-secondary mr-3 rounded-full" />
                Bounty Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-muted-foreground">Total Reward</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{auditInfo.totalReward}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Deadline</span>
                  </div>
                  <p className="text-xl font-semibold">{auditInfo.deadline}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Category</span>
                  </div>
                  <p className="text-lg font-medium">{auditInfo.category}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Participants</span>
                  </div>
                  <p className="text-xl font-semibold">{auditInfo.participants} Auditors</p>
                </div>
              </div>
              <div className="mt-4 glass-hover rounded-xl p-4 border border-primary/10">
                <h4 className="font-semibold mb-2">Audit Objective</h4>
                <p className="text-sm text-muted-foreground">{auditInfo.objective}</p>
              </div>
            </section>

            {/* Scope */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-primary mr-3 rounded-full" />
                Audit Scope
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* In Scope */}
                <div className="glass-hover rounded-xl p-5 border border-green-500/20">
                  <h4 className="font-semibold mb-3 flex items-center text-green-400">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    In Scope
                  </h4>
                  <ul className="space-y-2">
                    {scopeDetails.inScope.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-green-400 mr-2 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Out of Scope */}
                <div className="glass-hover rounded-xl p-5 border border-red-500/20">
                  <h4 className="font-semibold mb-3 flex items-center text-red-400">
                    <X className="w-4 h-4 mr-2" />
                    Out of Scope
                  </h4>
                  <ul className="space-y-2">
                    {scopeDetails.outOfScope.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-red-400 mr-2 mt-0.5">✗</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Reward Breakdown */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-secondary mr-3 rounded-full" />
                Reward Breakdown
              </h3>
              <div className="glass-hover rounded-xl border border-primary/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary/5 border-b border-primary/10">
                    <tr>
                      <th className="text-left p-4 font-semibold">Severity Level</th>
                      <th className="text-right p-4 font-semibold">Reward Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardBreakdown.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-primary/5 last:border-0 hover:bg-primary/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className={`font-medium ${item.color}`}>{item.severity}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold text-green-400">{item.reward}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rules & Requirements */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-primary mr-3 rounded-full" />
                Rules & Requirements
              </h3>
              <div className="glass-hover rounded-xl p-5 border border-primary/10">
                <ol className="space-y-3">
                  {rules.map((rule, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="font-bold text-primary mr-3 mt-0.5">{index + 1}.</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 glass border-t border-primary/20 p-6 flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-primary/20 hover:bg-primary/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinBounty}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
            >
              Join Bounty Now
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
