import React, { useEffect, useState } from 'react'

const LocalEventsDetails = ({ eventId }) => {
  const [event, setEvent] = useState(null)

  useEffect(() => {
    // Fetch event details by eventId
    fetch(`http://localhost:5000/api/local-events/${eventId}`)
      .then((response) => response.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error('Error fetching event details:', error))
  }, [eventId])

  if (!event) {
    return <div className='text-center mt-10'>Ładowanie szczegółów wydarzenia...</div>
  }

  const handleGoogleCalendar = () => {
    const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${event.title}&details=${event.description}&dates=${event.date}&location=${event.link}`
    window.open(googleCalendarLink, '_blank')
  }

  return (
    <div className='flex flex-col md:flex-row items-center md:items-start bg-gray-50 p-6 rounded-lg shadow-lg'>
      {/* Image container */}
      <div className='w-64 h-64 bg-blue-500 rounded-lg flex items-center justify-center'>
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

      {/* Details container */}
      <div className='ml-6 mt-6 md:mt-0 flex-1'>
        <h2 className='text-2xl font-bold text-blue-700 mb-4'>{event.title}</h2>
        <p className='mb-2'>
          <span className='font-semibold text-gray-700'>Opis:</span> {event.description}
        </p>
        <p className='mb-2'>
          <span className='font-semibold text-gray-700'>Data:</span>{' '}
          {new Date(event.date).toLocaleString()}
        </p>
        <p className='mb-4'>
          <span className='font-semibold text-gray-700'>Cena:</span>{' '}
          {event.price ? `${event.price} PLN` : 'Free'}
        </p>

        {/* Buttons */}
        <div className='flex flex-col space-y-4'>
          <a
            href={event.link}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition'
          >
            Przejdź do strony wydarzenia
          </a>
          <button
            onClick={handleGoogleCalendar}
            className='bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded hover:bg-gray-400 transition'
          >
            Zapisz w kalendarzu Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocalEventsDetails
