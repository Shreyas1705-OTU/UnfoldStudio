const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

function toKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// events: array of { date: 'YYYY-MM-DD', label, type: 'client' | 'freelance' }
export default function Calendar({ events }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const eventsByDate = {}
  for (const e of events) {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = []
    eventsByDate[e.date].push(e)
  }

  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  const monthLabel = today.toLocaleDateString([], { month: 'long', year: 'numeric', timeZone })

  const upcoming = Object.keys(eventsByDate)
    .filter((key) => key >= toKey(today))
    .sort()
    .slice(0, 4)

  return (
    <div className="widget calendar-widget">
      <div className="calendar-month">{monthLabel}</div>
      <div className="calendar-grid">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="calendar-weekday">{w}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="calendar-cell calendar-cell-empty" />
          const key = toKey(new Date(year, month, day))
          const dayEvents = eventsByDate[key] || []
          const isToday = day === today.getDate()
          const hasClient = dayEvents.some((e) => e.type === 'client')
          const hasFreelance = dayEvents.some((e) => e.type === 'freelance')
          return (
            <div
              key={i}
              className={`calendar-cell ${isToday ? 'calendar-today' : ''}`}
              title={dayEvents.length ? dayEvents.map((e) => e.label).join(', ') : undefined}
            >
              {day}
              {(hasClient || hasFreelance) && (
                <span className="calendar-dots">
                  {hasClient && <span className="calendar-dot calendar-dot-client" />}
                  {hasFreelance && <span className="calendar-dot calendar-dot-freelance" />}
                </span>
              )}
            </div>
          )
        })}
      </div>
      <div className="calendar-legend">
        <span><span className="calendar-dot calendar-dot-client" /> Client shoot</span>
        <span><span className="calendar-dot calendar-dot-freelance" /> Freelance event</span>
      </div>
      {upcoming.length > 0 && (
        <div className="calendar-upcoming">
          {upcoming.map((key) => (
            <div key={key} className="calendar-upcoming-row">
              <span className="calendar-upcoming-date">{key.slice(5)}</span>
              <span>{eventsByDate[key].map((e) => e.label).join(', ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
