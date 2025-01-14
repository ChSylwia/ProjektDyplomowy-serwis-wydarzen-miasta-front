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

const HomePage = () => {
  const [event, setEvent] = useState([])
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

        setEvent(dataEvents.events || [])
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

  const cardsEvent = event
    .filter(
      (item) => item.event.typeEvent === 'big-event' // Correct comparison
    )
    .map((item) => (
      <CarouselItem key={item.event.id} className='basis-1/3 cards-event'>
        <CardEvents item={item.event} />
      </CarouselItem>
    ))

  const cardsEventUser = event
    .filter((item) => item.event.typeEvent === 'local-event') // Correct comparison
    .map((item) => (
      <CarouselItem key={item.id} className='basis-1/3 cards-movie'>
        <CardEventUser item={item} />
      </CarouselItem>
    ))

  //const cardsMovie = movies.map((movie) => (
  //  <CarouselItem key={movie.id} className='basis-1/3 cards-movie'>
  //    <CardCinema movie={movie} />
  //  </CarouselItem>
  //))

  const allEvents = [...cardsEvent, ...cardsEventUser]
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
      {/* <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto center'>
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
      </div> */}
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
