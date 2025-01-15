import CardCinema from '../../components/Cards/CardCinema'
import CardEvents from '../../components/Cards/CardEvents'
import CardEventUser from '../../components/Cards/CardEventUser'
import { format, addDays, isSameDay, parseISO } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

const SelectPage = () => {
  const { type } = useParams()
  const [filter, setFilter] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [typeEvent, setTypeEvent] = useState(type || null)
  const [eventUsers, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleFilter = (typeEvent) => {
    setFilter((prev) => (prev === typeEvent ? null : typeEvent))
  }
  const handleFiltertypeEvent = (typeEvent) => {
    setTypeEvent((prev) => (prev === typeEvent ? null : typeEvent))
  }
  const handleDateChange = (daysOffset) => {
    const newDate = format(addDays(new Date(), daysOffset), 'yyyy-MM-dd')
    setSelectedDate(newDate)
  }

  useEffect(() => {
    if (type) {
      setTypeEvent(type)
    }
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/all-local-events/`)
        if (!response.ok) throw new Error('Failed to fetch event details')
        const data = await response.json()
        setEvent(data.events)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEventDetails()
  }, [type])
  if (loading) {
    return (
      <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p class='text-lg font-semibold'>
          <span class='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }
  const allEvents = [
    ...(eventUsers?.length
      ? eventUsers.map((eventUser) => ({
          ...eventUser,
          cost: eventUser.cost || 0
        }))
      : [])
  ]

  const filteredEvents = allEvents.filter((event) => {
    const eventDate = event.event?.date ? parseISO(event.event.date) : null
    const selectedDateObj = selectedDate ? parseISO(selectedDate) : null

    const isDateMatch = selectedDate ? isSameDay(eventDate, selectedDateObj) : true

    const eventType = event.event?.typeEvent?.toLowerCase().trim()
    const selectedType = typeEvent?.toLowerCase().trim()

    if (!event.event?.typeEvent) {
      return isDateMatch
    }

    if (selectedType === 'big-event' && eventType !== 'big-event') return false
    if (selectedType === 'local-event' && eventType !== 'local-event') return false
    if (selectedType === 'cinema-event' && eventType !== 'cinema-event') return false

    const isTypeMatch = !selectedType || eventType === selectedType

    return isDateMatch && isTypeMatch
  })

  return (
    <>
      <div className='flex z-10'>
        <div className='p-4'>
          <button
            className={`btn ${selectedDate === format(new Date(), 'yyyy-MM-dd') ? 'active' : ''}`}
            onClick={() => {
              const newDate =
                selectedDate === format(new Date(), 'yyyy-MM-dd')
                  ? null
                  : format(new Date(), 'yyyy-MM-dd')
              setSelectedDate(newDate)
            }}
          >
            DZIŚ
          </button>
          <button
            className={`btn ${selectedDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'active' : ''}`}
            onClick={() => {
              const newDate =
                selectedDate === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                  ? null
                  : format(addDays(new Date(), 1), 'yyyy-MM-dd')
              setSelectedDate(newDate)
            }}
          >
            JUTRO
          </button>
          <input
            type='date'
            className={`btn p-2 ${filter === 'custom' ? 'active' : ''}`}
            value={selectedDate}
            min={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className='p-4'>
          <button
            className={`btn ${typeEvent === 'big-event' ? 'active' : ''}`}
            onClick={() => handleFiltertypeEvent('big-event')}
          >
            WIĘKSZE WYDARZENIA
          </button>
          <button
            className={`btn ${typeEvent === 'local-event' ? 'active' : ''}`}
            onClick={() => handleFiltertypeEvent('local-event')}
          >
            WYDARZENIA LOKALNE
          </button>
          <button
            className={`btn ${typeEvent === 'cinema-event' ? 'active' : ''}`}
            onClick={() => handleFiltertypeEvent('cinema-event')}
          >
            KINO
          </button>
        </div>
      </div>
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto z-10'>
        <div className='wrapper-for-elements-smaller grid grid-cols-1 md:grid-cols-3 gap-4'>
          {filteredEvents.map((event) =>
            event.typeEvent === 'movie' ? (
              <CardCinema key={`C${event.id}`} movie={event} />
            ) : event.typeEvent === 'event' ? (
              <CardEvents key={`E${event.id}`} item={event} />
            ) : (
              <CardEventUser key={`EU${event.id}`} item={event} />
            )
          )}
        </div>
      </div>
    </>
  )
}

export default SelectPage
