import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
        toast.success('Password updated successfully!')
        setTimeout(() => navigate('/profile'), 2000)
      }
    } catch (error) {
      console.log(error)

      setError('An error occurred while updating the password.')
      toast.error('An error occurred while updating the password.')
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-lg font-bold mb-4'>Edit Password</h2>
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
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
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
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
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
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          >
            {loading ? <span>Loading...</span> : 'Zmień hasło'}
          </button>
        </form>
      </div>

      {/* Toast container to display toasts */}
      <ToastContainer />
    </div>
  )
}

export default EditProfilePasswdPage
