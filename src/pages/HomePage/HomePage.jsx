import { useNavigate } from 'react-router-dom'
import { RouteName } from '../../constants/RouteName'
import React, { useEffect, useState } from 'react'

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

const moviesdata = [
  {
    id: 1,
    image: 'https://picsum.photos/400/600',
    title: 'The Great Adventure',
    description: 'A thrilling adventure that takes you to the heart of an uncharted world.',
    schedule: [
      { date: '2024-12-03', times: ['10:00', '13:30', '17:00', '20:30'] },
      { date: '2024-12-04', times: ['11:00', '14:30', '18:00', '21:30'] }
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

const itemsdata = [
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

const HomePage = () => {
  const [items, setItems] = useState([])
  const [movies, setMovies] = useState([])
  const [eventUsers, setEventUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        //const resItems = await fetch('http://127.0.0.1:8000/api/v1/items')
        //const resMovies = await fetch('http://127.0.0.1:8000/api/v1/movies')
        const resEvents = await fetch('http://127.0.0.1:8000/api/v1/all-local-events')

        //if (!resItems.ok || !resMovies.ok || !resEvents.ok) {
        //  throw new Error('Failed to fetch data')
        //}
        if (!resEvents.ok) {
          throw new Error('Failed to fetch data')
        }
        //const [dataItems, dataMovies, dataEvents] = await Promise.all([
        //  resItems.json(),
        //  resMovies.json(),
        //  resEvents.json()
        //])
        const [dataEvents] = await Promise.all([resEvents.json()])
        setItems(itemsdata)
        setMovies(moviesdata)
        setEventUsers(dataEvents.events || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const cardsEvent = items.map((item) => (
    <CarouselItem key={item.id} className='basis-1/3 cards-event'>
      <CardEvents item={item} />
    </CarouselItem>
  ))

  const cardsMovie = movies.map((movie) => (
    <CarouselItem key={movie.id} className='basis-1/3 cards-movie'>
      <CardCinema movie={movie} />
    </CarouselItem>
  ))
  const cardsEventUser = eventUsers.map((item) => (
    <CarouselItem key={item.id} className='basis-1/3 cards-movie'>
      <CardEventUser item={item} />
    </CarouselItem>
  ))

  const allEvents = [...cardsEvent, ...cardsMovie, ...cardsEventUser]
  const handleClickToSelectPage = (type) => {
    navigate(`${RouteName.SELECT}/${type}`)
  }
  return (
    <>
      <div></div>
      <h2>Odkryj atrakcje miasta</h2>
      <p>Wstep</p>
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto center'>
        <p> Lista wydarzeń kup bilet znajdź atrakcje dla siebie</p>
        <Carousel>
          <CarouselContent className='p-3 items-center'>{cardsEvent}</CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className='flex justify-center p-3'>
          <button
            className='btn btn-lg bg-secondary text-white hover:bg-secondary/90'
            onClick={() => handleClickToSelectPage('big-event')}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto center'>
        <p>Lista reperuaru z kina przejdź się na film</p>
        <Carousel>
          <CarouselContent className='p-3 items-center'>{cardsMovie}</CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className='flex justify-center p-3'>
          <button
            className='btn btn-lg bg-secondary text-white hover:bg-secondary/90'
            onClick={() => handleClickToSelectPage('cinema-event')}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto center '>
        <p>Lista wydarzeń od użytkowników odkryj atrakcje swojego miasta</p>
        <Carousel>
          <CarouselContent className='p-3 items-center'>{cardsEventUser}</CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className='flex justify-center p-3'>
          <button
            className='btn btn-lg bg-secondary text-white hover:bg-secondary/90'
            onClick={() => handleClickToSelectPage('local-event')}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto center '>
        <p>Lista wydarzeń od użytkowników odkryj atrakcje swojego miasta</p>
        <Carousel>
          <CarouselContent className='p-3 items-center'>
            {cardsMovie}
            {cardsEvent}
            {cardsEventUser}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className='flex justify-center p-3'>
          <button
            className='btn btn-lg bg-secondary text-white hover:bg-secondary/90'
            onClick={() => handleClickToSelectPage(null)}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
    </>
  )
}

export default HomePage
