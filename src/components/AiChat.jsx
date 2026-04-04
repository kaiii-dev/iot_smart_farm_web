import { useState, useRef, useEffect } from 'react'
import { Bot, Send, AlertTriangle, CheckCircle, Droplets, Thermometer, Info } from 'lucide-react'

function MarkdownMessage({ content }) {
  const lines = content.split('\n')

  function parseLine(line, key) {
    // Bullet point
    const bulletMatch = line.match(/^[-*•]\s+(.+)/)
    if (bulletMatch) {
      return (
        <li key={key} className="flex items-start gap-2 my-0.5">
          <span className="text-farm-primary mt-1.5 flex-shrink-0">•</span>
          <span>{parseInline(bulletMatch[1])}</span>
        </li>
      )
    }
    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s+(.+)/)
    if (numMatch) {
      return (
        <li key={key} className="flex items-start gap-2 my-0.5">
          <span className="text-farm-primary font-semibold flex-shrink-0 min-w-[1rem]">{numMatch[1]}.</span>
          <span>{parseInline(numMatch[2])}</span>
        </li>
      )
    }
    // Heading (### or ##)
    const headingMatch = line.match(/^#{1,3}\s+(.+)/)
    if (headingMatch) {
      return <p key={key} className="font-bold text-farm-primary mt-2 mb-1">{headingMatch[1]}</p>
    }
    // Empty line
    if (line.trim() === '') return <br key={key} />
    // Normal line
    return <p key={key} className="my-0.5">{parseInline(line)}</p>
  }

  function parseInline(text) {
    // Split on **bold**, *italic*, `code`, and keyword highlights
    const parts = []
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
    let last = 0
    let match
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push(text.slice(last, match.index))
      const raw = match[0]
      if (raw.startsWith('**')) {
        const inner = raw.slice(2, -2)
        // Color-code sensor keywords in bold
        const color = getSensorColor(inner)
        parts.push(
          <strong key={match.index} className={`font-semibold ${color}`}>{inner}</strong>
        )
      } else if (raw.startsWith('*')) {
        parts.push(<em key={match.index} className="italic text-farm-muted">{raw.slice(1, -1)}</em>)
      } else if (raw.startsWith('`')) {
        parts.push(
          <code key={match.index} className="bg-farm-bg text-farm-primary px-1.5 py-0.5 rounded text-xs font-mono">
            {raw.slice(1, -1)}
          </code>
        )
      }
      last = match.index + raw.length
    }
    if (last < text.length) parts.push(text.slice(last))
    return parts.length ? parts : text
  }

  function getSensorColor(text) {
    const t = text.toLowerCase()
    if (t.includes('soil') || t.includes('moisture')) return 'text-blue-400'
    if (t.includes('ph') || t.includes('acid') || t.includes('alkalin')) return 'text-purple-400'
    if (t.includes('temp') || t.includes('heat') || t.includes('hot') || t.includes('cold')) return 'text-orange-400'
    if (t.includes('humid')) return 'text-teal-400'
    if (t.includes('water') || t.includes('tank') || t.includes('pump')) return 'text-red-400'
    if (t.includes('warn') || t.includes('critical') || t.includes('error') || t.includes('attention')) return 'text-yellow-400'
    if (t.includes('good') || t.includes('optimal') || t.includes('normal') || t.includes('healthy')) return 'text-farm-primary'
    return 'text-white'
  }

  // Group consecutive bullet/numbered lines into a list
  const elements = []
  let listBuffer = []
  let listType = null

  lines.forEach((line, i) => {
    const isBullet = /^[-*•]\s+/.test(line)
    const isNum = /^\d+\.\s+/.test(line)
    const currentType = isBullet ? 'ul' : isNum ? 'ol' : null

    if (currentType) {
      if (listType && listType !== currentType) {
        elements.push(listType === 'ul'
          ? <ul key={`ul-${i}`} className="list-none space-y-0.5 my-1">{listBuffer}</ul>
          : <ol key={`ol-${i}`} className="list-none space-y-0.5 my-1">{listBuffer}</ol>
        )
        listBuffer = []
      }
      listType = currentType
      listBuffer.push(parseLine(line, i))
    } else {
      if (listBuffer.length) {
        elements.push(listType === 'ul'
          ? <ul key={`ul-${i}`} className="list-none space-y-0.5 my-1">{listBuffer}</ul>
          : <ol key={`ol-${i}`} className="list-none space-y-0.5 my-1">{listBuffer}</ol>
        )
        listBuffer = []
        listType = null
      }
      elements.push(parseLine(line, i))
    }
  })

  if (listBuffer.length) {
    elements.push(listType === 'ul'
      ? <ul key="ul-end" className="list-none space-y-0.5 my-1">{listBuffer}</ul>
      : <ol key="ol-end" className="list-none space-y-0.5 my-1">{listBuffer}</ol>
    )
  }

  return <div className="text-sm leading-relaxed space-y-0.5">{elements}</div>
}

const STARTER_PROMPTS = [
  'How are my crops doing?',
  'Should I water now?',
  "What's my soil pH telling me?",
]

const MODEL = 'claude-haiku-4-5-20251001'

function buildSystemPrompt({ cropType, liveData, sensorHealth, pumpStatus, deviceOnline }) {
  const soil = liveData?.soil != null ? `${parseFloat(liveData.soil).toFixed(1)}` : 'N/A'
  const ph = liveData?.ph != null ? `${parseFloat(liveData.ph).toFixed(1)}` : 'N/A'
  const temp = liveData?.temp != null ? `${parseFloat(liveData.temp).toFixed(1)}` : 'N/A'
  const humidity = liveData?.humidity != null ? `${parseFloat(liveData.humidity).toFixed(1)}` : 'N/A'
  const waterLevel = liveData?.waterLevel != null ? `${parseFloat(liveData.waterLevel).toFixed(1)}` : 'N/A'

  let lastSeenStr = 'Unknown'
  if (liveData?.lastSeen) {
    const dt = new Date(liveData.lastSeen * 1000)
    lastSeenStr = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
  }

  const soilHealth = sensorHealth?.soil ?? 'unknown'
  const phHealth = sensorHealth?.ph ?? 'unknown'
  const waterHealth = sensorHealth?.waterLevel ?? 'unknown'

  return `You are an agricultural AI advisor for a smart farm IoT monitoring system.

DEVICE STATUS:
- Connection: ${deviceOnline ? 'ONLINE (live data)' : `OFFLINE (last seen: ${lastSeenStr})`}
- Pump: ${pumpStatus ?? 'unknown'}

LIVE SENSOR READINGS:
- Soil Moisture: ${soil}% [sensor: ${soilHealth}]
- pH Level: ${ph} [sensor: ${phHealth}]
- Temperature: ${temp}°C
- Humidity: ${humidity}%
- Water Tank Level: ${waterLevel}% [sensor: ${waterHealth}]

CROP: ${cropType ?? 'Unknown'}

INSTRUCTIONS:
- If the device is OFFLINE, mention that readings may be outdated and advise checking the connection.
- If any sensor health is "error", flag it and advise the user to check that sensor.
- Give practical, concise advice in 2-4 sentences based on the actual readings above.
- If a reading is N/A, give general advice for ${cropType ?? 'the crop'} instead.`
}

export default function AiChat({ cropType, liveData, sensorHealth, pumpStatus, deviceOnline }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return

    const userMsg = { role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 400,
          system: buildSystemPrompt({ cropType, liveData, sensorHealth, pumpStatus, deviceOnline }),
          messages: updatedMessages,
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `Error ${res.status}`)
      }

      const data = await res.json()
      const reply = data.content?.[0]?.text ?? 'No response received.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Sorry, I encountered an error: ${err.message}` },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100vh-200px)] min-h-[350px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="w-16 h-16 bg-farm-primary/10 rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-farm-primary" />
            </div>
            <div>
              <p className="text-white font-semibold mb-1">AI Crop Advisor</p>
              <p className="text-farm-muted text-sm">Ask me anything about your farm</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="px-3 py-1.5 rounded-full border border-farm-border text-farm-muted hover:border-farm-primary hover:text-farm-primary text-sm transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 bg-farm-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-farm-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-farm-primary text-farm-bg font-medium rounded-tr-sm text-sm leading-relaxed'
                  : 'bg-farm-surface2 text-white rounded-tl-sm'
              }`}
            >
              {msg.role === 'user'
                ? msg.content
                : <MarkdownMessage content={msg.content} />
              }
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 bg-farm-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-farm-primary" />
            </div>
            <div className="bg-farm-surface2 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-farm-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-farm-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-farm-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-farm-border">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your crops..."
          disabled={isLoading}
          className="flex-1 bg-farm-surface2 border border-farm-border rounded-xl px-4 py-3 text-sm text-white placeholder-farm-muted focus:outline-none focus:border-farm-primary transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="w-11 h-11 bg-farm-primary rounded-xl flex items-center justify-center text-farm-bg hover:opacity-90 disabled:opacity-40 transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
