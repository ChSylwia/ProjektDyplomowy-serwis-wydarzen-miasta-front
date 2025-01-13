import React, { useState } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'
import imageAddEvent from '@/assets/add-event.svg'

import { useNavigate } from 'react-router-dom'
const EventAdd = () => {
  const { post } = useApiClient()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    price: '',
    link: '',
    image: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await post('/local-events/create', formData)

      if (response.ok) {
        setSuccess(true)
        setFormData({
          title: '',
          description: '',
          date: '',
          price: '',
          link: '',
          image: ''
        })
      } else {
        throw new Error('Failed to add event')
      }
    } catch (err) {
      setError('Error while creating event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h2 className='text-2xl font-semibold mb-4'>Dodaj własne wydarzenie lokalne</h2>
        {success && <div className='alert alert-success mb-4'>Udało się dodać wydarzenie!</div>}
        {error && <div className='alert alert-error mb-4'>{error}</div>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='form-control'>
            <label htmlFor='title' className='label'>
              Tytuł wydarzenia
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              required
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='description' className='label '>
              Opis wydarzenia
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              required
              className='textarea textarea-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='date' className='label'>
              Data wydarzenia
            </label>
            <input
              type='datetime-local'
              id='date'
              name='date'
              value={formData.date}
              onChange={handleInputChange}
              required
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='price' className='label'>
              Cena wydarzenia (opcjonalna)
            </label>
            <input
              type='number'
              id='price'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='link' className='label'>
              Link do wydarzenia (opcjonalny)
            </label>
            <input
              type='url'
              id='link'
              name='link'
              value={formData.link}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='image' className='label'>
              Dodaj zdjęcie
            </label>

            <input
              type='file'
              id='image'
              name='image'
              onChange={handleInputChange}
              accept='image/*'
              className='file-input file-input-ghost w-full  bg-tertiary'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-10/12 bg-primary text-white hover:bg-primary/90'
            >
              {loading ? 'Dodawanie...' : 'Dodaj wydarzenie'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/profile')}
              className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
            >
              Anuluj
            </button>
          </div>
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

export default EventAdd
