import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useApiClient from '../../components/Cookie/useApiClient'
import imageAddEvent from '@/assets/add-event.svg'

const EventEdit = () => {
  const { id } = useParams()
  const { get, postWithFile } = useApiClient()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    date: '',
    priceMin: '',
    priceMax: '',
    link: '',
    category: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const categories = ['teatr', 'muzyka', 'rodzina', 'widowisko', 'sport', 'sztuka', 'kino', 'inne']
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await get(`/local-events/${id}`)
        if (response.ok) {
          console.log(response)

          const event = (await response[0]) || {}
          setFormData({
            image: event.image || '',
            title: event.title || '',
            description: event.description || '',
            date: event.date ? event.date.substring(0, 16) : '',
            priceMin:
              event.priceMin !== null && event.priceMin !== undefined
                ? event.priceMin.toString()
                : '',
            priceMax:
              event.priceMax !== null && event.priceMax !== undefined
                ? event.priceMax.toString()
                : '',
            link: event.link || '',
            category: event.category || ''
          })
          console.log(event)

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
  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (!allowedTypes.includes(file.type)) {
        setError('Niepoprawny format pliku. Dozwolone: JPG, PNG, GIF.')
        toast.error('Niepoprawny format pliku. Dozwolone: JPG, PNG, GIF.')
        return
      }

      if (file.size > maxSize) {
        setError('Plik jest za duży. Maksymalny rozmiar: 2MB.')
        toast.error('Plik jest za duży. Maksymalny rozmiar: 2MB.')
        return
      }

      setError(null)
      setFormData((prev) => ({
        ...prev,
        image: file, // Plik do wysłania
        imagePreview: URL.createObjectURL(file) // Podgląd dla użytkownika
      }))
    }
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
    if (!isNaN(priceMin) && priceMin < 0) {
      toast.error('Minimalna cena nie może być ujemna.')
      setLoading(false)
      return
    }

    if (!isNaN(priceMax) && priceMax < 0) {
      toast.error('Maksymalna cena nie może być ujemna.')
      setLoading(false)
      return
    }
    if (!isNaN(priceMin) && !isNaN(priceMax) && priceMin > priceMax) {
      setError('Minimalna cena nie może być większa niż maksymalna.')
      toast.error('Minimalna cena nie może być większa niż maksymalna.')
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('date', formData.date)
      formDataToSend.append('priceMin', formData.priceMin !== '' ? formData.priceMin : '0')
      formDataToSend.append('priceMax', formData.priceMax !== '' ? formData.priceMax : '0')
      formDataToSend.append('link', formData.link !== '' ? formData.link : '')
      formDataToSend.append('category', formData.category !== '' ? formData.category : '')

      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const response = await postWithFile(`/local-events/${id}/edit`, formDataToSend)

      console.log('Server response:', response) // <-- Debugowanie
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
              onChange={handleFileChange}
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
          <div className='form-control'>
            <label className='label'>Link</label>
            <input
              type='text'
              name='link'
              value={formData.link}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label className='label'>Kategoria</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              className='select select-bordered w-full bg-tertiary'
              required
            >
              <option value='' disabled>
                Wybierz kategorię
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
