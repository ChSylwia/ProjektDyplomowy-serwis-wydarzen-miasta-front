import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RouteName } from '../../constants/RouteName'

const Billboard = () => {
  // Definicja slajdów
  const slides = [
    { id: 1, src: '/assets/Most-Plock.webp', alt: 'Most w Płocku' },
    { id: 2, src: '/assets/Teatr_w_Plocku.webp', alt: 'Teatr w Płocku' },
    { id: 3, src: '/assets/Ratusz-Plock.webp', alt: 'Ratusz w Płocku' }
  ]
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className='hero-content flex-col lg:flex-row '>
      <div className='w-full lg:w-1/2'>
        <div className='relative w-full h-[300px] rounded-box overflow-hidden'>
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`
                absolute inset-0 
                transition-opacity duration-1000 ease-in-out
                ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}
              `}
            >
              <img
                src={slide.src}
                className='w-full h-full object-cover rounded-lg'
                alt={slide.alt}
              />
            </div>
          ))}
        </div>
      </div>
      <div className='text-center lg:text-left lg:w-1/2'>
        <h1 className='text-5xl font-bold'>Wydarzenia w Płocku</h1>
        <p className='py-6 text-lg'>
          Doświadcz emocji i różnorodnych wydarzeń w Płocku – od kinowych premier, poprzez spektakle
          teatralne, aż po lokalne inicjatywy i imprezy organizowane przez społeczność. Pozwól, aby
          kultura, sztuka i pasja mieszkańców wprawiły Cię w zachwyt i sprawiły, że każda chwila
          będzie wyjątkowa.
        </p>
        <button
          className='btn btn-lg bg-secondary text-white hover:bg-secondary/90'
          onClick={() => navigate(`${RouteName.WYDARZENIA}`)}
        >
          Przeglądaj listę wydarzeń
        </button>
      </div>
    </div>
  )
}

export default Billboard
