import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import imageAddEvent from '@/assets/add-event.svg'
const EditProfilePage = () => {
  const navigate = useNavigate()
  const { get, put } = useApiClient()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    postalCode: ''
  })

  useEffect(() => {
    const fetchDataProfile = async () => {
      try {
        const data = await get('/user/current')

        if (data.error) {
          throw new Error(data.message)
        }

        setUserData(data.datas)
        setFormData({
          firstName: data.datas.firstName,
          lastName: data.datas.lastName,
          email: data.datas.email,
          city: data.datas.city,
          postalCode: data.datas.postalCode
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchDataProfile()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await put(`/user/edit/${userData.id}`, formData)
      if (response.error) {
        toast.error(response.message || 'Wystąpił błąd')
      } else {
        toast.success('Profil został pomyślnie zaktualizowany!')
        setTimeout(() => navigate('/profile'), 2000)
      }
    } catch (error) {
      toast.error('Nie udało się zaktualizować profilu.')
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (!userData) {
    return <p>Dane użytkownika nie są dostępne</p>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h2 className='text-lg font-bold mb-4'>Edytuj profil</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Form Fields */}
          <div>
            <label htmlFor='firstName' className='block text-sm font-semibold'>
              Imię
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='w-full p-2 border  bg-tertiary rounded'
            />
          </div>
          <div>
            <label htmlFor='lastName' className='block text-sm font-semibold'>
              Nazwisko
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='w-full p-2 border bg-tertiary rounded'
            />
          </div>
          <div>
            <label htmlFor='email' className='block text-sm font-semibold'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-2 border bg-tertiary rounded'
            />
          </div>
          <div>
            <label htmlFor='city' className='block text-sm font-semibold'>
              Miasto
            </label>
            <input
              type='text'
              id='city'
              name='city'
              value={formData.city}
              onChange={handleChange}
              className='w-full p-2 border bg-tertiary rounded'
            />
          </div>
          <div>
            <label htmlFor='postalCode' className='block text-sm font-semibold'>
              Kod pocztowy
            </label>
            <input
              type='text'
              id='postalCode'
              name='postalCode'
              value={formData.postalCode}
              onChange={handleChange}
              className='w-full p-2 border bg-tertiary rounded'
            />
          </div>
          {/* Buttons */}
          <div className='flex justify-end space-x-4'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              Zapisz zmiany
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
      <ToastContainer position='top-right' autoClose={2000} />
    </div>
  )
}

export default EditProfilePage
