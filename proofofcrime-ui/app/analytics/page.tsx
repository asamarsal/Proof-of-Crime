"use client"

import { useState, useEffect, useRef } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Terminal,
  Send,
  Bot,
  Activity,
  Settings
} from "lucide-react"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

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
      content:
        "Sniper Bot online. Connected to Lisk Sepolia Testnet. Monitoring mempool for anomalies. Ready for commands.",
      timestamp: new Date()
    }
  ])

  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (viewport) viewport.scrollTop = viewport.scrollHeight
    }
  }, [messages])

  // ⭐⭐⭐ HERE — GEMINI API IMPLEMENTATION ⭐⭐⭐
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

    try {
      const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY
      if (!API_KEY) throw new Error("Missing Gemini API Key")

      const GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

      // Request body
      const requestBody = {
        contents: [
          {
            parts: [{ text: input }]
          }
        ]
      }

      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) throw new Error("Gemini API Error")

      const data = await response.json()

      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Gemini returned empty response."

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error(err)
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: "system",
        content: "⚠️ Error: Could not reach Gemini API.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMsg])
    }

    setIsTyping(false)
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

          {/* LEFT PANEL */}
          <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-y-auto">

            <Card className="glass border-primary/30 shadow-lg">
              <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="w-5 h-5" />System Status</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between"><span>Gemini API</span><Badge className="bg-green-500/20 text-green-400">Online</Badge></div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 flex-1 min-h-[300px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-500" /> Network Activity
                </CardTitle>
                <CardDescription>Real-time transaction volume</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT PANEL - CHAT */}
          <div className="lg:col-span-2 h-full flex flex-col">
            <Card className="glass border-primary/20 flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold">Gemini Sniper AI</h2>
                    <p className="text-xs text-muted-foreground">Powered by Google Gemini Flash</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost"><Settings /></Button>
                  <Button size="icon" variant="ghost"><Terminal /></Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : msg.role === "system"
                          ? "bg-secondary/50 text-muted-foreground text-center border"
                          : "bg-secondary border"
                      }`}>
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-2 text-xs text-primary mb-1">
                            <Bot className="w-3 h-3" /> Gemini
                          </div>
                        )}
                        {msg.content}
                        <div className="text-[10px] mt-1 opacity-50">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-secondary px-4 py-3 rounded-xl border flex items-center gap-1">
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="relative flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Gemini..."
                    className="pr-12 h-12 rounded-xl"
                  />
                  <Button onClick={handleSendMessage} className="absolute right-1 top-1 h-10 w-10">
                    <Send className="w-4 h-4" />
                  </Button>
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
