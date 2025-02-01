import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useApiClient from '../../components/Cookie/useApiClient'
import imageAddEvent from '@/assets/add-event.svg'

const EventEdit = () => {
  const { id } = useParams()
  const { get, post } = useApiClient()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    date: '',
    priceMin: '',
    priceMax: '',
    link: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await get(`/local-events/${id}`)
        if (response.ok) {
          const event = (await response[0]) || {}
          setFormData({
            image: event.image || '',
            title: event.title || '',
            description: event.description || '',
            date: event.date ? event.date.substring(0, 16) : '',
            priceMin: event.priceMin || '',
            priceMax: event.priceMax || '',
            link: event.link || ''
          })
          setLoading(false)
        } else {
          throw new Error('Nie udało się pobrać wydarzenia')
        }
      } catch (err) {
        setError(err.message)
        toast.error(err.message)
      }
    }
    fetchEvent()
  }, [])
  if (loading) {
    return (
      <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p class='text-lg font-semibold'>
          <span class='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const priceMin = parseFloat(formData.priceMin)
    const priceMax = parseFloat(formData.priceMax)
    const eventDate = new Date(formData.date)
    const currentDate = new Date()

    // Walidacja daty na frontendzie
    if (eventDate < currentDate) {
      setError('Data wydarzenia musi być w przyszłości.')
      toast.error('Data wydarzenia musi być w przyszłości.')
      setLoading(false)
      return
    }

    // Walidacja cen
    if (!isNaN(priceMin) && !isNaN(priceMax) && priceMin > priceMax) {
      setError('Minimalna cena nie może być większa niż maksymalna.')
      toast.error('Minimalna cena nie może być większa niż maksymalna.')
      setLoading(false)
      return
    }

    try {
      const response = await post(`/local-events/${id}/edit`, formData)
      if (response.ok) {
        toast.success('Wydarzenie zostało zaktualizowane!')
        setTimeout(() => navigate('/profile'), 2000)
      } else {
        throw new Error('Nie udało się zaktualizować wydarzenia')
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h1 className='text-2xl font-semibold mb-6'>Edycja wydarzenia</h1>
        {error && <div className='alert alert-error'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='form-control'>
            <label className='label'>Zdjęcie</label>
            <input
              type='file'
              name='image'
              accept='image/*'
              onChange={handleInputChange}
              className='file-input file-input-ghost w-full bg-tertiary'
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
            <label className='label'>Cena minimalna</label>
            <input
              type='number'
              name='priceMin'
              value={formData.priceMin}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label className='label'>Cena maksymalna</label>
            <input
              type='number'
              name='priceMax'
              value={formData.priceMax}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <button type='submit' disabled={loading} className='btn btn-primary w-full'>
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
      <ToastContainer
        position='top-right'
        autoClose={2000}
        className={'z-50 fixed top-16 right-0 m-4'}
      />
    </div>
  )
}

export default EventEdit
