import React, { useEffect, useState } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'

const GlobalEventsManagement = () => {
  const { get, put, deleteRequest } = useApiClient()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingEventId, setEditingEventId] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    price: '',
    link: '',
    typeEvent: '',
    category: '',
    image: ''
  })

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await get('/admin/events')
      console.log('Fetched events:', data)
      // Check if data is directly an array or wrapped in an object.
      if (Array.isArray(data)) {
        setEvents(data)
      } else if (data && Array.isArray(data.events)) {
        setEvents(data.events)
      } else {
        console.error('Unexpected events structure:', data)
      }
    } catch (error) {
      console.error('Error fetching global events:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleEditClick = (event) => {
    setEditingEventId(event.id)
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date,
      price: event.price,
      link: event.link,
      typeEvent: event.typeEvent,
      category: event.category,
      image: event.image
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: value
    })
  }

  const handleSave = async (eventId) => {
    try {
      await put(`/admin/events/${eventId}`, editForm)
      setEditingEventId(null)
      fetchEvents()
    } catch (error) {
      console.error('Error saving global event:', error)
    }
  }

  const handleDelete = async (eventId) => {
    try {
      await deleteRequest(`/admin/events/${eventId}`)
      fetchEvents()
    } catch (error) {
      console.error('Error deleting global event:', error)
    }
  }

  if (loading) return <div>Loading global events...</div>

  return (
    <div className='container mx-auto px-4 py-4'>
      <h2 className='text-2xl font-bold text-blue-600 mb-4'>Global Events Management</h2>
      {loading ? (
        <div className='text-center text-blue-500'>Loading global events...</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='table table-zebra w-full border rounded-lg shadow-lg'>
            <thead className='bg-blue-500 text-white'>
              <tr>
                <th className='p-2'>ID</th>
                <th className='p-2'>Zdjęcie</th>
                <th className='p-2'>Tytuł</th>
                <th className='p-2'>Opis</th>
                <th className='p-2'>Data</th>
                <th className='p-2'>Cena</th>
                <th className='p-2'>Link</th>
                <th className='p-2'>Typ</th>
                <th className='p-2'>Kategoria</th>
                <th className='p-2'>Zarządzaj</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event.id} className='hover:bg-gray-100 '>
                  <td className='p-2 border'>{event.id}</td>
                  <td className='p-2 border'>
                    {editingEventId === event.id ? (
                      <input
                        type='file'
                        name='image'
                        onChange={handleInputChange}
                        className='file-input file-input-ghost w-full bg-tertiary'
                      />
                    ) : (
                      <img src={event.image} alt='Event' className='w-16 h-16 rounded-lg' />
                    )}
                  </td>
                  <td className='p-2 border overflow-auto max-h-24'>
                    {editingEventId === event.id ? (
                      <textarea
                        name='title'
                        value={editForm.title}
                        onChange={handleInputChange}
                        wrap='soft'
                        className='resize-none overflow-auto max-h-24 w-full p-1 border rounded'
                      />
                    ) : (
                      <div className='overflow-auto max-h-24'>{event.title}</div>
                    )}
                  </td>
                  <td className='border px-2 overflow-auto max-h-24'>
                    {editingEventId === event.id ? (
                      <textarea
                        name='description'
                        value={editForm.description}
                        onChange={handleInputChange}
                        wrap='soft'
                        className='resize-none overflow-auto max-h-24 w-full p-1 border rounded'
                      />
                    ) : (
                      <div className='overflow-auto max-h-24'>{event.description}</div>
                    )}
                  </td>
                  <td className='p-2 border'>
                    {editingEventId === event.id ? (
                      <input
                        name='date'
                        value={editForm.date}
                        onChange={handleInputChange}
                        className='border p-1'
                      />
                    ) : (
                      <div className='overflow-auto max-h-24'> event.date</div>
                    )}
                  </td>
                  <td className='p-2 border'>
                    {editingEventId === event.id ? (
                      <input
                        name='price'
                        value={editForm.price}
                        onChange={handleInputChange}
                        className='border p-1'
                      />
                    ) : (
                      <div className='overflow-auto max-h-24'> event.price</div>
                    )}
                  </td>
                  <td className='border px-2 overflow-auto max-h-24'>
                    {editingEventId === event.id ? (
                      <textarea
                        name='link'
                        value={editForm.link}
                        onChange={handleInputChange}
                        wrap='soft'
                        className='resize-none overflow-auto max-h-24 w-full p-1 border rounded'
                      />
                    ) : (
                      <div className='overflow-auto max-h-24'>{event.link}</div>
                    )}
                  </td>
                  <td className='border px-2 overflow-auto max-h-24'>
                    {editingEventId === event.id ? (
                      <textarea
                        name='typeEvent'
                        value={editForm.typeEvent}
                        onChange={handleInputChange}
                        wrap='soft'
                        className='resize-none overflow-auto max-h-24 w-full p-1 border rounded'
                      />
                    ) : (
                      <div className='overflow-auto max-h-24'>{event.typeEvent}</div>
                    )}
                  </td>
                  <td className='border px-2 overflow-auto max-h-24'>
                    {editingEventId === event.id ? (
                      <textarea
                        name='category'
                        value={editForm.category}
                        onChange={handleInputChange}
                        wrap='soft'
                        className='resize-none overflow-auto max-h-24 w-full p-1 border rounded'
                      />
                    ) : (
                      <div className='overflow-auto max-h-24'>{event.category}</div>
                    )}
                  </td>
                  <td className='p-2 border space-x-2'>
                    {editingEventId === event.id ? (
                      <>
                        <button
                          className='bg-green-500 text-white px-2 py-1 rounded'
                          onClick={() => handleSave(event.id)}
                        >
                          Save
                        </button>
                        <button
                          className='bg-gray-500 text-white px-2 py-1 rounded'
                          onClick={() => setEditingEventId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className='bg-blue-500 text-white px-2 py-1 rounded'
                          onClick={() => handleEditClick(event)}
                        >
                          Edit
                        </button>
                        <button
                          className='bg-red-500 text-white px-2 py-1 rounded'
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
      )}
    </div>
  )
}

export default GlobalEventsManagement
