import React, { useEffect, useState } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'

const LocalEventsManagement = () => {
  const { get, put, deleteRequest } = useApiClient()
  const [localEvents, setLocalEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingEventId, setEditingEventId] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    priceMin: '',
    priceMax: '',
    link: '',
    typeEvent: '',
    category: '',
    deleted: false
  })

  const fetchLocalEvents = async () => {
    setLoading(true)
    try {
      const data = await get('/admin/local-events')
      console.log('Fetched local events:', data)
      if (Array.isArray(data)) {
        setLocalEvents(data)
      } else if (data && Array.isArray(data.localEvents)) {
        setLocalEvents(data.localEvents)
      } else {
        console.error('Unexpected local events structure:', data)
      }
    } catch (error) {
      console.error('Error fetching local events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocalEvents()
  }, [])

  const handleEditClick = (event) => {
    setEditingEventId(event.id)
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date,
      priceMin: event.priceMin,
      priceMax: event.priceMax,
      link: event.link,
      typeEvent: event.typeEvent,
      category: event.category,
      deleted: event.deleted
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSave = async (eventId) => {
    try {
      await put(`/admin/local-events/${eventId}`, editForm)
      setEditingEventId(null)
      fetchLocalEvents()
    } catch (error) {
      console.error('Error saving local event:', error)
    }
  }

  const handleDelete = async (eventId) => {
    try {
      await deleteRequest(`/admin/local-events/${eventId}`)
      fetchLocalEvents()
    } catch (error) {
      console.error('Error deleting local event:', error)
    }
  }

  if (loading) return <div>Loading local events...</div>

  return (
    <div className='container mx-auto px-4 py-4'>
      <h2 className='text-xl font-bold mb-4'>Local Events Management</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse border border-gray-300'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border border-gray-300 px-4 py-2'>ID</th>
              <th className='border border-gray-300 px-4 py-2'>Title</th>
              <th className='border border-gray-300 px-4 py-2'>Description</th>
              <th className='border border-gray-300 px-4 py-2'>Date</th>
              <th className='border border-gray-300 px-4 py-2'>Price Min</th>
              <th className='border border-gray-300 px-4 py-2'>Price Max</th>
              <th className='border border-gray-300 px-4 py-2'>Link</th>
              <th className='border border-gray-300 px-4 py-2'>Type</th>
              <th className='border border-gray-300 px-4 py-2'>Category</th>
              <th className='border border-gray-300 px-4 py-2'>Deleted</th>
              <th className='border border-gray-300 px-4 py-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localEvents.map((event) => (
              <tr key={event.id} className='hover:bg-gray-50'>
                <td className='border border-gray-300 px-4 py-2'>{event.id}</td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='title'
                      value={editForm.title}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.title
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='description'
                      value={editForm.description}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.description
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='date'
                      value={editForm.date}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.date
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='priceMin'
                      value={editForm.priceMin}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.priceMin
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='priceMax'
                      value={editForm.priceMax}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.priceMax
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='link'
                      value={editForm.link}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.link
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='typeEvent'
                      value={editForm.typeEvent}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.typeEvent
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  {editingEventId === event.id ? (
                    <input
                      name='category'
                      value={editForm.category}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    event.category
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2 text-center'>
                  {editingEventId === event.id ? (
                    <input
                      type='checkbox'
                      name='deleted'
                      checked={editForm.deleted}
                      onChange={handleInputChange}
                      className='mx-auto'
                    />
                  ) : event.deleted ? (
                    'Yes'
                  ) : (
                    'No'
                  )}
                </td>
                <td className='border border-gray-300 px-4 py-2 space-x-2'>
                  {editingEventId === event.id ? (
                    <>
                      <button
                        className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600'
                        onClick={() => handleSave(event.id)}
                      >
                        Save
                      </button>
                      <button
                        className='bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600'
                        onClick={() => setEditingEventId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                        onClick={() => handleEditClick(event)}
                      >
                        Edit
                      </button>
                      <button
                        className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LocalEventsManagement
