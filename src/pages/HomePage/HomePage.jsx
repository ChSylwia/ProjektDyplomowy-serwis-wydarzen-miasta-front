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
import Billboard from './Billboard'

const HomePage = () => {
  const [event, setEvent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resEvents = await fetch('http://127.0.0.1:8000/api/v1/all-local-events')

        if (!resEvents.ok) {
          throw new Error('Nie udało się pobrać danych')
        }
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
  if (loading) {
    return (
      <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p class='text-lg font-semibold'>
          <span class='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }
  if (error) return <div>Błąd: {error}</div>

  const cardsEvent = event
    .filter((item) => item.event.typeEvent === 'big-event')
    .map((item) => (
      <CarouselItem key={item.event.id} className='basis-1/3 flex cards-event'>
        <CardEvents item={item.event} />
      </CarouselItem>
    ))

  const cardsEventUser = event
    .filter((item) => item.event.typeEvent === 'local-event')
    .map((item) => (
      <CarouselItem key={item.id} className='basis-1/3 flex cards-movie'>
        <CardEventUser item={item} />
      </CarouselItem>
    ))
  const cardsMovie = event
    .filter((item) => item.event.typeEvent === 'cinema')
    .map((movie) => (
      <CarouselItem key={movie.event.id} className='basis-1/3 cards-movie'>
        <CardCinema movie={movie.event} />
      </CarouselItem>
    ))

  const handleClickToSelectPage = (type) => {
    navigate(`${RouteName.WYDARZENIA}/${type}`)
  }
  return (
    <>
      <Billboard />
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto center'>
        <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
          <p class='text-lg font-semibold'> Lista wydarzeń z biletem w mieście Płock</p>
        </div>
        <Carousel>
          <CarouselContent className='p-3 items-normal'>{cardsEvent}</CarouselContent>
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
      <div className='wapper-for-carousel w-full max-w-screen-xl mx-auto center '>
        <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
          <p class='text-lg font-semibold'> Lista repertuaru kina Przedwiośnie miasta Płock</p>
        </div>
        <Carousel>
          <CarouselContent className='p-3 items-normal'>{cardsMovie}</CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className='flex justify-center p-3'>
          <button
            className='btn btn-lg bg-secondary text-white hover:bg-secondary/90'
            onClick={() => handleClickToSelectPage('cinema')}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
      <div className='wapper-for-carousel gap-4 w-full max-w-screen-xl mx-auto center '>
        <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
          <p class='text-lg font-semibold'> Lista wydarzeń lokalnych miasta Płock</p>
        </div>
        <Carousel>
          <CarouselContent className='p-3 items-normal '>{cardsEventUser}</CarouselContent>
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
        <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
          <p class='text-lg font-semibold'>
            {' '}
            Dla niezdecydowanych wszystkie wydarzenia miasta Płock
          </p>
        </div>
        <Carousel>
          <CarouselContent className='p-3 items-normal'>
            {cardsEvent}
            {cardsEventUser}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className='flex justify-center p-3'>
          <button
            className='btn btn-lg bg-secondary text-white hover:bg-secondary/90'
            onClick={() => navigate(`${RouteName.WYDARZENIA}`)}
          >
            Zobacz więcej
          </button>
        </div>
      </div>
    </>
  )
}

export default HomePage
