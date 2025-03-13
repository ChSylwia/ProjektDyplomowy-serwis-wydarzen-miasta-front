import CardCinema from '../../components/Cards/CardCinema'
import CardEvents from '../../components/Cards/CardEvents'
import CardEventUser from '../../components/Cards/CardEventUser'
import { format, addDays, isSameDay, parseISO, startOfDay, endOfDay } from 'date-fns'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const categories = ['teatr', 'muzyka', 'rodzina', 'widowisko', 'sport', 'sztuka', 'kino', 'inne']

const SelectPage = () => {
  const { type } = useParams()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)

  const [typeEvent, setTypeEvent] = useState(type || null)
  const [eventUsers, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isFreeOnly, setIsFreeOnly] = useState(false)
  const [filterTitle, setFilterTitle] = useState('')

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
        const response = await fetch(
          `https://chwileplocka-backend-72c2516b9445.herokuapp.com/api/v1/all-local-events/`
        )
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

  const filteredEvents = allEvents.filter((event) => {
    const eventDate = event.event?.date ? parseISO(event.event.date) : null
    let dateMatch = true

    if (selectedStartDate && selectedEndDate) {
      const start = startOfDay(parseISO(selectedStartDate))
      const end = endOfDay(parseISO(selectedEndDate))
      dateMatch = eventDate >= start && eventDate <= end
    } else if (selectedDate) {
      dateMatch = isSameDay(eventDate, parseISO(selectedDate))
    }

    const eventType = event.event?.typeEvent?.toLowerCase().trim()
    const selectedType = typeEvent?.toLowerCase().trim()
    const isTypeMatch = !selectedType || eventType === selectedType

    const isFree =
      event.event.priceMin === 0 ||
      event.event.priceMin === 0.0 ||
      event.event.priceMin === '.00' ||
      event.event.priceMin === '0'
    const isPriceMatch = isFreeOnly ? isFree : true

    // Ensure eventCategories is an array of lowercase strings
    const eventCategories = Array.isArray(event.event.category)
      ? event.event.category.map((cat) => cat.toLowerCase())
      : []
    const isCategoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.some((selectedCat) => eventCategories.includes(selectedCat.toLowerCase()))

    let titleMatch = true
    if (filterTitle) {
      titleMatch = event.event.title?.toLowerCase().includes(filterTitle.toLowerCase())
    }

    return dateMatch && isTypeMatch && isPriceMatch && isCategoryMatch && titleMatch
  })

  filteredEvents.sort((a, b) => parseISO(a.event.date) - parseISO(b.event.date))

  return (
    <>
      <div className='bg-white rounded-lg shadow-lg p-4 mb-4 z-40 '>
        <div className='flex z-10 flex-col'>
          <div className='p-4  sm:grid-cols-2 gap-12 flex justify-center align-center'>
            <div className='flex flex-col justify-end'>
              <div className='flex flex-row items-end gap-12'>
                <div>
                  <p className='font-bold'>Filtruj po dacie:</p>
                  <div className='flex gap-2'>
                    <button
                      className={`btn ${selectedDate === format(new Date(), 'yyyy-MM-dd') ? 'active' : ''}`}
                      onClick={() => {
                        const newDate =
                          selectedDate === format(new Date(), 'yyyy-MM-dd')
                            ? null
                            : format(new Date(), 'yyyy-MM-dd')
                        setSelectedDate(newDate)
                        setSelectedStartDate(null)
                        setSelectedEndDate(null)
                      }}
                    >
                      DZIŚ
                    </button>
                    <button
                      className={`btn ${
                        selectedDate === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => {
                        const newDate =
                          selectedDate === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                            ? null
                            : format(addDays(new Date(), 1), 'yyyy-MM-dd')
                        setSelectedDate(newDate)
                        setSelectedStartDate(null)
                        setSelectedEndDate(null)
                      }}
                    >
                      JUTRO
                    </button>
                    <input
                      type='date'
                      className={`btn p-2 ${selectedDate ? 'active' : ''}`}
                      value={selectedDate || ''}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      onChange={(e) => {
                        setSelectedDate(e.target.value)
                        setSelectedStartDate(null)
                        setSelectedEndDate(null)
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className='font-bold'>Zakres daty:</p>
                  <div className='flex gap-2'>
                    <input
                      type='date'
                      className='btn p-2'
                      placeholder='Od'
                      value={selectedStartDate || ''}
                      min={format(new Date(), "yyyy-MM-dd'T")}
                      onChange={(e) => {
                        const newStartDate = e.target.value
                        setSelectedStartDate(newStartDate)
                        if (selectedEndDate && newStartDate > selectedEndDate) {
                          setSelectedEndDate('')
                        }
                        setSelectedDate(null)
                      }}
                    />
                    <input
                      type='date'
                      className='btn p-2'
                      placeholder='Do'
                      value={selectedEndDate || ''}
                      min={selectedStartDate || format(new Date(), "yyyy-MM-dd'T")}
                      onChange={(e) => {
                        setSelectedEndDate(e.target.value)
                        setSelectedDate(null)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-end '>
              <p className='font-bold'>Filtruj po typie:</p>
              <div className='flex flex-wrap gap-2'>
                <button className={`btn ${isFreeOnly ? 'active' : ''}`} onClick={handlePriceFilter}>
                  BEZPŁATNE
                </button>
                <button
                  className={`btn ${typeEvent === 'local-event' ? 'active' : ''}`}
                  onClick={() => handleFiltertypeEvent('local-event')}
                >
                  LOKALNE
                </button>
                <button
                  className={`btn ${typeEvent === 'big-event' ? 'active' : ''}`}
                  onClick={() => handleFiltertypeEvent('big-event')}
                >
                  Z BILETEM
                </button>
                <button
                  className={`btn ${typeEvent === 'cinema' ? 'active' : ''}`}
                  onClick={() => handleFiltertypeEvent('cinema')}
                >
                  NOVEKINO
                </button>
              </div>
            </div>
          </div>

          <div className='p-4 '>
            <p className='font-bold'>Filtruj po kategorii:</p>
            <div className='flex flex-wrap gap-2 justify-center align-center '>
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
          <div className='p-4'>
            <input
              type='text'
              className='w-full p-2 border border-gray-300 rounded'
              placeholder='Wpisz tytuł wydarzenia...'
              value={filterTitle}
              onChange={(e) => setFilterTitle(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto z-10'>
        <div className='wrapper-for-elements-smaller grid grid-cols-1 md:grid-cols-3 gap-4'>
          {filteredEvents.map((event) =>
            event.event.typeEvent === 'cinema' ? (
              <CardCinema key={`C${event.event.id}`} movie={event.event} />
            ) : event.event.typeEvent === 'local-event' ? (
              <CardEvents key={`E${event.event.id}`} item={event.event} />
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
