import React, { useState, useEffect } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UsersManagement = () => {
  const { get, post, deleteRequest } = useApiClient()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUserId, setEditingUserId] = useState(null)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    roles: '',
    username: '',
    city: '',
    postalCode: '',
    userType: '',
    termsAccepted: false
  })
  const [searchQuery, setSearchQuery] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await get('/admin/users')
      if (Array.isArray(data)) {
        setUsers(data)
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users)
      } else {
        console.error('Unexpected users data structure:', data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Błąd podczas pobierania użytkowników')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])
  const handleEditClick = (user) => {
    setEditingUserId(user.id)
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles.join(', '),
      username: user.username,
      city: user.city,
      postalCode: user.postalCode,
      userType: user.userType,
      termsAccepted: user.termsAccepted
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSave = async (userId) => {
    try {
      const rolesArray = editForm.roles.split(',').map((r) => r.trim())
      await post(`/admin/users/${userId}`, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        roles: rolesArray,
        username: editForm.username,
        city: editForm.city,
        postalCode: editForm.postalCode,
        userType: editForm.userType,
        termsAccepted: editForm.termsAccepted
      })
      toast.success('Użytkownik został zaktualizowany')

      setEditingUserId(null)
      setTimeout(() => fetchUsers(), 2000)
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error('Błąd podczas zapisywania użytkownika')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
      return
    }
    try {
      await deleteRequest(`/admin/users/${userId}`)
      toast.success('Użytkownik został usunięty')
      setTimeout(() => fetchUsers(), 2000)
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Błąd podczas usuwania użytkownika')
    }
  }

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )
  if (loading) {
    return (
      <div className='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p className='text-lg font-semibold'>
          <span className='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }
  if (!users.length) return <div className='text-center py-4'>Nie znaleziono użytkowników.</div>

  return (
    <div className='container mx-auto px-4 py-4 bg-white '>
      <h2 className='text-2xl font-bold text-primary mb-4'>Zarządzaj użytkownikami</h2>

      <div className='mb-4'>
        <input
          type='text'
          placeholder='Szukaj po emailu...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-full max-w-md'
        />
      </div>

      <div className='max-w-full mx-auto overflow-x-auto'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border px-4 py-2'>ID</th>
              <th className='border px-4 py-2'>Email</th>
              <th className='border px-4 py-2'>Imię</th>
              <th className='border px-4 py-2'>Nazwisko</th>
              {/*<th className='border px-4 py-2'>Username</th>*/}
              <th className='border px-4 py-2'>Miasto</th>
              <th className='border px-4 py-2'>Kod Pocztowy</th>
              <th className='border px-4 py-2'>Typ</th>
              <th className='border px-4 py-2'>Role</th>
              <th className='border px-4 py-2'>Zarządzaj</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className='hover:bg-gray-100'>
                <td className='border px-4 py-2'>{user.id}</td>
                <td className='border px-4 py-2'>{user.email}</td>
                <td className='border px-4 py-2'>
                  {editingUserId === user.id ? (
                    <input
                      name='firstName'
                      value={editForm.firstName}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    user.firstName
                  )}
                </td>
                <td className='border px-4 py-2'>
                  {editingUserId === user.id ? (
                    <input
                      name='lastName'
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    user.lastName
                  )}
                </td>
                {/*<td className='border px-4 py-2'>
                  {editingUserId === user.id ? (
                    <input
                      name='username'
                      value={editForm.username}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    user.username
                  )}
                </td>*/}
                <td className='border px-4 py-2'>
                  {editingUserId === user.id ? (
                    <input
                      name='city'
                      value={editForm.city}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    user.city
                  )}
                </td>
                <td className='border px-4 py-2'>
                  {editingUserId === user.id ? (
                    <input
                      name='postalCode'
                      value={editForm.postalCode}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    user.postalCode
                  )}
                </td>
                <td className='border px-4 py-2'>
                  {editingUserId === user.id ? (
                    <input
                      name='userType'
                      value={editForm.userType}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    user.userType
                  )}
                </td>
                <td className='border px-4 py-2'>
                  {editingUserId === user.id ? (
                    <input
                      name='roles'
                      value={editForm.roles}
                      onChange={handleInputChange}
                      className='border p-1 w-full'
                    />
                  ) : (
                    user.roles.join(', ')
                  )}
                </td>
                <td className='border px-4 py-2 flex space-x-2'>
                  {editingUserId === user.id ? (
                    <>
                      <button
                        className='w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
                        onClick={() => handleSave(user.id)}
                      >
                        Save
                      </button>
                      <button
                        className='bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500'
                        onClick={() => setEditingUserId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className='px-4 py-2 btn-primary bg-primary rounded text-white hover:bg-primary/90'
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className='bg-red-700/70 px-4 py-2 btn-error rounded text-white hover:bg-red-700/80'
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer
        position='top-right'
        autoClose={2000}
        className='z-50 fixed top-16 right-0 m-4'
      />
    </div>
  )
}

export default UsersManagement
