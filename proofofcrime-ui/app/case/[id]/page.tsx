"use client"

import { useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, AlertTriangle, Activity, Users, DollarSign, FileText, ExternalLink, Share2 } from "lucide-react"
import Link from "next/link"
import { trendingCases } from "@/lib/data"

export default function CaseDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  
  const caseData = trendingCases.find(c => c.id === id)

  if (!caseData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h1 className="text-2xl font-bold mb-4">Case Not Found</h1>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Critical": return "text-red-500 border-red-500/50 bg-red-500/10"
      case "High": return "text-orange-500 border-orange-500/50 bg-orange-500/10"
      case "Medium": return "text-yellow-500 border-yellow-500/50 bg-yellow-500/10"
      default: return "text-green-500 border-green-500/50 bg-green-500/10"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">{caseData.name}</h1>
              <Badge variant="outline" className={`text-sm ${getRiskColor(caseData.risk)}`}>
                {caseData.risk} Risk
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                {caseData.type}
              </span>
              <span>•</span>
              <span>{caseData.blockchain}</span>
              <span>•</span>
              <span>ID: CASE-{caseData.id.toString().padStart(4, '0')}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report Update
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Case Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {caseData.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">Total Loss</div>
                    <div className="text-2xl font-bold text-red-500">{caseData.totalAmount}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">Victims</div>
                    <div className="text-2xl font-bold">{caseData.walletsInvolved}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                    <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                    <div className="text-2xl font-bold">{caseData.txVolume}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Investigation Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 border-l-2 border-primary/20 pl-6 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    <div className="text-sm text-muted-foreground mb-1">2 hours ago</div>
                    <h4 className="font-bold mb-1">Investigation Opened</h4>
                    <p className="text-sm text-muted-foreground">Case file created and assigned to senior investigator.</p>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-border border-4 border-background" />
                    <div className="text-sm text-muted-foreground mb-1">5 hours ago</div>
                    <h4 className="font-bold mb-1">Suspicious Activity Detected</h4>
                    <p className="text-sm text-muted-foreground">Large volume of tokens moved to mixer.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Risk Score Card */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-muted">
                    <div 
                      className={`absolute inset-0 rounded-full border-8 border-t-transparent border-r-transparent transform -rotate-45 ${
                        caseData.risk === 'Critical' ? 'border-red-500' :
                        caseData.risk === 'High' ? 'border-orange-500' :
                        'border-yellow-500'
                      }`} 
                    />
                    <div className="text-center">
                      <div className="text-3xl font-bold">{caseData.riskScore}</div>
                      <div className="text-xs text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Audit</span>
                    <span className="text-red-500 font-medium">Failed</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Liquidity Lock</span>
                    <span className="text-orange-500 font-medium">Unlocked</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Owner Privileges</span>
                    <span className="text-red-500 font-medium">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evidence Files */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Evidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm">Transaction_Log.csv</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      <span className="text-sm">Contract_Analysis.pdf</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
