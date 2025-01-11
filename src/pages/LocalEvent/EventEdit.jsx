import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'

const EventEdit = () => {
  const { id } = useParams() // Extract the event ID from the URL
  const { get, put } = useApiClient() // Custom hook for API requests

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

  // Fetch event details on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await get(`/local-events/${id}`)
        if (response.ok) {
          const event = (await response[0]) || []
          // Populate the form with the existing event data
          setFormData({
            image: event.image || '',
            title: event.title || '',
            description: event.description || '',
            date: event.date ? event.date.substring(0, 16) : '', // Format datetime-local
            price: event.price || '',
            link: event.link || ''
          })
        } else {
          throw new Error('Failed to fetch event details')
        }
      } catch (err) {
        setError(err.message)
      }
    }
    fetchEvent()
  }, [])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Submit the updated event data
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await put(`/local-events/${id}/edit`, formData)
      if (response.ok) {
        alert('Event updated successfully!')
      } else {
        throw new Error('Failed to update the event')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h1 className='text-2xl font-semibold mb-6'>Edit Event</h1>
      {error && <div className='alert alert-error'>{error}</div>}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='form-control'>
          <label className='label'>Image URL</label>
          <input
            type='text'
            name='image'
            value={formData.image}
            onChange={handleInputChange}
            className='input input-bordered w-full'
          />
        </div>
        <div className='form-control'>
          <label className='label'>Title</label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            className='input input-bordered w-full'
            required
          />
        </div>
        <div className='form-control'>
          <label className='label'>Description</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            className='textarea textarea-bordered w-full'
            required
          ></textarea>
        </div>
        <div className='form-control'>
          <label className='label'>Date</label>
          <input
            type='datetime-local'
            name='date'
            value={formData.date}
            onChange={handleInputChange}
            className='input input-bordered w-full'
            required
          />
        </div>
        <div className='form-control'>
          <label className='label'>Price</label>
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={handleInputChange}
            className='input input-bordered w-full'
          />
        </div>
        <div className='form-control'>
          <label className='label'>Link</label>
          <input
            type='url'
            name='link'
            value={formData.link}
            onChange={handleInputChange}
            className='input input-bordered w-full'
          />
        </div>
        <button type='submit' disabled={loading} className='btn btn-primary w-full'>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default EventEdit
