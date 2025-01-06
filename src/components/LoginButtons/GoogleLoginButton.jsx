import React from 'react'

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect the user to the backend route, which will then redirect to Google
    window.location.href = 'http://127.0.0.1:8000/auth/google'
  }

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        padding: '10px 20px',
        backgroundColor: '#4285F4',
        color: '#fff',
        border: 'none',
        borderRadius: '4px'
      }}
    >
      Login with Google
    </button>
  )
}

export default GoogleLoginButton
