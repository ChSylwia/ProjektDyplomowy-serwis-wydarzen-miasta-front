import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

const SuccessLoggedPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Extract the token from the query parameters
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    if (token) {
      // Save the token in cookies
      Cookies.set('authToken', token, { expires: 10 }) // Token expires in 1 day
      console.log('Token saved to cookies:', token)

      // Redirect to a secure page (e.g., profile)
      setTimeout(() => {
        navigate('/profile')
      }, 2000) // Optional delay for user feedback
    } else {
      console.error('Token not found in URL')
      navigate('/login') // Redirect to login if no token
    }
  }, [location.search, navigate])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-3xl font-bold text-blue-600 mb-4'>Login Successful!</h1>
      <p className='text-gray-700'>You will be redirected shortly...</p>
    </div>
  )
}

export default SuccessLoggedPage
