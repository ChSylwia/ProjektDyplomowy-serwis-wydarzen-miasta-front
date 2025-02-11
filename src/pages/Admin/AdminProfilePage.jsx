import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApiClient from '../../components/Cookie/useApiClient'
import UsersManagement from './UsersManagement'
import LocalEventsManagement from './LocalEventsManagement'
import GlobalEventsManagement from './GlobalEventsManagement'

const AdminProfilePage = () => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('users')
  const { getUserDetails, loading } = useApiClient()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails()
        // Check if the user has the 'ROLE_ADMIN' role.
        if (userDetails?.roles?.includes('ROLE_ADMIN')) {
          setIsAdmin(true)
        } else {
          navigate('/profile') // Redirect non-admin users.
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error)
        navigate('/login') // Redirect to login if the API call fails.
      }
    }

    fetchUserDetails()
  }, [])

  if (loading) {
    return (
      <div className='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p className='text-lg font-semibold'>
          <span className='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }

  if (!isAdmin) {
    // Optionally, you could render a "Not authorized" message here
    return null
  }

  return (
    <div className='gap-6 w-11/12 mx-auto m-8 p-4 bg-white rounded-lg shadow-lg z-10'>
      <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>Panel administracyjny</h1>
      <div className='p-2'>
        {/* Tabs for selecting which management view to display */}
        <div className='mb-4 space-x-2'>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'users' ? 'btn-primary bg-primary text-white hover:bg-primary/90' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('users')}
          >
            Użytkownicy
          </button>

          <button
            className={`px-4 py-2 rounded ${activeTab === 'localEvents' ? 'btn-primary bg-primary text-white hover:bg-primary/90' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('localEvents')}
          >
            Wydarzenia użytkowników
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === 'globalEvents' ? 'btn-primary bg-primary text-white hover:bg-primary/90' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('globalEvents')}
          >
            Wydarzenia z API
          </button>
        </div>

        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'localEvents' && <LocalEventsManagement />}
        {activeTab === 'globalEvents' && <GlobalEventsManagement />}
      </div>
    </div>
  )
}

export default AdminProfilePage
