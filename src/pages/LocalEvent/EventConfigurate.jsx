import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'
import { useEffect, useState } from 'react'

const EventConfigurate = () => {
  const { get, deleteRequest } = useApiClient()
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await get('/local-events')
        if (response.ok) {
          setEvents(response[0] || [])
        } else {
          const errorText = await response.text()
          throw new Error(`Failed to fetch events: ${errorText}`)
        }
      } catch (err) {
        console.error('Fetch Events Error:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Redirect to edit page
  const handleEditClick = (event) => {
    navigate(`/events/edit/${event.id}`, { state: { event } })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Na pewno chcesz usunąć to wydarzenie?')) return

    try {
      const response = await deleteRequest(`/local-events/${id}`)
      if (response.ok) {
        setEvents((prev) => prev.filter((event) => event.id !== id)) // Optionally remove from UI
      } else {
        throw new Error('Failed to delete event')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p class='text-lg font-semibold'>
          <span class='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }
  return (
    <div className='w-9/12 mx-auto p-6 bg-white rounded-lg shadow-lg z-10 m-8'>
      <h1 className='text-2xl text-center font-semibold mb-6'>
        Zarządzaj swoimi lokalnymi wydarzeniami
      </h1>
      {error && <div className='alert alert-error mb-4'>{error}</div>}
      {events.length === 0 ? (
        <div className='text-center'>
          <p className='text-lg'>Brak wydarzeń</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 bg-white'>
          {events.map((event) => (
            <div key={event.id} className='card shadow-lg p-4 bg-white '>
              <figure>
                <img
                  src={event.image}
                  alt={event.title}
                  className='max-h-36 w-full object-cover rounded-md'
                />
              </figure>
              <h2 className='text-xl font-bold mt-4'>{event.title}</h2>
              <p className='text-gray-700'>{event.description}</p>
              <p className='text-sm text-gray-500'>{new Date(event.date).toLocaleString()}</p>
              <div className='mt-4 flex space-x-2'>
                <button
                  className='btn btn-secondary bg-primary text-white'
                  onClick={() => handleEditClick(event)}
                >
                  Edyttuj
                </button>
                <button className='btn btn-error text-white' onClick={() => handleDelete(event.id)}>
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventConfigurate
