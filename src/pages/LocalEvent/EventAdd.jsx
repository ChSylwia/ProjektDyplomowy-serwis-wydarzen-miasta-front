import React, { useState } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'
import imageAddEvent from '@/assets/add-event.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const EventAdd = () => {
  const { post, postWithFile } = useApiClient()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    priceMin: '',
    priceMax: '',
    category: '',
    link: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // List of category options
  const categories = ['teatr', 'muzyka', 'rodzina', 'widowisko', 'sport', 'sztuka', 'kino', 'inne']

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
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

    // Walidacja cen na frontendzie
    if (
      !isNaN(priceMin) &&
      !isNaN(priceMax) &&
      priceMin > priceMax &&
      priceMin < 0 &&
      priceMax < 0
    ) {
      setError('Minimalna cena nie może być większa niż maksymalna.')
      toast.error('Minimalna cena nie może być większa niż maksymalna.')
      setLoading(false)
      return
    }

    const formDataToSend = new FormData()
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key])
      }
    }

    try {
      console.log(formDataToSend)

      const response = await postWithFile('/local-events/create', formDataToSend)
      if (response.ok) {
        toast.success('Wydarzenie zostało pomyślnie dodane!')
        setTimeout(() => navigate('/profile'), 2000)
      } else {
        const errorMessage = response.data?.error || 'Nie udało się dodać wydarzenia'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (err) {
      setError('Błąd podczas dodawania wydarzenia. Spróbuj ponownie.')
      toast.error('Błąd podczas dodawania wydarzenia. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
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
      setFormData({ ...formData, image: file })
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h2 className='text-2xl font-semibold mb-4'>Dodaj własne wydarzenie lokalne</h2>
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
            <label htmlFor='description' className='label'>
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
            <label htmlFor='priceMin' className='label'>
              Minimalna cena (opcjonalna)
            </label>
            <input
              type='number'
              id='priceMin'
              name='priceMin'
              value={formData.priceMin}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='priceMax' className='label'>
              Maksymalna cena (opcjonalna)
            </label>
            <input
              type='number'
              id='priceMax'
              name='priceMax'
              value={formData.priceMax}
              onChange={handleInputChange}
              className='input input-bordered w-full bg-tertiary'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='category' className='label'>
              Kategoria
            </label>
            <select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleInputChange}
              required
              className='select select-bordered w-full bg-tertiary'
            >
              <option value=''>Wybierz kategorię</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
              onChange={handleFileChange}
              accept='image/*'
              className='file-input file-input-ghost w-full bg-tertiary'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-9/12 bg-primary text-white hover:bg-primary/90'
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
      <ToastContainer
        position='top-right'
        autoClose={2000}
        className={'z-50 fixed top-16 right-0 m-4'}
      />
    </div>
  )
}

export default EventAdd
