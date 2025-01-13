import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import iconGoogle from '@/assets/google-icon-logo.svg'
import { useLocation } from 'react-router-dom'

const LocalEventsDetails = () => {
  const location = useLocation() // Access the state passed with the navigate function
  const [event, setEvent] = useState(location.state?.event)

  const handleGoogleCalendar = () => {
    if (!event) return
    const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${event.title}&details=${event.description}&dates=${event.date}&location=${event.link}`
    window.open(googleCalendarLink, '_blank')
  }
  console.log(event)

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      {/* Image */}
      <div className='flex items-center justify-center bg-tertiary rounded-lg p-6 image-for-forms'>
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className='w-full h-full object-cover rounded-lg'
          />
        ) : (
          <p className='text-white font-semibold'>Brak zdjęcia</p>
        )}
      </div>

      {/* Details */}
      <div className='ml-6 mt-6 md:mt-0 flex-1'>
        <h2 className='text-2xl font-bold  mb-4'>{event.title}</h2>
        <p>
          <span className='font-semibold'>Opis:</span> {event.description}
        </p>
        <p>
          <span className='font-semibold'>Data:</span> {new Date(event.date).toLocaleString()}
        </p>
        <p>
          <span className='font-semibold'>Cena:</span> {event.price ? `${event.price} PLN` : 'Free'}
        </p>

        <div className='mt-4 space-y-2'>
          <a
            href={event.link}
            target='_blank'
            rel='noopener noreferrer'
            className='btn btn-primary w-full bg-primary text-white hover:bg-primary/90'
          >
            Przejdź do strony wydarzenia
          </a>
          <button
            onClick={handleGoogleCalendar}
            className='flex items-center w-full justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300'
          >
            <img src={iconGoogle} alt='Google Icon' className='w-5 h-5' />
            <span>Zapisz w kalendarzu Google</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocalEventsDetails
