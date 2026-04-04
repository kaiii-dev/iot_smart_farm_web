import { Download, Smartphone, BarChart3, Zap, Bell, Map, ArrowRight, Star } from 'lucide-react'

const APK_URL = 'https://drive.google.com/uc?export=download&id=1mjnvoelnVVTWk8fdPntIBN2V0wVoyXG1'
const GITHUB_URL = 'https://github.com/Kaiszee/iot_smart_farm_app'

const MOBILE_FEATURES = [
  { icon: BarChart3,  color: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Historical Graphs',      desc: 'Visualize sensor trends over time' },
  { icon: Zap,        color: 'text-yellow-400',  bg: 'bg-yellow-400/10', label: 'Auto-Irrigation Rules',  desc: 'Set thresholds, let it run itself' },
  { icon: Bell,       color: 'text-orange-400',  bg: 'bg-orange-400/10', label: 'Push Notifications',     desc: 'Instant alerts for critical readings' },
  { icon: Map,        color: 'text-teal-400',    bg: 'bg-teal-400/10',   label: 'Farm Map & Location',    desc: 'Pin your farm on the map' },
  { icon: Smartphone, color: 'text-purple-400',  bg: 'bg-purple-400/10', label: 'Device Claiming',        desc: 'Pair your ESP32 from your phone' },
  { icon: Star,       color: 'text-farm-primary',bg: 'bg-farm-primary/10',label: 'Offline Support',       desc: 'Works even without internet' },
]

/** Compact hint shown inside web sections */
export function AppPromoHint({ feature }) {
  return (
    <a
      href={APK_URL}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 card p-3 mt-4 hover:border-farm-primary/50 transition-all group"
    >
      <div className="w-8 h-8 bg-farm-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Smartphone className="w-4 h-4 text-farm-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-medium">{feature} available in the mobile app</p>
        <p className="text-farm-muted text-xs">Tap to download APK →</p>
      </div>
      <ArrowRight className="w-4 h-4 text-farm-muted group-hover:text-farm-primary transition-colors flex-shrink-0" />
    </a>
  )
}

/** Full promo card shown in Overview */
export function AppPromoCard() {
  return (
    <div className="card p-5 border-farm-primary/20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-farm-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-farm-primary rounded-full animate-pulse-green" />
              <span className="text-farm-primary text-xs font-semibold uppercase tracking-wide">Mobile App</span>
            </div>
            <h3 className="text-white font-bold text-base">Unlock the Full Experience</h3>
            <p className="text-farm-muted text-sm mt-0.5">The web dashboard covers live monitoring & control. The mobile app goes further.</p>
          </div>
          <div className="w-10 h-10 bg-farm-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
            <Smartphone className="w-5 h-5 text-farm-primary" />
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {MOBILE_FEATURES.map(({ icon: Icon, color, bg, label, desc }) => (
            <div key={label} className={`rounded-xl p-3 ${bg} flex items-start gap-2`}>
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
              <div>
                <p className="text-white text-xs font-semibold leading-tight">{label}</p>
                <p className="text-farm-muted text-[10px] mt-0.5 leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={APK_URL}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-farm-primary text-farm-bg font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-all glow-sm"
          >
            <Download className="w-4 h-4" />
            Download APK
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2 card py-2.5 rounded-xl text-sm text-farm-muted hover:text-white hover:border-farm-border/80 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

/** Full-page Analytics promo */
export function AnalyticsPromoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-blue-400/10 rounded-3xl flex items-center justify-center mb-6">
        <BarChart3 className="w-10 h-10 text-blue-400" />
      </div>

      <h2 className="text-white text-2xl font-bold mb-2">Analytics & History</h2>
      <p className="text-farm-muted text-sm max-w-sm mb-8 leading-relaxed">
        Historical sensor graphs, weekly trends, irrigation logs, and crop performance reports are available in the AgroEzuran mobile app.
      </p>

      <div className="w-full max-w-sm space-y-3 mb-8">
        {[
          { icon: BarChart3, color: 'text-blue-400',  bg: 'bg-blue-400/10',  label: 'Soil & pH trend charts' },
          { icon: Zap,       color: 'text-yellow-400',bg: 'bg-yellow-400/10', label: 'Auto-irrigation history' },
          { icon: Bell,      color: 'text-orange-400',bg: 'bg-orange-400/10', label: 'Alert & notification logs' },
        ].map(({ icon: Icon, color, bg, label }) => (
          <div key={label} className="card p-3 flex items-center gap-3 text-left">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <span className="text-white text-sm">{label}</span>
          </div>
        ))}
      </div>

      <a
        href={APK_URL}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 bg-farm-primary text-farm-bg font-bold px-8 py-3 rounded-xl text-sm hover:opacity-90 transition-all glow-sm"
      >
        <Download className="w-4 h-4" />
        Download Mobile App
      </a>

      <p className="text-farm-muted text-xs mt-4">Free • Android APK • PutraHack 2026</p>
    </div>
  )
}
