import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

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
    <div className='flex flex-col md:flex-row items-center bg-gray-50 p-6 rounded-lg shadow-lg'>
      {/* Image */}
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

      {/* Details */}
      <div className='ml-6 mt-6 md:mt-0 flex-1'>
        <h2 className='text-2xl font-bold text-blue-700 mb-4'>{event.title}</h2>
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
            className='btn btn-primary w-full'
          >
            Przejdź do strony wydarzenia
          </a>
          <button onClick={handleGoogleCalendar} className='btn btn-outline w-full'>
            Zapisz w kalendarzu Google
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocalEventsDetails
