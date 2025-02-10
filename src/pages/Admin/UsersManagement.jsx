// src/pages/UsersManagement.jsx
import React, { useState, useEffect } from 'react'
import useApiClient from '../../components/Cookie/useApiClient'

const UsersManagement = () => {
  const { get, put, deleteRequest } = useApiClient()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  // Track which user is being edited (by id)
  const [editingUserId, setEditingUserId] = useState(null)
  // Form state for editing
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', roles: '' })

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await get('/admin/users')
      console.log('Fetched users:', data)
      // If the API returns a plain array, use it directly;
      // if wrapped in an object (e.g. { users: [...] }), extract it.
      if (Array.isArray(data)) {
        setUsers(data)
      } else if (data && Array.isArray(data.users)) {
        setUsers(data.users)
      } else {
        console.error('Unexpected users data structure:', data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
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
      roles: user.roles.join(', ') // assuming roles is an array
    })
  }

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async (userId) => {
    try {
      // Convert roles string to array
      const rolesArray = editForm.roles.split(',').map((r) => r.trim())
      await put(`/admin/users/${userId}`, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        roles: rolesArray
      })
      setEditingUserId(null)
      fetchUsers()
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const handleDelete = async (userId) => {
    try {
      await deleteRequest(`/admin/users/${userId}`)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  if (loading) return <div>Loading users...</div>

  if (!users.length) return <div>No users found.</div>

  return (
    <div>
      <h2 className='text-xl font-bold mb-2'>Users Management</h2>
      <table className='min-w-full border'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border px-2 py-1'>ID</th>
            <th className='border px-2 py-1'>Email</th>
            <th className='border px-2 py-1'>First Name</th>
            <th className='border px-2 py-1'>Last Name</th>
            <th className='border px-2 py-1'>Roles</th>
            <th className='border px-2 py-1'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className='border px-2 py-1'>{user.id}</td>
              <td className='border px-2 py-1'>{user.email}</td>
              <td className='border px-2 py-1'>
                {editingUserId === user.id ? (
                  <input
                    name='firstName'
                    value={editForm.firstName}
                    onChange={handleInputChange}
                    className='border p-1'
                  />
                ) : (
                  user.firstName
                )}
              </td>
              <td className='border px-2 py-1'>
                {editingUserId === user.id ? (
                  <input
                    name='lastName'
                    value={editForm.lastName}
                    onChange={handleInputChange}
                    className='border p-1'
                  />
                ) : (
                  user.lastName
                )}
              </td>
              <td className='border px-2 py-1'>
                {editingUserId === user.id ? (
                  <input
                    name='roles'
                    value={editForm.roles}
                    onChange={handleInputChange}
                    className='border p-1'
                  />
                ) : (
                  user.roles.join(', ')
                )}
              </td>
              <td className='border px-2 py-1 space-x-2'>
                {editingUserId === user.id ? (
                  <>
                    <button
                      className='bg-green-500 text-white px-2 py-1 rounded'
                      onClick={() => handleSave(user.id)}
                    >
                      Save
                    </button>
                    <button
                      className='bg-gray-500 text-white px-2 py-1 rounded'
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className='bg-blue-500 text-white px-2 py-1 rounded'
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className='bg-red-500 text-white px-2 py-1 rounded'
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
  )
}

export default UsersManagement
