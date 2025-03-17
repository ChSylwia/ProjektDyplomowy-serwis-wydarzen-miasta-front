import React, { useState } from 'react'
import iconGoogle from '@/assets/https://chwile-plocka.s3.eu-north-1.amazonaws.com/google-icon-logo.svg-logo.svg'
const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false)
  const handleGoogleLogin = () => {
    setLoading(true)
    window.location.href = 'https://chwileplocka-backend-72c2516b9445.herokuapp.com/auth/google'
  }

  return (
    <>
      <button
        disabled={loading}
        onClick={handleGoogleLogin}
        className='flex items-center w-full justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300'
      >
        <img src={iconGoogle} alt='Google Icon' className='w-5 h-5' />
        <span>{loading ? 'Ładowanie...' : 'Login with Google'}</span>
      </button>
    </>
  )
}

export default GoogleLoginButton
