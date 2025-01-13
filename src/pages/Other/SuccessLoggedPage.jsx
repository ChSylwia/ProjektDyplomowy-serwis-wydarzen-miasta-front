import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

const SuccessLoggedPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    if (token) {
      Cookies.set('authToken', token, { expires: 10 })

      setTimeout(() => {
        navigate('/profile')
      }, 2000)
    } else {
      console.error('Token not found in URL')
      navigate('/login')
    }
  }, [location.search, navigate])

  return (
    <div className='min-h-full flex flex-col items-center justify-center z-10'>
      <h1 className='text-3xl font-bold text-blue-600 mb-4'>Udało się zalogować!</h1>
      <p className='text-gray-700'>Zostaniesz za chwilę przekierowany...</p>
    </div>
  )
}

export default SuccessLoggedPage
