import CardCinema from '../../components/Cards/CardCinema'
import CardEvents from '../../components/Cards/CardEvents'
import CardEventUser from '../../components/Cards/CardEventUser'
import { format, addDays, isSameDay, parseISO } from 'date-fns'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const categories = ['teatr', 'muzyka', 'rodzina', 'widowisko', 'sport', 'sztuka', 'kino', 'inne']

const SelectPage = () => {
  const { type } = useParams()
  const [selectedDate, setSelectedDate] = useState(null)
  const [typeEvent, setTypeEvent] = useState(type || null)
  const [eventUsers, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isFreeOnly, setIsFreeOnly] = useState(false)

  const handleFiltertypeEvent = (typeEvent) => {
    setTypeEvent((prev) => (prev === typeEvent ? null : typeEvent))
  }

  const handlePriceFilter = () => {
    setIsFreeOnly((prev) => !prev)
  }

  const handleCategoryFilter = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    )
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
        console.log(data.events)
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
      <div className='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p className='text-lg font-semibold'>
          <span className='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }

  const allEvents = eventUsers?.length
    ? eventUsers.map((eventUser) => ({
        ...eventUser,
        cost: eventUser.cost || 0
      }))
    : []
  console.log(allEvents)
  const filteredEvents = allEvents.filter((event) => {
    const eventDate = event.event?.date ? parseISO(event.event.date) : null
    const selectedDateObj = selectedDate ? parseISO(selectedDate) : null
    const isDateMatch = selectedDate ? isSameDay(eventDate, selectedDateObj) : true

    const eventType = event.event?.typeEvent?.toLowerCase().trim()
    const selectedType = typeEvent?.toLowerCase().trim()
    const isTypeMatch = !selectedType || eventType === selectedType

    const isFree = event.event.priceMin === 0
    const isPriceMatch = isFreeOnly ? isFree : true

    const eventCategory = event.event.category?.toLowerCase()
    console.log(eventCategory)
    const isCategoryMatch =
      selectedCategories.length === 0 || selectedCategories.includes(eventCategory)

    return isDateMatch && isTypeMatch && isPriceMatch && isCategoryMatch
  })

  return (
    <>
      <div className='flex z-10 flex-col'>
        <div className='p-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <p className='font-bold'>Filtruj po dacie:</p>
            <div className='flex flex-wrap gap-2'>
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
                className={`btn p-2 ${selectedDate ? 'active' : ''}`}
                value={selectedDate || ''}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <p className='font-bold'>Filtruj po typie:</p>
            <div className='flex flex-wrap gap-2'>
              <button className={`btn ${isFreeOnly ? 'active' : ''}`} onClick={handlePriceFilter}>
                DARMOWE
              </button>
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
        </div>

        <div className='p-4'>
          <p className='font-bold'>Filtruj kategorie:</p>
          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${selectedCategories.includes(category) ? 'active' : ''} block`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
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
