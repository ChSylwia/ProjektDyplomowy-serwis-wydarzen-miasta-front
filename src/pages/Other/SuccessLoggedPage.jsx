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
    <div className=' flex flex-col items-center justify-center bg-gray-50 z-10'>
      <div className='bg-white p-8 rounded-lg shadow-lg text-center w-11/12 max-w-md'>
        <h1 className='text-3xl font-bold text-primary mb-4'>Udało się zalogować!</h1>
        <p className='text-gray-700 text-lg mb-6'>Zostaniesz za chwilę przekierowany...</p>
        <div className='flex justify-center'>
          <div className='loading loading-dots loading-lg text-primary'></div>
        </div>
      </div>
    </div>
  )
}

export default SuccessLoggedPage
