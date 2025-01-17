import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import imageAddEvent from '@/assets/add-event.svg'
const EditProfilePasswdPage = () => {
  const navigate = useNavigate()
  const { post } = useApiClient()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      toast.error('New passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await post('/user/edit/passwd', {
        currentPassword,
        newPassword
      })
      setLoading(false)
      if (response.error) {
        setError(response.message)
        toast.error(response.message)
      } else {
        toast.success('Udało się zmienić hasło!')
        setTimeout(() => navigate('/profile'), 2000)
      }
    } catch (error) {
      console.log(error)

      setError('An error occurred while updating the password.')
      toast.error('Wystąpił błąd podczas zmiany hasła.')
    }
    if (loading) {
      return (
        <div class='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
          <p class='text-lg font-semibold'>
            <span class='loading loading-dots loading-lg'></span>
          </p>
        </div>
      )
    }
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-6/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-lg font-bold mb-4'>Zmień hasło</h2>
        {error && <p className='text-red-500'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='currentPassword' className='block font-medium'>
              Aktualne hasło
            </label>
            <input
              type='password'
              id='currentPassword'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className='w-full px-4 py-2 border bg-tertiary rounded-md'
              required
            />
          </div>
          <div>
            <label htmlFor='newPassword' className='block font-medium'>
              Nowe hasło
            </label>
            <input
              type='password'
              id='newPassword'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='w-full px-4 py-2 border bg-tertiary rounded-md'
              required
            />
          </div>
          <div>
            <label htmlFor='confirmPassword' className='block font-medium'>
              Powtórz nowe hasło
            </label>
            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-2 border bg-tertiary rounded-md'
              required
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button type='submit' className='w-full py-2 bg-primary text-white hover:bg-primary/90'>
              {loading ? <span>Ładowanie...</span> : 'Zmień hasło'}
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
      {/* Toast container to display toasts */}
      <ToastContainer className={'z-50 fixed top-16 right-0 m-4'} />
    </div>
  )
}

export default EditProfilePasswdPage
