import { useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const useApiClient = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getToken = () => Cookies.get('authToken')

  const reauthenticate = () => {
    navigate('/login')
  }

  const request = async (endpoint, method = 'GET', payload = null) => {
    setLoading(true)
    const token = getToken()
    if (!token) throw new Error('No authorization token found')

    const headers = new Headers()
    headers.append('Authorization', `Bearer ${token}`)
    headers.append('Content-Type', 'application/json')

    const requestOptions = { method, headers, redirect: 'follow' }
    if (payload) requestOptions.body = JSON.stringify(payload)

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1${endpoint}`, requestOptions)
      if (response.status === 401) {
        const errorResponse = await response.json()
        if (errorResponse.code === 401 && errorResponse.message === 'Expired JWT Token') {
          reauthenticate()
          return
        }
      }
      const result = await response.json()
      return result
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const get = (endpoint) => request(endpoint, 'GET')
  const post = (endpoint, payload) => request(endpoint, 'POST', payload)
  const put = (endpoint, payload) => request(endpoint, 'PUT', payload)
  const deleteRequest = (endpoint) => request(endpoint, 'DELETE')

  return { get, post, put, deleteRequest, loading }
}

export default useApiClient
