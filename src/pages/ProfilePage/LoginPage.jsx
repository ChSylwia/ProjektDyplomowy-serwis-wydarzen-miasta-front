import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import GoogleLoginButton from '../../components/LoginButtons/GoogleLoginButton'
import { Navigate, redirect } from 'react-router-dom'
import imageAddEvent from '@/assets/add-event.svg'
import { useNavigate } from 'react-router-dom'

import { toast, ToastContainer } from 'react-toastify'

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const initialValues = {
    login: '',
    password: ''
  }

  const navigate = useNavigate()
  const validationSchema = Yup.object({
    login: Yup.string().required('Login jest wymagany'),
    password: Yup.string().required('Hasło jest wymagane')
  })

  const handleSubmit = (values) => {
    setLoading(true)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      username: values.login,
      password: values.password
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch(
      'https://chwileplocka-backend-72c2516b9445.herokuapp.com/api/v1/auth/login_check',
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw error
          })
        }
        return response.json()
      })
      .then((result) => {
        console.log('API response:', result)
        setLoading(false)
        if (result.token) {
          toast.success('Zalogowano pomyślnie!')
          setTimeout(() => {
            window.location.href = `https://www.chwileplocka.tech/success?token=${result.token}`
          }, 1000)
        } else {
          toast.error('Token not found in response.')
          console.error('Token not found in response', result)
        }
      })
      .catch((error) => {
        setLoading(false)
        toast.error('Błąd podczas logowania')
        console.error('Error:', error)
      })
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
        <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
          <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Logowanie</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <div className='form-control mb-4'>
                  <label htmlFor='login' className='label'>
                    <span className='label-text'>Login</span>
                  </label>
                  <Field
                    type='text'
                    id='login'
                    name='login'
                    className='input input-bordered w-full bg-tertiary'
                    placeholder='Wpisz login'
                  />
                  <ErrorMessage
                    name='login'
                    component='div'
                    className='text-red-500 text-sm mt-1'
                  />
                </div>

                <div className='form-control mb-4'>
                  <label htmlFor='password' className='label'>
                    <span className='label-text'>Hasło</span>
                  </label>
                  <Field
                    type='password'
                    id='password'
                    name='password'
                    className='input input-bordered w-full bg-tertiary'
                    placeholder='Wpisz hasło'
                  />
                  <ErrorMessage
                    name='password'
                    component='div'
                    className='text-red-500 text-sm mt-1'
                  />
                </div>
                <div className='text-right mb-4'>
                  <button
                    type='button'
                    onClick={() => navigate('/forgot-password')}
                    className='text-blue-500 hover:underline text-sm'
                  >
                    Zapomniałem hasła
                  </button>
                </div>

                <button
                  disabled={loading}
                  type='submit'
                  className='btn btn-primary w-full mb-4 bg-primary text-white hover:bg-primary/90'
                >
                  {loading ? 'Ładowanie...' : 'Zaloguj się'}
                </button>
                <GoogleLoginButton />
                <div className='text-center p-2'>
                  <span className='text-sm text-gray-600'>
                    Nie masz konta?{' '}
                    <a href='/register' className='text-blue-500 hover:underline'>
                      Zarejestruj się
                    </a>
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div
          className='flex items-center justify-center bg-tertiary rounded-lg p-6 image-for-forms min-h-96'
          style={{
            backgroundImage: `url(${imageAddEvent})`
          }}
        ></div>
        <ToastContainer
          position='top-right'
          autoClose={1000}
          className={'z-50 fixed top-16 right-0 m-4'}
        />
      </div>
    </>
  )
}

export default LoginPage
