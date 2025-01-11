import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'
import { useEffect, useState } from 'react'

const EventConfigurate = () => {
  const { get, deleteRequest } = useApiClient()
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
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
      }
    }

    fetchEvents()
  }, [])

  // Redirect to edit page
  const handleEditClick = (event) => {
    navigate(`/events/edit/${event.id}`, { state: { event } })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await deleteRequest(`/local-events/${id}`)
      if (response.ok) {
        setEvents((prev) => prev.filter((event) => event.id !== id))
      } else {
        throw new Error('Failed to delete event')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h1 className='text-2xl font-semibold mb-6'>Manage Local Events</h1>
      {error && <div className='alert alert-error mb-4'>{error}</div>}

      <div className='space-y-6'>
        {events.map((event) => (
          <div key={event.id} className='card bg-base-100 shadow-md p-4 w-full'>
            <h2 className='text-xl font-bold'>{event.title}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleString()}</p>
            <div className='mt-4 flex space-x-2'>
              <button className='btn btn-secondary' onClick={() => handleEditClick(event)}>
                Edit
              </button>
              <button className='btn btn-error' onClick={() => handleDelete(event.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventConfigurate
