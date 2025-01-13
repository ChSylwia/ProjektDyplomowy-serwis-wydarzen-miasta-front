import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import iconGoogle from '@/assets/google-icon-logo.svg'
const LocalEventsDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/all-local-events/${id}`)
        if (!response.ok) throw new Error('Failed to fetch event details')
        const data = await response.json()

        setEvent(data[0])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEventDetails()
  }, [id])

  const handleGoogleCalendar = () => {
    if (!event) return
    const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${event.title}&details=${event.description}&dates=${event.date}&location=${event.link}`
    window.open(googleCalendarLink, '_blank')
  }

  if (loading) return <div className='text-center mt-10'>Ładowanie szczegółów wydarzenia...</div>
  if (error) return <div className='alert alert-error'>{error}</div>
  if (!event) return <div className='text-center mt-10'>Nie znaleziono wydarzenia.</div>

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
