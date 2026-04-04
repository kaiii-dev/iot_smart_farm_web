import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// ─── App Screenshots (sorted alphabetically by filename) ──────
const _screenshotModules = import.meta.glob(
  '../assets/app-preview/*.jpeg',
  { eager: true }
)
const APP_SCREENSHOTS = Object.entries(_screenshotModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => mod.default)

import {
  Leaf, Menu, X, Download, LogIn, UserPlus, ChevronDown,
  Droplets, Cpu, CloudSun, Bot, Wifi, Activity, Zap, Shield,
  CheckCircle, ExternalLink, ArrowRight, Smartphone, Settings,
  BarChart3, Thermometer,
} from 'lucide-react'

// ─── Config ──────────────────────────────────────────────────
const APK_URL = 'https://drive.google.com/uc?export=download&id=1mjnvoelnVVTWk8fdPntIBN2V0wVoyXG1'
const GITHUB_URL = 'https://github.com/Kaiszee/iot_smart_farm_app'
const TEAM_NAME = 'Team Ezuran'
const TEAM_MEMBERS = ['Hakimi Lizam', 'Mirza Zafri', 'Ikmal Mohmad']

// ─── Hook: scroll animation ───────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function AnimatedSection({ children, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-farm-bg/95 backdrop-blur border-b border-farm-border shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-farm-primary rounded-lg p-1.5">
              <Leaf className="w-5 h-5 text-farm-bg" />
            </div>
            <span className="text-xl font-bold text-white">AgroEzuran</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/demo" className="relative text-farm-muted hover:text-white transition-colors text-sm px-3 py-1.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-farm-primary after:transition-all after:duration-300 hover:after:w-full">Demo</Link>
            <a href="#features" className="relative text-farm-muted hover:text-white transition-colors text-sm px-3 py-1.5 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-farm-primary after:transition-all after:duration-300 hover:after:w-full">Features</a>
            <Link to="/login" className="flex items-center gap-1.5 text-farm-muted hover:text-white border border-farm-border rounded-lg px-3 py-1.5 text-sm transition-all duration-200 hover:border-farm-primary/50 hover:bg-white/5 hover:-translate-y-0.5">
              <LogIn className="w-4 h-4" /> Login
            </Link>
            <Link to="/register" className="flex items-center gap-1.5 bg-farm-primary text-farm-bg font-semibold rounded-lg px-4 py-1.5 text-sm hover:bg-farm-primary/90 transition-all duration-200 hover:-translate-y-0.5 glow-sm">
              <UserPlus className="w-4 h-4" /> Get Started
            </Link>
          </div>
          <button className="md:hidden text-farm-muted hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-farm-surface border-t border-farm-border px-4 py-4 flex flex-col gap-3 animate-slideDown">
          <Link to="/demo" className="text-farm-muted hover:text-white py-2" onClick={() => setOpen(false)}>Demo</Link>
          <a href="#features" className="text-farm-muted hover:text-white py-2" onClick={() => setOpen(false)}>Features</a>
          <Link to="/login" className="flex items-center gap-2 border border-farm-border rounded-lg px-4 py-2 text-sm">
            <LogIn className="w-4 h-4" /> Login
          </Link>
          <Link to="/register" className="flex items-center gap-2 bg-farm-primary text-farm-bg font-semibold rounded-lg px-4 py-2 text-sm">
            <UserPlus className="w-4 h-4" /> Get Started
          </Link>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-farm-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-farm-primary/8 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-farm-primary/3 rounded-full blur-3xl animate-float-slow" />
        {/* Floating icons */}
        {[
          { icon: Droplets, pos: 'top-1/4 left-12', delay: '0s' },
          { icon: Thermometer, pos: 'top-1/3 right-16', delay: '1s' },
          { icon: Wifi, pos: 'bottom-1/3 left-20', delay: '2s' },
          { icon: BarChart3, pos: 'bottom-1/4 right-12', delay: '0.5s' },
          { icon: Leaf, pos: 'top-2/3 left-1/3', delay: '1.5s' },
        ].map(({ icon: Icon, pos, delay }, i) => (
          <div key={i} className={`absolute ${pos} text-farm-primary/20 animate-float`} style={{ animationDelay: delay }}>
            <Icon className="w-8 h-8" />
          </div>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-farm-primary/10 border border-farm-primary/30 rounded-full px-4 py-1.5 text-sm text-farm-primary mb-8">
          <span className="w-2 h-2 bg-farm-primary rounded-full animate-pulse-green" />
          PutraHack 2026 — Food Security
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6">
          Smart Farming,
          <br />
          <span className="text-gradient">Powered by IoT & AI</span>
        </h1>

        <p className="text-farm-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Monitor soil, pH, temperature & water levels in real time.
          Control irrigation automatically. Get AI crop advice based on your live sensor data.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-farm-primary text-farm-bg font-bold rounded-xl px-8 py-4 text-base hover:bg-farm-primary/90 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_0_24px_rgba(74,222,128,0.4)] glow">
            <UserPlus className="w-5 h-5" /> Get Started Free
          </Link>
          <Link to="/demo" className="w-full sm:w-auto flex items-center justify-center gap-2 border border-farm-primary/50 text-farm-primary rounded-xl px-8 py-4 text-base hover:bg-farm-primary/10 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
            <Smartphone className="w-5 h-5" /> Try Live Demo
          </Link>
          <Link to="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 border border-farm-border text-white rounded-xl px-8 py-4 text-base hover:border-farm-primary/50 hover:bg-white/5 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
            <LogIn className="w-5 h-5" /> Login
          </Link>
          <a href={APK_URL} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-farm-surface border border-farm-border text-farm-primary rounded-xl px-8 py-4 text-base hover:border-farm-primary transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0" download>
            <Download className="w-5 h-5" /> Download APK
          </a>
        </div>

        <div className="mt-16 flex justify-center">
          <a href="#problem" className="flex flex-col items-center gap-2 text-farm-muted hover:text-farm-primary transition-colors animate-bounce hover:text-farm-primary">
            <span className="text-sm">Scroll to explore</span>
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Problem Statement ────────────────────────────────────────
function Problem() {
  return (
    <section id="problem" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="card p-10 text-center relative overflow-hidden hover:border-farm-primary/20 hover:-translate-y-0.5 transition-all duration-300 ease-out group">
            <div className="absolute inset-0 bg-gradient-to-br from-farm-primary/5 to-transparent" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 text-sm text-red-400 mb-6">
                🌍 Global Food Crisis
              </div>
              <div className="text-6xl sm:text-8xl font-black text-gradient mb-4">800M+</div>
              <p className="text-xl text-white font-semibold mb-4">people face food insecurity globally</p>
              <p className="text-farm-muted max-w-2xl mx-auto leading-relaxed mb-8">
                Smallholder farmers produce 70% of the world's food, yet lack affordable tools
                to monitor crops in real time. Inefficient irrigation, undetected soil degradation,
                and poor crop decisions lead to massive yield loss and water waste.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-farm-surface border border-farm-border rounded-full px-4 py-2 text-sm hover:bg-farm-primary/10 hover:border-farm-primary/30 transition-all duration-200 cursor-default">
                  <span>🎯</span> SDG 2 — Zero Hunger
                </div>
                <div className="flex items-center gap-2 bg-farm-surface border border-farm-border rounded-full px-4 py-2 text-sm hover:bg-farm-primary/10 hover:border-farm-primary/30 transition-all duration-200 cursor-default">
                  <span>💧</span> SDG 12 — Responsible Consumption
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── App Preview (Scroll-Triggered Horizontal Scroll + Center Zoom) ──
// Alphabetical order matches glob sort: Ai Assistant, Analytic, Automatic Irrigation,
// Crop Management, Dashboard, Interactive Map, Manual Irrigation, Notification Center, Weather Forecast
const CARD_LABELS = [
  'AI Assistant', 'Analytics', 'Auto Irrigation',
  'Crop Management', 'Dashboard', 'Interactive Map',
  'Manual Irrigation', 'Notifications', 'Weather Forecast',
]

function AppPreview() {
  const outerRef = useRef(null)
  const stripRef = useRef(null)
  const cardRefs = useRef([])
  const progressBarRef = useRef(null)
  const hintRef = useRef(null)
  const initOffsetRef = useRef(null)   // offset so card #4 starts centered
  const [lightbox, setLightbox] = useState(null) // { src, label } | null

  useEffect(() => {
    const outer = outerRef.current
    const strip = stripRef.current
    if (!outer || !strip) return

    const update = () => {
      const rect = outer.getBoundingClientRect()
      const scrolled = -rect.top
      const totalScroll = rect.height - window.innerHeight
      if (totalScroll <= 0) return

      const p = Math.max(0, Math.min(1, scrolled / totalScroll))
      const maxTranslate = strip.scrollWidth - window.innerWidth

      // Compute initial offset once: center card index 3 at scroll start
      if (initOffsetRef.current === null) {
        const c = cardRefs.current[2]
        if (c) {
          const cr = c.getBoundingClientRect()
          initOffsetRef.current = Math.max(0, Math.min(maxTranslate, cr.left + cr.width / 2 - window.innerWidth / 2))
        } else {
          initOffsetRef.current = 0
        }
      }

      const init = initOffsetRef.current
      const offset = init + p * (maxTranslate - init)
      strip.style.transform = `translateX(-${offset}px)`

      // Progress bar
      if (progressBarRef.current) progressBarRef.current.style.width = `${p * 100}%`

      // Scroll hint
      if (hintRef.current) hintRef.current.style.opacity = p < 0.04 ? '1' : '0'

      // Per-card: scale + opacity by distance from viewport center
      const vCenter = window.innerWidth / 2
      cardRefs.current.forEach((card) => {
        if (!card) return
        const cr = card.getBoundingClientRect()
        const t = Math.min(1, Math.abs(cr.left + cr.width / 2 - vCenter) / (vCenter * 0.9))
        card.style.transform = `scale(${1.18 - t * 0.36})`
        card.style.opacity = 1 - t * 0.55
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    requestAnimationFrame(update)
    return () => window.removeEventListener('scroll', update)
  }, [])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <section ref={outerRef} style={{ height: '320vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col bg-farm-bg">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-farm-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Centered content block */}
        <div className="flex-1 flex flex-col items-center justify-center gap-0 min-h-0">

          {/* Header */}
          <div className="relative px-6 mb-10 text-center">
            <div className="inline-flex items-center gap-2 bg-farm-primary/10 border border-farm-primary/30 rounded-full px-4 py-1.5 text-xs text-farm-primary mb-3 font-semibold uppercase tracking-wide">
              <Smartphone className="w-3.5 h-3.5" /> App Preview
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-1">See It In Action</h2>
            <p className="text-farm-muted text-sm sm:text-base">Scroll down to explore every screen of the AgroEzuran mobile app</p>
          </div>

          {/* Cards strip */}
          <div
            ref={stripRef}
            className="relative flex items-center gap-8 px-[max(80px,calc((100vw-600px)/2))]"
            style={{ willChange: 'transform', paddingRight: '80px' }}
          >
            {APP_SCREENSHOTS.map((src, i) => (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el }}
                className="flex-shrink-0 group relative cursor-pointer"
                style={{
                  width: 'clamp(200px, 20vw, 280px)',
                  transformOrigin: 'center center',
                  transition: 'transform 0.12s ease, opacity 0.12s ease',
                  willChange: 'transform, opacity',
                }}
                onClick={() => setLightbox({ src, label: CARD_LABELS[i] ?? `Screen ${i + 1}` })}
              >
                {/* Hover glow ring */}
                <div
                  className="absolute -inset-[3px] rounded-[14px] opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{ transition: 'opacity 0.3s ease', boxShadow: '0 0 18px 4px rgba(74,222,128,0.45), 0 0 40px 8px rgba(74,222,128,0.18)', zIndex: 0 }}
                />
                <div
                  className="relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: '9/19.5', boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset', border: '1px solid rgba(255,255,255,0.07)', zIndex: 1 }}
                >
                  <img src={src} alt={CARD_LABELS[i]} className="w-full h-full object-cover object-top" draggable={false} />
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                  {/* Tap hint on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-white text-[10px] font-medium">
                      Tap to expand
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 to-transparent pt-8 pb-2.5 px-3">
                    <p className="text-white/90 text-[10px] font-medium text-center tracking-wide">{CARD_LABELS[i]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>{/* end centered content block */}

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-farm-muted text-xs pointer-events-none"
          style={{ transition: 'opacity 0.4s ease', opacity: 1 }}
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
          <span>Keep scrolling</span>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-farm-border rounded-full overflow-hidden">
          <div ref={progressBarRef} className="h-full bg-farm-primary rounded-full" style={{ width: '0%', transition: 'width 0.1s linear' }} />
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md"
          style={{ animation: 'lightboxIn 0.2s ease' }}
          onClick={() => setLightbox(null)}
        >
          <style>{`@keyframes lightboxIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes lightboxPop { from { transform: scale(0.88); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}
          </style>
          <div
            className="relative flex flex-col items-center"
            style={{ animation: 'lightboxPop 0.22s cubic-bezier(0.34,1.56,0.64,1)' }}
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.src}
              alt={lightbox.label}
              className="rounded-2xl shadow-2xl"
              style={{ maxHeight: '82vh', maxWidth: 'min(88vw, 380px)', width: 'auto' }}
              draggable={false}
            />
            <p className="text-white/60 text-sm mt-3 font-medium">{lightbox.label}</p>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-farm-surface border border-farm-border flex items-center justify-center text-farm-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────
const features = [
  { icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Real-Time Dashboard', desc: 'Live soil moisture, pH, temperature, humidity and water tank level — updated every 5 seconds via Firebase.' },
  { icon: Droplets, color: 'text-cyan-400', bg: 'bg-cyan-400/10', title: 'Smart Irrigation', desc: 'Manual pump control or AI-threshold auto mode. The system irrigates when soil falls below your target range.' },
  { icon: Bot, color: 'text-farm-primary', bg: 'bg-farm-primary/10', title: 'AI Crop Advisor', desc: 'Claude AI analyses your live sensor readings and gives natural language advice tailored to your crop and conditions.' },
  { icon: CloudSun, color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'Weather Forecast', desc: 'Hourly and weekly weather forecasts per your GPS farm location, powered by OpenWeatherMap.' },
  { icon: Shield, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'Push Notifications', desc: 'Firebase Cloud Messaging alerts for critical soil, pH, and water level events — never miss a crop emergency.' },
  { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/10', title: 'Sensor Health Monitor', desc: 'Per-sensor status tracking (ok / error) so you know immediately if a hardware sensor needs attention.' },
]

function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Everything Your Farm Needs</h2>
          <p className="text-farm-muted text-lg max-w-xl mx-auto">Built for real farmers. Powered by real IoT hardware and AI.</p>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <AnimatedSection key={i}>
              <div className="card p-6 h-full hover:-translate-y-1 hover:border-farm-primary/30 hover:shadow-[0_8px_28px_rgba(74,222,128,0.08)] transition-all duration-300 ease-out group cursor-default">
                <div className={`${f.bg} rounded-xl p-3 w-fit mb-4 group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(74,222,128,0.2)] transition-all duration-300`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-farm-muted text-sm leading-relaxed">{f.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────
const steps = [
  { num: '01', icon: Cpu, title: 'Connect ESP32', desc: 'Flash the firmware and connect your IoT sensors to the ESP32 board.' },
  { num: '02', icon: Activity, title: 'Monitor Live Data', desc: 'Sensor readings stream to Firebase in real time — visible instantly in the app.' },
  { num: '03', icon: Bot, title: 'AI Takes Action', desc: 'Claude AI analyses your data, advises on crop care, and auto-irrigation kicks in.' },
]

function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-farm-surface/30">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-farm-muted text-lg">Up and running in three simple steps</p>
        </AnimatedSection>
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-farm-primary/20 via-farm-primary/60 to-farm-primary/20" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <AnimatedSection key={i} className="text-center">
                <div className="relative inline-flex items-center justify-center mb-6 group">
                  <div className="w-20 h-20 rounded-full bg-farm-primary/10 border-2 border-farm-primary flex items-center justify-center glow group-hover:scale-105 group-hover:border-farm-primary group-hover:glow transition-all duration-300">
                    <span className="text-farm-primary font-black text-xl">{s.num}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-farm-surface border border-farm-border rounded-lg p-1.5 group-hover:border-farm-primary/60 group-hover:bg-farm-surface2 transition-all duration-300">
                    <s.icon className="w-4 h-4 text-farm-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-farm-muted text-sm leading-relaxed">{s.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── APK Demo Guide ───────────────────────────────────────────
const demoSteps = [
  { num: '01', icon: Download, title: 'Download APK', desc: 'Tap the Download APK button to save the installer to your Android device.' },
  { num: '02', icon: Settings, title: 'Enable Unknown Sources', desc: 'Go to Settings → Security → Install Unknown Apps and allow your browser.' },
  { num: '03', icon: Smartphone, title: 'Install the App', desc: 'Open the downloaded APK file and tap Install. Takes about 10 seconds.' },
  { num: '04', icon: UserPlus, title: 'Sign Up', desc: 'Create your account with email or sign in with Google — takes 30 seconds.' },
  { num: '05', icon: Cpu, title: 'Claim ESP32 Device', desc: 'Go to Crop Management → Claim Device and enter your ESP32 device ID.' },
  { num: '06', icon: Activity, title: 'Monitor Your Farm', desc: 'Your dashboard is live! View sensor readings, control irrigation, and ask AI.' },
]

function DemoGuide() {
  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Get Started in Minutes</h2>
          <p className="text-farm-muted text-lg mb-8">Install the app and connect your farm in 6 simple steps</p>
          <a
            href={APK_URL}
            download
            className="inline-flex items-center gap-3 bg-farm-primary text-farm-bg font-bold rounded-2xl px-10 py-4 text-lg hover:bg-farm-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(74,222,128,0.4)] glow"
          >
            <Download className="w-6 h-6" />
            Download APK (Android)
          </a>
        </AnimatedSection>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal connector line — desktop */}
          <div className="hidden lg:block absolute top-10 left-[8.33%] right-[8.33%] h-0.5 bg-farm-border" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoSteps.map((s, i) => (
              <AnimatedSection key={i}>
                <div className="card p-6 relative group hover:border-farm-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(74,222,128,0.08)] transition-all duration-300 ease-out">
                  {/* Arrow connector — desktop */}
                  {i < 5 && i % 3 !== 2 && (
                    <div className="hidden lg:flex absolute -right-4 top-10 z-10">
                      <ArrowRight className="w-4 h-4 text-farm-primary/40" />
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-farm-primary/10 border-2 border-farm-primary flex items-center justify-center group-hover:glow group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(74,222,128,0.3)] transition-all duration-300">
                      <span className="text-farm-primary font-black text-sm">{s.num}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <s.icon className="w-4 h-4 text-farm-muted group-hover:text-farm-primary transition-colors duration-200" />
                        <h3 className="font-semibold text-white">{s.title}</h3>
                      </div>
                      <p className="text-farm-muted text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Tech Stack ───────────────────────────────────────────────
const techStack = [
  { name: 'Flutter', emoji: '📱', desc: 'Mobile framework' },
  { name: 'Firebase', emoji: '🔥', desc: 'Backend & realtime DB' },
  { name: 'ESP32', emoji: '🔌', desc: 'IoT hardware' },
  { name: 'Claude AI', emoji: '🤖', desc: 'Crop advisor AI' },
  { name: 'OpenWeatherMap', emoji: '🌤️', desc: 'Weather API' },
  { name: 'Arduino', emoji: '⚡', desc: 'Firmware' },
]

function TechStack() {
  return (
    <section className="py-24 px-4 bg-farm-surface/30">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Built With</h2>
          <p className="text-farm-muted">A modern stack for reliable, scalable smart farming</p>
        </AnimatedSection>
        <AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((t, i) => (
              <div key={i} className="card p-4 text-center hover:-translate-y-1 hover:border-farm-primary/30 hover:shadow-[0_8px_28px_rgba(74,222,128,0.08)] transition-all duration-300 ease-out cursor-default group">
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300 inline-block">{t.emoji}</div>
                <div className="text-sm font-semibold text-white group-hover:text-farm-primary transition-colors duration-200">{t.name}</div>
                <div className="text-xs text-farm-muted mt-1">{t.desc}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── Impact Numbers ───────────────────────────────────────────
const impacts = [
  { value: '12', label: 'Crop Types', sub: 'Supported' },
  { value: '5s', label: 'Live Updates', sub: 'Real-time refresh' },
  { value: '5', label: 'Sensor Types', sub: 'Soil, pH, Temp, Humidity, Water' },
  { value: '2', label: 'Irrigation Modes', sub: 'Manual + Auto' },
]

function ImpactNumbers() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Built to Scale</h2>
          <p className="text-farm-muted">Designed for real farm conditions</p>
        </AnimatedSection>
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((item, i) => (
              <div key={i} className="card p-6 text-center hover:-translate-y-1 hover:border-farm-primary/40 hover:shadow-[0_8px_28px_rgba(74,222,128,0.08)] transition-all duration-300 ease-out group">
                <div className="text-5xl font-black text-gradient mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">{item.value}</div>
                <div className="text-white font-semibold">{item.label}</div>
                <div className="text-farm-muted text-xs mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── Team ─────────────────────────────────────────────────────
function Team() {
  return (
    <section className="py-24 px-4 bg-farm-surface/30">
      <div className="max-w-2xl mx-auto text-center">
        <AnimatedSection>
          <div className="card p-10 relative overflow-hidden hover:border-farm-primary/20 hover:shadow-[0_8px_32px_rgba(74,222,128,0.06)] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-farm-primary/5 to-transparent" />
            <div className="relative">
              <div className="text-5xl mb-4">🌱</div>
              <h2 className="text-3xl font-bold text-white mb-2">{TEAM_NAME}</h2>
              <div className="inline-flex items-center gap-2 bg-farm-primary/10 border border-farm-primary/30 rounded-full px-4 py-1.5 text-sm text-farm-primary mb-6">
                PutraHack 2026 — Food Security
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {TEAM_MEMBERS.map((m, i) => (
                  <div key={i} className="bg-farm-surface border border-farm-border rounded-full px-4 py-2 text-sm text-white hover:border-farm-primary/50 hover:bg-farm-primary/10 hover:text-farm-primary transition-all duration-200 cursor-default">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-farm-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-farm-primary rounded-lg p-1.5">
              <Leaf className="w-4 h-4 text-farm-bg" />
            </div>
            <span className="text-lg font-bold">AgroEzuran</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-farm-muted text-sm">Built for PutraHack 2026 — Theme: Food Security</p>
          </div>
          <div className="flex items-center gap-4">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-farm-muted hover:text-white hover:-translate-y-0.5 transition-all duration-200 text-sm">
              <ExternalLink className="w-4 h-4" /> GitHub Repo
            </a>
            <a href={APK_URL} download
              className="flex items-center gap-2 bg-farm-primary/10 border border-farm-primary/30 text-farm-primary hover:bg-farm-primary/20 hover:-translate-y-0.5 transition-all duration-200 rounded-lg px-3 py-1.5 text-sm">
              <Download className="w-4 h-4" /> APK
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-farm-border text-center">
          <p className="text-farm-muted text-xs">
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Landing Page ─────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-farm-bg text-white">
      <Navbar />
      <Hero />
      <Problem />
      <AppPreview />
      <Features />
      <HowItWorks />
      <DemoGuide />
      <TechStack />
      <ImpactNumbers />
      <Team />
      <Footer />
    </div>
  )
}
