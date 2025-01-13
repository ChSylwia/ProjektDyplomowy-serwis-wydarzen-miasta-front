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
const movies = [
  {
    id: 1,
    image: 'https://picsum.photos/400/600',
    title: 'The Great Adventure',
    description: 'A thrilling adventure that takes you to the heart of an uncharted world.',
    schedule: [
      { date: '2025-12-03', times: ['10:00', '13:30', '17:00', '20:30'] },
      { date: '2025-12-04', times: ['11:00', '14:30', '18:00', '21:30'] }
    ],
    duration: 120,
    genre: 'Adventure',
    ageRestriction: 'PG-13',
    price: 25
  },
  {
    id: 2,
    image: 'https://picsum.photos/400/600',
    title: 'Romantic Getaway',
    description: 'A heartwarming tale of love and sacrifice in the most unexpected places.',
    schedule: [
      { date: '2024-12-03', times: ['12:00', '15:30', '19:00'] },
      { date: '2024-12-04', times: ['10:00', '13:00', '16:30', '20:00'] }
    ],
    duration: 95,
    genre: 'Romance',
    ageRestriction: '12+',
    price: 20
  },
  {
    id: 3,
    image: 'https://picsum.photos/400/600',
    title: 'Sci-Fi Legends',
    description: 'An epic journey across galaxies to save the universe from an ancient evil.',
    schedule: [
      { date: '2024-12-03', times: ['09:30', '13:00', '16:30', '20:00'] },
      { date: '2024-12-04', times: ['10:30', '14:00', '17:30', '21:00'] }
    ],
    duration: 150,
    genre: 'Science Fiction',
    ageRestriction: '16+',
    price: 30
  },
  {
    id: 4,
    image: 'https://picsum.photos/400/600',
    title: 'Mystery in the Woods',
    description: 'A group of friends uncover dark secrets while camping in a mysterious forest.',
    schedule: [
      { date: '2024-12-03', times: ['11:00', '14:30', '18:00'] },
      { date: '2024-12-04', times: ['10:30', '13:00', '16:30', '20:00'] }
    ],
    duration: 110,
    genre: 'Mystery, Thriller',
    ageRestriction: '16+',
    price: 22
  },
  {
    id: 5,
    image: 'https://picsum.photos/400/600',
    title: 'Animated Tales',
    description: 'An enchanting journey through magical lands filled with laughter and lessons.',
    schedule: [
      { date: '2024-12-03', times: ['09:00', '11:30', '14:00'] },
      { date: '2024-12-04', times: ['10:00', '12:30', '15:00'] }
    ],
    duration: 90,
    genre: 'Animation, Family',
    ageRestriction: 'All Ages',
    price: 18
  },
  {
    id: 6,
    image: 'https://picsum.photos/400/600',
    title: 'Warrior of the Dawn',
    description: 'A historical epic about a legendary warrior who fought for freedom and justice.',
    schedule: [
      { date: '2024-12-03', times: ['12:00', '15:30', '19:00'] },
      { date: '2024-12-04', times: ['11:30', '14:30', '18:00', '21:00'] }
    ],
    duration: 140,
    genre: 'Historical, Action',
    ageRestriction: 'PG-13',
    price: 28
  }
]

const items = [
  {
    id: 1,
    image: 'https://picsum.photos/400/300',
    title: 'Summer Music Festival',
    content: 'Experience the best summer vibes with live music and amazing food.',
    link: 'https://example.com/summer-festival',
    cost: 120
  },
  {
    id: 2,
    image: 'https://picsum.photos/400/300',
    title: 'Tech Expo 2024',
    content: 'Discover the latest innovations in technology at this annual expo.',
    link: 'https://example.com/tech-expo',
    cost: 50
  },
  {
    id: 3,
    image: 'https://picsum.photos/400/300',
    title: 'Modern Art Exhibition',
    content: 'Explore contemporary artworks by emerging and established artists.',
    link: 'https://example.com/art-exhibition',
    cost: 75
  },
  {
    id: 4,
    image: 'https://picsum.photos/400/300',
    title: 'Global Business Conference',
    content: 'Network with industry leaders and attend insightful talks.',
    link: 'https://example.com/business-conference',
    cost: 200
  },
  {
    id: 5,
    image: 'https://picsum.photos/400/300',
    title: 'City Marathon 2024',
    content: 'Join thousands of runners in the most exciting marathon of the year.',
    link: 'https://example.com/city-marathon',
    cost: 30
  },
  {
    id: 6,
    image: 'https://picsum.photos/400/300',
    title: 'Gourmet Food Festival',
    content: 'Taste dishes from world-class chefs at this culinary event.',
    link: 'https://example.com/food-festival',
    cost: 80
  },
  {
    id: 7,
    image: 'https://picsum.photos/400/300',
    title: 'Hiking Adventure',
    content: 'Explore breathtaking trails and connect with nature.',
    link: 'https://example.com/hiking-adventure',
    cost: 40
  },
  {
    id: 8,
    image: 'https://picsum.photos/400/300',
    title: 'Coding Bootcamp',
    content: 'Learn coding skills from professionals in an intensive program.',
    link: 'https://example.com/coding-bootcamp',
    cost: 300
  },
  {
    id: 9,
    image: 'https://picsum.photos/400/300',
    title: 'E-Sports Championship',
    content: 'Watch the best gamers compete for the ultimate prize.',
    link: 'https://example.com/esports-championship',
    cost: 100
  },
  {
    id: 10,
    image: 'https://picsum.photos/400/300',
    title: 'Book Fair 2024',
    content: 'Dive into a world of books and meet your favorite authors.',
    link: 'https://example.com/book-fair',
    cost: 25
  }
]

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
    ...(items?.length
      ? items.map((item) => ({
          ...item,
          cost: item.cost || 0,
          typeEvent: 'event'
        }))
      : []),
    ...(movies?.length
      ? movies.map((movie) => ({
          ...movie,
          cost: movie.price || 0,
          typeEvent: 'movie'
        }))
      : []),
    ...(eventUsers?.length
      ? eventUsers.map((eventUser) => ({
          ...eventUser,
          cost: eventUser.cost || 0,
          typeEvent: 'user'
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
      if (!typeEvent) return true
      if (typeEvent === 'big-event') return event.typeEvent === 'event'
      if (typeEvent === 'local-event') return event.typeEvent === 'user'
      if (typeEvent === 'cinema-event') return event.typeEvent === 'movie' // Wydarzenia kinowe
      return true
    })

  return (
    <>
      <div className='flex '>
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
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto '>
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
