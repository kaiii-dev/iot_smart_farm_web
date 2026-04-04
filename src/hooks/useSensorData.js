import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database'
import { rtdb } from '../firebase'

const DEVICE_ONLINE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

export function useSensorData(deviceId) {
  const [liveData, setLiveData] = useState(null)
  const [sensorHealth, setSensorHealth] = useState(null)
  const [pumpStatus, setPumpStatus] = useState(null)
  const [deviceOnline, setDeviceOnline] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!deviceId) {
      setLoading(false)
      return
    }

    const liveRef = ref(rtdb, `sensors/${deviceId}/live`)
    const healthRef = ref(rtdb, `sensors/${deviceId}/sensorHealth`)
    const pumpRef = ref(rtdb, `commands/${deviceId}/pump`)

    const unsubLive = onValue(liveRef, (snap) => {
      const data = snap.val()
      setLiveData(data)
      if (data?.lastSeen) {
        const lastSeenMs = data.lastSeen * 1000
        setDeviceOnline(Date.now() - lastSeenMs < DEVICE_ONLINE_THRESHOLD_MS)
      } else {
        setDeviceOnline(false)
      }
      setLoading(false)
    })

    const unsubHealth = onValue(healthRef, (snap) => {
      setSensorHealth(snap.val())
    })

    const unsubPump = onValue(pumpRef, (snap) => {
      setPumpStatus(snap.val())
    })

    return () => {
      off(liveRef)
      off(healthRef)
      off(pumpRef)
    }
  }, [deviceId])

  return { liveData, sensorHealth, pumpStatus, deviceOnline, loading }
}
