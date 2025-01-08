import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'

const ProfilePage = () => {
  const { dataProfile, loading } = useApiClient()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchDataProfile = async () => {
      try {
        // Simulate API call to get profile data
        setUserData({
          first_name: 'John',
          last_name: 'Doe',
          email: 'johndoe@example.com',
          city: 'New York',
          postal_code: '10001'
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchDataProfile()
  }, [])

  const handleEditProfile = () => {
    navigate('/profile/edit')
  }

  const handleEventConfiguration = () => {
    navigate('/events/configure')
  }
  const handleAddEvent = () => {
    navigate('/events/add')
  }
  if (loading || !userData) {
    return <p>Loading...</p>
  }

  const { first_name, last_name, email, city, postal_code } = userData

  return (
    <>
      <div className='min-h-screen w-full flex items-center justify-center '>
        <div className='bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start w-full max-w-4xl'>
          {/* Left Section */}
          <div className='flex-1 flex flex-col items-center md:items-start'>
            {/* Profile Avatar */}
            <div className='w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold'>
              {first_name[0]}
              {last_name[0]}
            </div>
            {/* User Information */}
            <div className='mt-4 text-center md:text-left'>
              <h2 className='text-lg font-bold'>{`${first_name} ${last_name}`}</h2>
              <p className='text-gray-500'>{email}</p>
            </div>
            <div className='mt-4'>
              <p className='text-gray-700'>
                <span className='font-semibold'>Miasto:</span> {city}
              </p>
              <p className='text-gray-700'>
                <span className='font-semibold'>Kod pocztowy:</span> {postal_code}
              </p>
            </div>
            <div className='flex flex-col space-y-2 p-2'>
              <button
                className='text-left font-semibold text-sm hover:underline'
                onClick={handleEditProfile}
              >
                Edytuj dane
              </button>
              <button className='text-left font-semibold text-sm hover:underline'>
                Usuń konto
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className='w-px bg-blue-300 mx-6 md:block'></div>

          {/* Right Section */}
          <div className='flex-1 flex flex-col items-center md:items-start'>
            <h3 className='text-lg font-bold'>Moje wydarzenia</h3>
            <div className='mt-4 space-y-4'>
              <button
                className='px-4 py-2 w-full bg-blue-500 text-white rounded shadow hover:bg-blue-600'
                onClick={handleAddEvent}
              >
                Dodaj wydarzenie
              </button>
              <button
                className='px-4 py-2 w-full bg-blue-500 text-white rounded shadow hover:bg-blue-600'
                onClick={handleEventConfiguration}
              >
                Zarządzaj wydarzeniami
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
