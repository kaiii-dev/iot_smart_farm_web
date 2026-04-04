const SENSOR_CONFIG = {
  soil:       { color: 'text-blue-400',   bg: 'bg-blue-400/10',   label: 'Soil Moisture', unit: '%'  },
  temp:       { color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'Temperature',   unit: '°C' },
  humidity:   { color: 'text-teal-400',   bg: 'bg-teal-400/10',   label: 'Humidity',      unit: '%'  },
  ph:         { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'pH Level',      unit: ''   },
  waterLevel: { color: 'text-red-400',    bg: 'bg-red-400/10',    label: 'Water Level',   unit: '%'  },
}

function getSensorStatus(type, value) {
  if (value == null) return { label: 'No Data', color: 'text-farm-muted' }
  const v = parseFloat(value)
  switch (type) {
    case 'soil':
      if (v < 30) return { label: 'Low', color: 'text-red-400' }
      if (v > 70) return { label: 'High', color: 'text-blue-400' }
      return { label: 'Normal', color: 'text-farm-primary' }
    case 'temp':
      if (v < 15) return { label: 'Cold', color: 'text-blue-400' }
      if (v > 35) return { label: 'Hot', color: 'text-red-400' }
      return { label: 'Normal', color: 'text-farm-primary' }
    case 'humidity':
      if (v < 40) return { label: 'Low', color: 'text-orange-400' }
      if (v > 80) return { label: 'High', color: 'text-blue-400' }
      return { label: 'Normal', color: 'text-farm-primary' }
    case 'ph':
      if (v < 5.5) return { label: 'Acidic', color: 'text-red-400' }
      if (v > 7.5) return { label: 'Alkaline', color: 'text-orange-400' }
      return { label: 'Normal', color: 'text-farm-primary' }
    case 'waterLevel':
      if (v < 20) return { label: 'Critical', color: 'text-red-400' }
      if (v < 40) return { label: 'Low', color: 'text-orange-400' }
      return { label: 'Good', color: 'text-farm-primary' }
    default:
      return { label: '', color: 'text-farm-muted' }
  }
}

export default function SensorCard({ type, value, health, icon: Icon, compact = false }) {
  const config = SENSOR_CONFIG[type] || {}
  const status = getSensorStatus(type, value)
  const isError = health === 'error'
  const displayValue = value != null ? parseFloat(value).toFixed(type === 'ph' ? 1 : 1) : '--'

  return (
    <div className={`card p-4 flex flex-col gap-3 ${isError ? 'border-red-500/40' : ''}`}>
      <div className="flex items-center justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.bg}`}>
          {Icon && <Icon className={`w-5 h-5 ${config.color}`} />}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isError ? 'bg-red-400 animate-pulse' : 'bg-farm-primary'}`} />
          <span className={`text-xs ${isError ? 'text-red-400' : 'text-farm-muted'}`}>
            {isError ? 'Error' : 'OK'}
          </span>
        </div>
      </div>
      <div>
        <p className="text-farm-muted text-xs mb-1">{config.label}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${config.color}`}>{displayValue}</span>
          {config.unit && <span className="text-farm-muted text-sm">{config.unit}</span>}
        </div>
      </div>
      <div className={`text-xs font-medium ${status.color}`}>{status.label}</div>
    </div>
  )
}

export { getSensorStatus, SENSOR_CONFIG }
