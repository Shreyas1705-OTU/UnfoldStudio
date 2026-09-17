import { useEffect, useState } from 'react'

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
    timeZoneName: 'short',
  })
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', timeZone })

  return (
    <div className="widget clock-widget">
      <div className="clock-time">{time}</div>
      <div className="clock-date">{date}</div>
    </div>
  )
}
