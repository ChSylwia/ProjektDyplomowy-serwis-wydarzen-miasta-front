import React, { useEffect, useState } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GlobalEventsManagement = () => {
  const { get, postWithFile, deleteRequest } = useApiClient()
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
    image: null
  })
  // Stan do filtrowania po tytule
  const [search, setSearch] = useState('')

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await get('/admin/events')
      console.log('Fetched events:', data)
      if (Array.isArray(data)) {
        setEvents(data)
      } else if (data && Array.isArray(data.events)) {
        setEvents(data.events)
      } else {
        console.error('Unexpected events structure:', data)
      }
    } catch (error) {
      console.error('Error fetching global events:', error)
      toast.error('Błąd podczas pobierania wydarzeń')
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
    const { name, type, value, files } = e.target
    if (type === 'file') {
      // If the file is changed, store the File object in state
      setEditForm({
        ...editForm,
        [name]: files[0]
      })
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      })
    }
  }
  const handleSave = async (eventId) => {
    try {
      const formData = new FormData()

      // Append all fields from editForm.
      // For image, check if a new File was provided.
      Object.keys(editForm).forEach((key) => {
        if (key === 'image' && editForm.image instanceof File) {
          formData.append('image', editForm.image)
        } else {
          formData.append(key, editForm[key])
        }
      })

      // DO NOT manually set the Content-Type header!
      await postWithFile(`/admin/events/${eventId}`, formData)

      toast.success('Zapisano zmiany')
      setEditingEventId(null)
      setTimeout(() => fetchEvents(), 2000)
    } catch (error) {
      toast.error('Wystąpił błąd podczas zapisywania zmian')
      console.error('Error saving global event:', error)
    }
  }

  const handleDelete = async (eventId) => {
    // Potwierdzenie usunięcia
    const confirmDelete = window.confirm('Czy na pewno chcesz usunąć ten element?')
    if (!confirmDelete) return

    try {
      await deleteRequest(`/admin/events/${eventId}`)
      toast.success('Element został usunięty pomyślnie')
      setTimeout(() => fetchEvents(), 2000)
    } catch (error) {
      toast.error('Wystąpił błąd podczas usuwania elementu')
      console.error('Error deleting global event:', error)
    }
  }

  // Filtrowanie wydarzeń po tytule
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p className='text-lg font-semibold'>
          <span className='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }
  return (
    <div className='container mx-auto px-4 py-4'>
      <h2 className='text-2xl font-bold text-primary mb-4'>Global Events Management</h2>

      {/* Input do wyszukiwania po tytule */}
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
              <th className='py-2'>Cena</th>
              <th className='py-2'>Link</th>
              <th className='py-2'>Typ</th>
              <th className='py-2'>Kategoria</th>
              <th className='py-2'>Zarządzaj</th>
            </tr>
          </thead>

          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredEvents.map((event) => (
              <tr key={event.id} className='hover:bg-gray-100'>
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
                    <div className='overflow-auto max-h-24'>{event.date}</div>
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
                    <div className='overflow-auto max-h-24'>{event.price}</div>
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
                <td className='border px-4 py-2 flex space-x-2'>
                  {editingEventId === event.id ? (
                    <>
                      <button
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
                        className='px-4 py-2 btn-primary bg-primary rounded text-white hover:bg-primary/90'
                        onClick={() => handleEditClick(event)}
                      >
                        Edit
                      </button>
                      <button
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
        {filteredEvents.length === 0 && (
          <div className='text-center text-gray-500 mt-4'>Brak wyników dla wyszukiwania.</div>
        )}
      </div>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        className={'z-50 fixed top-16 right-0 m-4'}
      />
    </div>
  )
}

export default GlobalEventsManagement
