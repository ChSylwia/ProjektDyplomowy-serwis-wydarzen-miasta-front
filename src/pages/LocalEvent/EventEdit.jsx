import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useApiClient from '../../components/Cookie/useApiClient'
import imageAddEvent from '@/assets/add-event.svg'

const EventEdit = () => {
  const { id } = useParams()
  const { get, put } = useApiClient()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    date: '',
    price: '',
    link: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await get(`/local-events/${id}`)
        if (response.ok) {
          const event = (await response[0]) || []
          setFormData({
            image: event.image || '',
            title: event.title || '',
            description: event.description || '',
            date: event.date ? event.date.substring(0, 16) : '',
            price: event.price || '',
            link: event.link || ''
          })
        } else {
          throw new Error('Failed to fetch event details')
        }
      } catch (err) {
        setError(err.message)
        toast.error(err.message) // Toast for error
      }
    }
    fetchEvent()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await put(`/local-events/${id}/edit`, formData)
      if (response.ok) {
        toast.success('Udało się zaktualizować wydarzenie!') // Success toast
        setTimeout(() => navigate('//configure'), 2000) // Redirect after success
      } else {
        throw new Error('Failed to update the event')
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message) // Error toast
    } finally {
      setLoading(false)
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

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <ToastContainer />
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h1 className='text-2xl font-semibold mb-6'>Edycja wydarzenia</h1>
        {error && <div className='alert alert-error'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='form-control'>
            <label className='label'>Zdjęcie</label>
            <input
              type='text'
              name='image'
              value={formData.image}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label className='label'>Tytuł</label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
              required
            />
          </div>
          <div className='form-control'>
            <label className='label'>Opis</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='textarea textarea-bordered w-full bg-tertiary'
              required
            ></textarea>
          </div>
          <div className='form-control'>
            <label className='label'>Data</label>
            <input
              type='datetime-local'
              name='date'
              value={formData.date}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
              required
            />
          </div>
          <div className='form-control'>
            <label className='label'>Cena</label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label className='label'>Link do wydarzenia</label>
            <input
              type='url'
              name='link'
              value={formData.link}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='btn btn-primary w-full bg-primary text-white hover:bg-primary/90'
          >
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
        </form>
      </div>

      <div
        className='flex items-center justify-center bg-tertiary rounded-lg p-6 image-for-forms'
        style={{
          backgroundImage: `url(${imageAddEvent})`
        }}
      ></div>
    </div>
  )
}

export default EventEdit
