import { useMemo, useState } from 'react'
import Container from '../../components/ui/Container/Container'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Booking.module.scss'

function Booking() {
  const { language, t } = useLanguage()

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const locale = language === 'ru' ? 'ru-RU' : 'en-US'

  const monthTitle = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth)

  const weekdayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
  })

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const weekdays = useMemo(() => {
    const monday = new Date(2026, 0, 5)

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday)
      date.setDate(monday.getDate() + index)
      return weekdayFormatter.format(date)
    })
  }, [locale])

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const offset = (firstDay.getDay() + 6) % 7
    const result: Array<Date | null> = Array(offset).fill(null)

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      result.push(new Date(year, month, day))
    }

    while (result.length % 7 !== 0) {
      result.push(null)
    }

    return result
  }, [visibleMonth])

  const isSameDay = (first: Date, second: Date) => (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )

  const changeMonth = (direction: number) => {
    setVisibleMonth((current) => (
      new Date(
        current.getFullYear(),
        current.getMonth() + direction,
        1,
      )
    ))
  }

  return (
    <section
      className={styles.booking}
      id="booking"
      aria-labelledby="booking-title"
    >
      <Container className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>
            {t.booking.eyebrow}
          </span>

          <h2
            className={styles.title}
            id="booking-title"
          >
            {t.booking.title}
          </h2>

          <p className={styles.lead}>
            {t.booking.lead}
          </p>
        </header>

        <div className={styles.layout}>
          <div className={styles.calendar}>
            <div className={styles.calendarHeader}>
              <button
                className={styles.monthButton}
                type="button"
                aria-label={t.booking.previousMonth}
                onClick={() => changeMonth(-1)}
              >
                ←
              </button>

              <strong className={styles.month}>
                {monthTitle}
              </strong>

              <button
                className={styles.monthButton}
                type="button"
                aria-label={t.booking.nextMonth}
                onClick={() => changeMonth(1)}
              >
                →
              </button>
            </div>

            <div className={styles.weekdays}>
              {weekdays.map((weekday) => (
                <span key={weekday}>
                  {weekday}
                </span>
              ))}
            </div>

            <div className={styles.days}>
              {days.map((date, index) => {
                if (!date) {
                  return (
                    <span
                      className={styles.empty}
                      key={`empty-${index}`}
                    />
                  )
                }

                const disabled = date < today
                const selected = selectedDate
                  ? isSameDay(date, selectedDate)
                  : false

                const current = isSameDay(date, today)

                return (
                  <button
                    className={styles.day}
                    type="button"
                    disabled={disabled}
                    data-selected={selected || undefined}
                    data-today={current || undefined}
                    onClick={() => setSelectedDate(date)}
                    key={date.toISOString()}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.selected}>
              <span>{t.booking.selectedDate}</span>

              <strong>
                {selectedDate
                  ? dateFormatter.format(selectedDate)
                  : t.booking.chooseDate}
              </strong>
            </div>

            <label className={styles.field}>
              <span>{t.booking.time}</span>

              <input
                type="time"
                name="time"
                disabled={!selectedDate}
              />
            </label>

            <label className={styles.field}>
              <span>{t.booking.name}</span>

              <input
                type="text"
                name="name"
                placeholder={t.booking.namePlaceholder}
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span>{t.booking.contact}</span>

              <input
                type="text"
                name="contact"
                placeholder={t.booking.contactPlaceholder}
              />
            </label>

            <label className={styles.field}>
              <span>{t.booking.message}</span>

              <textarea
                name="message"
                rows={5}
                placeholder={t.booking.messagePlaceholder}
              />
            </label>

            <button
              className={styles.submit}
              type="button"
              disabled
            >
              <span>{t.booking.submit}</span>
              <span aria-hidden="true">→</span>
            </button>


          </div>
        </div>
      </Container>
    </section>
  )
}

export default Booking