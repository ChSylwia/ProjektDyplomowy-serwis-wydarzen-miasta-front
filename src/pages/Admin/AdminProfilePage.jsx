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
      <div className='flex items-center justify-center'>
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
    <div className='grid  gap-6 w-11/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6  '>
        <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Admin panel</h2>

        <p>Welcome to the admin dashboard. You have full access here.</p>
        <div className='p-4'>
          <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
          {/* Tabs for selecting which management view to display */}
          <div className='mb-4 space-x-2'>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'localEvents' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('localEvents')}
            >
              Local Events
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'globalEvents' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('globalEvents')}
            >
              Global Events
            </button>
          </div>

          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'localEvents' && <LocalEventsManagement />}
          {activeTab === 'globalEvents' && <GlobalEventsManagement />}
        </div>
      </div>
    </div>
  )
}

export default AdminProfilePage
