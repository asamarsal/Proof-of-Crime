"use client"

import { useState, useEffect, useRef } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Terminal, 
  Send, 
  Bot, 
  Cpu, 
  Activity, 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Settings,
  Zap,
  LineChart,
  Lock
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

// Mock data for the chart
const data = [
  { time: "00:00", value: 400 },
  { time: "04:00", value: 300 },
  { time: "08:00", value: 550 },
  { time: "12:00", value: 450 },
  { time: "16:00", value: 600 },
  { time: "20:00", value: 700 },
  { time: "24:00", value: 850 },
]

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export default function AnalyticsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "system",
      content: "Initializing Sniper Bot v1.0.2...",
      timestamp: new Date()
    },
    {
      id: "2",
      role: "assistant",
      content: "Sniper Bot online. Connected to Solana mainnet. Monitoring mempool for anomalies. Ready for commands.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isConnected, setIsConnected] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate ElizaOS processing delay
    setTimeout(() => {
      let responseText = ""
      const lowerInput = userMsg.content.toLowerCase()

      if (lowerInput.includes("scan") || lowerInput.includes("analyze")) {
        responseText = "Scanning target contract... \n\nAnalysis Complete:\n- Liquidity: $45,200 (Locked)\n- Mint Authority: Disabled\n- Freeze Authority: Disabled\n- Top 10 Holders: 12%\n\nRisk Score: LOW (Safe to ape)"
      } else if (lowerInput.includes("rug") || lowerInput.includes("scam")) {
        responseText = "ALERT: Detected suspicious pattern in recent deployment 0x7f...3a21. Liquidity removed 30 seconds after launch. Marking as CONFIRMED RUGPULL."
      } else if (lowerInput.includes("help")) {
        responseText = "Available commands:\n/scan [address] - Analyze token security\n/monitor - Start real-time mempool monitoring\n/snipe [address] [amount] - Execute snipe trade\n/status - System status report"
      } else {
        responseText = "Command received. Processing request on-chain... \n(Note: This is a simulation. To connect to a real ElizaOS instance, configure the backend endpoint.)"
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full h-[calc(100vh-6rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          
          {/* Left Panel - Analytics & Status */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-y-auto">
            {/* Status Card */}
            <Card className="glass border-primary/30 shadow-lg shadow-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ElizaOS Core</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sniper Plugin</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Solana RPC</span>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                      98ms Latency
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>CPU Usage</span>
                      <span>24%</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[24%] rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Activity Chart */}
            <Card className="glass border-border/50 flex-1 min-h-[300px]">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-500" />
                  Network Activity
                </CardTitle>
                <CardDescription>Real-time transaction volume</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Center/Right Panel - Chat Interface */}
          <div className="lg:col-span-2 h-full flex flex-col">
            <Card className="glass border-primary/20 flex flex-col h-full shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 bg-background/50 flex items-center justify-between backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg flex items-center gap-2">
                      Sniper Bot
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5">v1.0.2</Badge>
                    </h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      ElizaOS Agent Active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Terminal className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`
                          max-w-[80%] rounded-2xl px-4 py-3 text-sm
                          ${msg.role === "user" 
                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                            : msg.role === "system"
                            ? "bg-secondary/50 text-muted-foreground font-mono text-xs w-full text-center border border-border/50"
                            : "bg-secondary text-secondary-foreground rounded-tl-none border border-border/50"
                          }
                        `}
                      >
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-2 mb-1 text-xs text-primary font-semibold opacity-70">
                            <Bot className="w-3 h-3" />
                            Sniper
                          </div>
                        )}
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>
                        <div className={`text-[10px] mt-1 opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tl-none px-4 py-3 border border-border/50 flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 bg-background/50 border-t border-border/50 backdrop-blur-md">
                <div className="relative flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a command (e.g., /scan, /analyze)..."
                    className="pr-12 bg-secondary/50 border-primary/20 focus:border-primary/50 h-12 rounded-xl"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {["/scan", "/monitor", "/status", "Analyze recent rugpulls"].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => setInput(cmd)}
                      className="text-xs px-3 py-1 rounded-full bg-secondary/50 hover:bg-primary/20 border border-border/50 hover:border-primary/30 transition-colors whitespace-nowrap"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
