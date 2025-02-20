import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import iconGoogle from '@/assets/google-icon-logo.svg'
import useApiClient from '../../components/Cookie/useApiClient'
import { toast, ToastContainer } from 'react-toastify'

const LocalEventsDetails = () => {
  const location = useLocation()
  const [event, setEvent] = useState(location.state?.event)
  const { getToken, getUserDetails, post } = useApiClient()
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSaveOptions, setShowSaveOptions] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    const fetchUserType = async () => {
      try {
        const userDetails = await getUserDetails()
        setUserType(userDetails.user_type)
      } catch (error) {
        console.error('Error fetching user details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserType()
  }, [])

  const handleGoogleCalendar = async () => {
    setLoading(true)
    const token = getToken()

    if (!token || userType !== 'google') {
      window.location.href = 'http://127.0.0.1:8000/auth/google'
      setLoading(false)

      return
    }

    try {
      const response = await post('/google/calendar/events', {
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.link
      })

      if (response?.message === 'Event successfully created.') {
        toast.success('Wydarzenie zapisano do Google Calendar!')
      } else {
        toast.error('Nie udało się zapisać wydarzenia.')
      }
    } catch (error) {
      toast.error('Wykryto błąd podczas zapisywania wydarzenia.')
    } finally {
      setLoading(false)
    }
  }

  const generateICS = () => {
    const startDate = new Date(event.date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My App//EN
BEGIN:VEVENT
UID:${Date.now()}@myapp.com
DTSTAMP:${startDate}
DTSTART:${startDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.link}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Plik .ics został pobrany!')
  }
  /*const sendICSByEmail = async () => {
    try {
      const response = await post('/sendEventEmail', {
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.link
      })

      if (response.message === 'Email sent successfully.') {
        toast.success('Wydarzenie zostało wysłane na e-mail!')
      } else {
        toast.error('Nie udało się wysłać e-maila.')
      }
    } catch (error) {
      console.error('Email error:', error)
      toast.error('Wykryto błąd podczas wysyłania e-maila.')
    }
  }
*/
  const getPriceText = (min, max) => {
    if (min == null && max == null) {
      return 'Odwiedź stronę wydarzenia, aby dowiedzieć się więcej'
    }
    if ((min === 0 || min == null) && (max === 0 || max == null)) {
      return 'Za darmo'
    }
    if (min != null && max != null) {
      return min !== max ? `Cena: ${min} zł - ${max} zł` : `Cena: ${min} zł`
    }
    return `Cena: ${min ?? max} zł`
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='flex items-center justify-center bg-tertiary rounded-lg p-6 image-for-forms'>
        {event?.image ? (
          <img
            src={event.image}
            alt={event.title}
            className='w-full h-full object-cover rounded-lg'
          />
        ) : (
          <p className='text-white font-semibold'>Brak zdjęcia</p>
        )}
      </div>
      <div className='ml-6 mt-6 md:mt-0 flex-1'>
        <h2 className='text-2xl font-bold mb-4'>{event?.title || 'Brak tytułu'}</h2>
        <p>
          <span className='font-semibold'>Opis:</span> {event?.description || 'Brak opisu'}
        </p>
        <p>
          <span className='font-semibold'>Data:</span>{' '}
          {event?.date ? new Date(event.date).toLocaleString() : 'Brak daty'}
        </p>
        <p>
          <span className='font-semibold'>Cena: </span>
          {getPriceText(event.priceMin, event.priceMax)}
        </p>

        <div className='mt-4 space-y-2'>
          {event?.link && (
            <a
              href={event.link}
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-primary w-full bg-primary text-white hover:bg-primary/90'
            >
              Przejdź do strony wydarzenia
            </a>
          )}

          <div className='relative inline-block w-full'>
            <button
              onClick={() => setShowSaveOptions((prev) => !prev)}
              disabled={loading}
              className='flex items-center w-full justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500'
            >
              <img src={iconGoogle} alt='Google Icon' className='w-5 h-5' />
              {loading ? 'Ładowanie...' : 'Zapisz wydarzenie'}
            </button>
            {showSaveOptions && (
              <div className='absolute right-0 mt-2 w-full bg-gray-100 rounded-md shadow-lg z-20'>
                <button
                  onClick={() => {
                    handleGoogleCalendar()
                    setShowSaveOptions(false)
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-black hover:bg-tertiary'
                >
                  Zapisz do Google Calendar
                </button>
                <button
                  onClick={() => {
                    generateICS()
                    setShowSaveOptions(false)
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-black hover:bg-tertiary'
                >
                  Pobierz plik .ICS
                </button>
              </div>
            )}
          </div>

          {/*<button
            onClick={sendICSByEmail}
            className='w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500'
          >
            Wyślij wydarzenie na e-mail
          </button>*/}
        </div>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={1000}
        className='z-50 fixed top-16 right-0 m-4'
      />{' '}
    </div>
  )
}

export default LocalEventsDetails
