import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { get } = useApiClient()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchDataProfile = async () => {
      try {
        const data = await get('/user/current')

        if (data.error) {
          throw new Error(data.message)
        }

        setUserData(data.datas)
      } catch (error) {
        console.error('Error fetching profile:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchDataProfile()
  }, [])
  const handleEditPasswdProfile = () => {
    navigate('/profile/edit/passwd')
  }
  const handleEditProfile = () => {
    navigate('/profile/edit')
  }

  const handleEventConfiguration = () => {
    navigate('/events/configure')
  }

  const handleAddEvent = () => {
    navigate('/events/add')
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

  if (!userData) {
    return <p>Dane użytkownika nie są dostępne</p>
  }
  const { firstName, lastName, email, city, postalCode } = userData

  return (
    <div className='min-h-full w-full flex items-center justify-center z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 flex flex-col  md:flex-row items-center md:items-start w-full max-w-4xl'>
        <div className='flex-1 flex flex-col items-center md:items-start'>
          <div className='w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold'>
            {firstName[0]}
            {lastName[0]}
          </div>
          <div className='mt-4 text-center md:text-left'>
            <h2 className='text-lg font-bold'>{`${firstName} ${lastName}`}</h2>
            <p className='text-gray-500'>{email}</p>
          </div>
          <div className='mt-4'>
            <p className='text-gray-700'>
              <span className='font-semibold'>Miasto:</span> {city}
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Kod pocztowy:</span> {postalCode}
            </p>
          </div>
          <div className='flex flex-col space-y-2 p-2'>
            <button
              className='text-left font-semibold text-sm hover:underline'
              onClick={handleEditPasswdProfile}
            >
              Zmień hasło
            </button>
            <button
              className='text-left font-semibold text-sm hover:underline'
              onClick={handleEditProfile}
            >
              Edytuj dane
            </button>
            {/*           <button className='text-left font-semibold text-sm hover:underline'>Usuń konto</button>
             */}{' '}
          </div>
        </div>

        <div className='w-px bg-blue-300 mx-6 md:block'></div>

        <div className='flex-1 flex flex-col items-center md:items-start'>
          <h3 className='text-lg font-bold'>Moje wydarzenia</h3>
          <div className='mt-4 space-y-4'>
            <button
              className='px-4 py-2 w-full bg-primary text-white hover:bg-primary/90 rounded shadow'
              onClick={handleAddEvent}
            >
              Dodaj wydarzenie
            </button>
            <button
              className='px-4 py-2 w-full bg-primary text-white hover:bg-primary/90 rounded shadow'
              onClick={handleEventConfiguration}
            >
              Zarządzaj wydarzeniami
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
