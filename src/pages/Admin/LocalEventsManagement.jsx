// src/pages/LocalEventsManagement.jsx
import React, { useState, useEffect } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LocalEventsManagement = () => {
  const { get, postWithFile, deleteRequest } = useApiClient()
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
    deleted: false,
    image: ''
  })
  const [search, setSearch] = useState('')

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
      toast.error('Błąd podczas pobierania wydarzeń lokalnych')
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
      deleted: event.deleted,
      image: event.image
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
      const formData = new FormData()

      Object.keys(editForm).forEach((key) => {
        if (key === 'image' && editForm[key]) {
          const fileInput = document.querySelector('input[name="image"]')
          if (fileInput.files[0]) {
            formData.append('image', fileInput.files[0])
          }
        } else {
          formData.append(key, editForm[key])
        }
      })
      await postWithFile(`/admin/local-events/${eventId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Wydarzenie lokalne zostało zaktualizowane')
      setEditingEventId(null)
      setTimeout(() => fetchLocalEvents(), 1000)
    } catch (error) {
      console.error('Error saving local event:', error)
      toast.error('Błąd podczas zapisywania wydarzenia lokalnego')
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to wydarzenie lokalne?')) {
      return
    }
    try {
      await deleteRequest(`/admin/local-events/${eventId}`)
      toast.success('Wydarzenie lokalne zostało usunięte')
      setTimeout(() => fetchLocalEvents(), 1000)
    } catch (error) {
      console.error('Error deleting local event:', error)
      toast.error('Błąd podczas usuwania wydarzenia lokalnego')
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p className='text-lg font-semibold'>
          <span className='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }
  const filteredEvents = localEvents.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='container mx-auto px-4 py-4'>
      <h2 className='text-2xl font-bold text-primary mb-4'>Zarządzaj wydarzeniami użytkowników</h2>

      <div className='mb-4'>
        <input
          type='text'
          placeholder='Wyszukaj po tytule'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded'
        />
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200 table-auto'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='py-2'>ID</th>
              <th className='py-2'>Zdjęcie</th>
              <th className='py-2'>Tytuł</th>
              <th className='py-2'>Opis</th>
              <th className='py-2'>Data</th>
              <th className='py-2'>Cena Min</th>
              <th className='py-2'>Cena Max</th>
              <th className='py-2'>Link</th>
              <th className='py-2'>Typ</th>
              <th className='py-2'>Kategoria</th>
              <th className='py-2'>Usunięty</th>
              <th className='py-2'>Zarządzaj</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event.id} className='hover:bg-gray-50'>
                <td className='border px-2 overflow-auto max-h-24'>{event.id}</td>
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
                <td className='border px-2 overflow-auto max-h-24'>
                  {editingEventId === event.id ? (
                    <input
                      name='title'
                      value={editForm.title}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
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
                <td className='border px-2 overflow-auto max-h-24'>
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
                <td className='border px-2 overflow-auto max-h-24'>
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
                <td className='border px-2 overflow-auto max-h-24'>
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
                <td className='border px-2 overflow-auto max-h-24'>
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
                <td className='border px-2 overflow-auto max-h-24'>
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
                <td className='border px-2 overflow-auto max-h-24'>
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
                <td className='border px-2 overflow-auto max-h-24 text-center'>
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
                <td className='border px-4 py-2 flex space-x-2'>
                  {editingEventId === event.id ? (
                    <>
                      <button
                        disabled={loading}
                        className='w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                        onClick={() => handleSave(event.id)}
                      >
                        Save
                      </button>
                      <button
                        className='bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500'
                        onClick={() => setEditingEventId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        disabled={loading}
                        className='px-4 py-2 btn-primary bg-primary rounded text-white hover:bg-primary/90'
                        onClick={() => handleEditClick(event)}
                      >
                        Edit
                      </button>
                      <button
                        disabled={loading}
                        className='bg-red-700/70 px-4 py-2 btn-error rounded text-white hover:bg-red-700/80'
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
      <ToastContainer
        position='top-right'
        autoClose={1000}
        className={'z-50 fixed top-16 right-0 m-4'}
      />
    </div>
  )
}

export default LocalEventsManagement
