import { useState } from 'react'
import { Droplets, Power, PowerOff, Zap } from 'lucide-react'
import { ref, set, serverTimestamp } from 'firebase/database'
import { rtdb } from '../firebase'

export default function PumpControl({ deviceId, pumpStatus, liveData }) {
  const [loading, setLoading] = useState(false)

  async function togglePump(state) {
    if (!deviceId || loading) return
    setLoading(true)
    try {
      await set(ref(rtdb, `commands/${deviceId}`), {
        pump: state,
        timestamp: Date.now(),
        source: 'web',
      })
    } catch (err) {
      console.error('Pump control error:', err)
    } finally {
      setLoading(false)
    }
  }

  const isOn = pumpStatus === 'on'
  const soil = liveData?.soil != null ? `${parseFloat(liveData.soil).toFixed(1)}%` : '--'
  const water = liveData?.waterLevel != null ? `${parseFloat(liveData.waterLevel).toFixed(1)}%` : '--'

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className="card p-6 flex flex-col items-center gap-4">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
          isOn
            ? 'bg-farm-primary/20 shadow-[0_0_30px_rgba(19,236,55,0.4)] animate-pulse-green'
            : 'bg-farm-surface2'
        }`}>
          <Droplets className={`w-10 h-10 ${isOn ? 'text-farm-primary' : 'text-farm-muted'}`} />
        </div>
        <div className="text-center">
          <p className={`text-xl font-bold ${isOn ? 'text-farm-primary' : 'text-farm-muted'}`}>
            {isOn ? 'PUMP ACTIVE' : 'PUMP INACTIVE'}
          </p>
          <p className="text-farm-muted text-sm mt-1">
            {pumpStatus === null ? 'Status unknown' : `State: ${pumpStatus?.toUpperCase() ?? 'N/A'}`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => togglePump('on')}
          disabled={loading || isOn}
          className={`card p-4 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
            isOn
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:border-farm-primary hover:bg-farm-primary/10 hover:text-farm-primary cursor-pointer'
          } ${loading ? 'opacity-50' : ''}`}
        >
          <Power className="w-4 h-4" />
          Turn ON
        </button>
        <button
          onClick={() => togglePump('off')}
          disabled={loading || !isOn}
          className={`card p-4 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
            !isOn
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:border-red-400 hover:bg-red-400/10 hover:text-red-400 cursor-pointer'
          } ${loading ? 'opacity-50' : ''}`}
        >
          <PowerOff className="w-4 h-4" />
          Turn OFF
        </button>
      </div>

      {/* Context */}
      <div className="card p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-farm-muted text-xs mb-1">Soil Moisture</p>
          <p className="text-white font-semibold">{soil}</p>
        </div>
        <div>
          <p className="text-farm-muted text-xs mb-1">Water Tank</p>
          <p className="text-white font-semibold">{water}</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-farm-muted text-sm">
          <div className="w-4 h-4 border-2 border-farm-primary border-t-transparent rounded-full animate-spin" />
          Sending command...
        </div>
      )}
    </div>
  )
}
