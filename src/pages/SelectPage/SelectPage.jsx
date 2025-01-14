import CardCinema from '../../components/Cards/CardCinema'
import CardEvents from '../../components/Cards/CardEvents'
import CardEventUser from '../../components/Cards/CardEventUser'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '../../components/ui/carousel'
import { useState } from 'react'
import { format, addDays } from 'date-fns'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'

const SelectPage = () => {
  const { type } = useParams()
  const [filter, setFilter] = useState(null)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [typeEvent, setTypeEvent] = useState(type || null)

  const [eventUsers, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleFilter = (typeEvent) => {
    setFilter((prev) => (prev === typeEvent ? null : typeEvent)) // Toggle filter
  }
  const handleFiltertypeEvent = (typeEvent) => {
    setTypeEvent((prev) => (prev === typeEvent ? null : typeEvent)) // Toggle filter typeEvent
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

  const allEvents = [
    ...(eventUsers?.length
      ? eventUsers.map((eventUser) => ({
          ...eventUser,
          cost: eventUser.cost || 0
        }))
      : [])
  ]

  // Filtrowanie według aktywnego filtra
  const filteredEvents = allEvents
    .filter((event) => {
      if (!filter) return true // Bez filtra wyświetl wszystko
      if (filter === 'free') return event.cost === 0
      if (filter === 'paid') return event.cost > 0
      return true
    })
    .filter((event) => {
      console.log(event.event.typeEvent)

      if (!event.typeEvent) return true
      if (event.event.typeEvent === 'big-event') return event.event.typeEvent === 'event'
      if (event.event.typeEvent === 'local-event') return event.event.typeEvent === 'user'
      if (event.event.typeEvent === 'cinema-event') return event.event.typeEvent === 'movie' // Wydarzenia kinowe
      return true
    })
  console.log(filteredEvents)

  return (
    <>
      <div className='flex z-10'>
        <div className='p-4'>
          <button
            className={`btn  ${selectedDate === format(new Date(), 'yyyy-MM-dd') ? 'active' : ''}`}
            onClick={() => handleDateChange(0)}
          >
            DZIŚ
          </button>
          <button
            className={`btn ${selectedDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'active' : ''}`}
            onClick={() => handleDateChange(1)}
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
            className={`btn ${filter === 'free' ? 'active' : ''}`}
            onClick={() => handleFilter('free')}
          >
            FREE
          </button>
          <button
            className={`btn ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => handleFilter('paid')}
          >
            PŁATNE
          </button>
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
        <p> Lista wydarzeń kup bilet znajdź atrakcje dla siebie</p>
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
