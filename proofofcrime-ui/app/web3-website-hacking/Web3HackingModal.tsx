"use client"

import { X, ExternalLink, Users, Clock, Globe, AlertTriangle, CheckCircle2, Award, Code, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Web3HackingModalProps {
  isOpen: boolean
  onClose: () => void
  bounty: {
    id: number
    title: string
    company: string
    description: string
    reward: string
    severity: string
    scope: string
    participants: number
    deadline: string
    status: string
  }
}

export default function Web3HackingModal({ isOpen, onClose, bounty }: Web3HackingModalProps) {
  if (!isOpen) return null

  // Mock data - in production, this would come from props or API
  const projectDetails = {
    logo: "/placeholder-logo.png",
    name: bounty.company,
    website: "https://cryptoswap.io",
    dappUrl: "https://app.cryptoswap.io",
    githubFrontend: "https://github.com/cryptoswap/frontend",
    documentation: "https://docs.cryptoswap.io/web3-integration",
    discord: "https://discord.gg/cryptoswap",
    telegram: "https://t.me/cryptoswap",
    description: "Leading decentralized exchange with advanced Web3 integration and secure wallet connectivity."
  }

  const bountyInfo = {
    bountyId: `WEB3-${String(bounty.id).padStart(4, '0')}`,
    totalReward: bounty.reward,
    deadline: bounty.deadline,
    participants: bounty.participants,
    techStack: ["React", "Next.js", "Wagmi", "Ethers.js", "WalletConnect", "RainbowKit"],
    securityFocus: bounty.description
  }

  const inScopeAttacks = [
    "Cross-Site Scripting (XSS) in Web3 context",
    "Cross-Site Request Forgery (CSRF) on wallet interactions",
    "Clickjacking attacks on transaction approval",
    "Wallet draining vulnerabilities",
    "Transaction manipulation exploits",
    "Fake signature request attacks",
    "RPC endpoint hijacking",
    "Arbitrary signing exploits",
    "API manipulation affecting Web3 calls",
    "Front-running user transactions",
    "Phishing attacks via wallet popups"
  ]

  const outOfScope = [
    "Server hosting penetration testing",
    "Denial of Service (DoS) attacks",
    "Cosmetic UI/UX bugs",
    "Smart contract vulnerabilities (separate audit)",
    "Social engineering attacks",
    "Physical security issues",
    "Third-party service vulnerabilities"
  ]

  const rewardBreakdown = [
    { severity: "Critical", reward: "$15,000", color: "text-purple-400", description: "Wallet draining, arbitrary signing" },
    { severity: "High", reward: "$8,000", color: "text-pink-400", description: "Transaction manipulation, RPC hijacking" },
    { severity: "Medium", reward: "$3,000", color: "text-fuchsia-400", description: "XSS, CSRF, clickjacking" },
    { severity: "Low", reward: "$1,000", color: "text-violet-400", description: "Information disclosure, minor issues" }
  ]

  const rules = [
    "All findings must include detailed proof of concept with reproducible steps and video demonstration",
    "Vulnerabilities must be specific to Web3/blockchain integration, not general web security issues",
    "Do not attempt to drain real user funds or manipulate live transactions during testing",
    "Test only on provided staging/testnet environments - never on production with real assets",
    "Duplicate submissions will be rewarded to the first valid reporter with complete documentation",
    "Findings must be kept confidential until official disclosure timeline is announced",
    "Automated scanner results must be manually verified and demonstrated with working exploit",
    "Social engineering and phishing simulations require prior approval from the security team"
  ]

  const handleJoinBounty = () => {
    console.log("Joining Web3 Hacking bounty:", bounty.id)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="glass border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in zoom-in-95 fade-in duration-300 hide-scrollbar shadow-[0_0_50px_rgba(168,85,247,0.2)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 glass border-b border-purple-500/20 p-6 flex items-start justify-between z-10 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold text-foreground">{bounty.title}</h2>
                <Badge 
                  variant="destructive" 
                  className="bg-purple-500/10 text-purple-400 border-purple-500/30 px-3 py-1"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {bounty.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-pink-500/10 text-pink-400 border-pink-500/20">
                  {bounty.company}
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/20">
                  <Code className="w-3 h-3 mr-1" />
                  Web3 Website Hacking
                </Badge>
                <Badge variant="outline" className="bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20 font-mono text-xs">
                  ID: {bountyInfo.bountyId}
                </Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Project Details */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 mr-3 rounded-full" />
                Project Information
              </h3>
              <div className="glass-hover rounded-xl p-5 border border-purple-500/10 bg-gradient-to-br from-purple-900/5 to-pink-900/5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{projectDetails.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{projectDetails.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <a 
                        href={projectDetails.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Website
                      </a>
                      <a 
                        href={projectDetails.dappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        DApp URL
                      </a>
                      <a 
                        href={projectDetails.githubFrontend} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GitHub Repo
                      </a>
                      <a 
                        href={projectDetails.documentation} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Web3 Docs
                      </a>
                      <a 
                        href={projectDetails.discord} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Discord
                      </a>
                      <a 
                        href={projectDetails.telegram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1"
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
                <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 mr-3 rounded-full" />
                Bounty Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-hover rounded-xl p-4 border border-purple-500/10 bg-gradient-to-br from-purple-900/10 to-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-muted-foreground">Total Reward</span>
                  </div>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{bountyInfo.totalReward}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-pink-500/10 bg-gradient-to-br from-pink-900/10 to-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-pink-400" />
                    <span className="text-sm text-muted-foreground">Deadline</span>
                  </div>
                  <p className="text-xl font-semibold text-pink-300">{bountyInfo.deadline}</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-fuchsia-500/10 bg-gradient-to-br from-fuchsia-900/10 to-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-fuchsia-400" />
                    <span className="text-sm text-muted-foreground">Participants</span>
                  </div>
                  <p className="text-xl font-semibold text-fuchsia-300">{bountyInfo.participants} Hackers</p>
                </div>
                <div className="glass-hover rounded-xl p-4 border border-purple-500/10 bg-gradient-to-br from-purple-900/10 to-transparent">
                  <div className="flex items-center gap-3 mb-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-muted-foreground">Tech Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {bountyInfo.techStack.map((tech, index) => (
                      <span key={index} className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 glass-hover rounded-xl p-4 border border-purple-500/10 bg-gradient-to-br from-purple-900/5 to-pink-900/5">
                <h4 className="font-semibold mb-2 text-purple-300">Security Focus</h4>
                <p className="text-sm text-muted-foreground">{bountyInfo.securityFocus}</p>
              </div>
            </section>

            {/* Scope */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 mr-3 rounded-full" />
                Attack Scope
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* In Scope */}
                <div className="glass-hover rounded-xl p-5 border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-transparent">
                  <h4 className="font-semibold mb-3 flex items-center text-purple-400">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    In-Scope Web3 Attacks
                  </h4>
                  <ul className="space-y-2">
                    {inScopeAttacks.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-purple-400 mr-2 mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Out of Scope */}
                <div className="glass-hover rounded-xl p-5 border border-pink-500/20 bg-gradient-to-br from-pink-900/10 to-transparent">
                  <h4 className="font-semibold mb-3 flex items-center text-pink-400">
                    <X className="w-4 h-4 mr-2" />
                    Out of Scope
                  </h4>
                  <ul className="space-y-2">
                    {outOfScope.map((item, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-pink-400 mr-2 mt-0.5">✗</span>
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
                <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-purple-500 mr-3 rounded-full" />
                Reward Breakdown
              </h3>
              <div className="glass-hover rounded-xl border border-purple-500/10 overflow-hidden bg-gradient-to-br from-purple-900/5 to-pink-900/5">
                <table className="w-full">
                  <thead className="bg-purple-500/5 border-b border-purple-500/10">
                    <tr>
                      <th className="text-left p-4 font-semibold">Severity Level</th>
                      <th className="text-left p-4 font-semibold">Example Vulnerabilities</th>
                      <th className="text-right p-4 font-semibold">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardBreakdown.map((item, index) => (
                      <tr 
                        key={index} 
                        className="border-b border-purple-500/5 last:border-0 hover:bg-purple-500/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className={`font-medium ${item.color}`}>{item.severity}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{item.description}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{item.reward}</span>
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
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 mr-3 rounded-full" />
                Rules & Requirements
              </h3>
              <div className="glass-hover rounded-xl p-5 border border-purple-500/10 bg-gradient-to-br from-purple-900/5 to-pink-900/5">
                <ol className="space-y-3">
                  {rules.map((rule, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mr-3 mt-0.5">{index + 1}.</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 glass border-t border-purple-500/20 p-6 flex gap-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-purple-500/20 hover:bg-purple-500/5 text-purple-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinBounty}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all"
            >
              Join Bounty Now
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
