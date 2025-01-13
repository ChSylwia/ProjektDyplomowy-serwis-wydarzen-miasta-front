import React from 'react'
import iconGoogle from '@/assets/google-icon-logo.svg'
const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect the user to the backend route, which will then redirect to Google
    window.location.href = 'http://127.0.0.1:8000/auth/google'
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className='flex items-center w-full justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300'
    >
      <img src={iconGoogle} alt='Google Icon' className='w-5 h-5' />
      <span>Login with Google</span>
    </button>
  )
}

export default GoogleLoginButton
