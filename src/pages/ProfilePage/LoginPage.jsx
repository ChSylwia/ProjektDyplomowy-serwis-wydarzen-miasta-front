import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import GoogleLoginButton from '../../components/LoginButtons/GoogleLoginButton'

const LoginPage = () => {
  const initialValues = {
    login: '',
    password: ''
  }

  const validationSchema = Yup.object({
    login: Yup.string().required('Login jest wymagany'),
    password: Yup.string().required('Hasło jest wymagane')
  })

  const handleSubmit = (values) => {
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

    fetch('http://127.0.0.1:8000/api/v1/auth/login_check', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log('Login result:', result)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <div className='min-h-screen flex items-center justify-center '>
      <div className='w-full max-w-md bg-white shadow-md rounded-lg p-6'>
        <h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>Logowanie</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              {/* Login */}
              <div className='form-control mb-4'>
                <label htmlFor='login' className='label'>
                  <span className='label-text'>Login</span>
                </label>
                <Field
                  type='text'
                  id='login'
                  name='login'
                  className='input input-bordered w-full'
                  placeholder='Wpisz login'
                />
                <ErrorMessage name='login' component='div' className='text-red-500 text-sm mt-1' />
              </div>

              {/* Hasło */}
              <div className='form-control mb-4'>
                <label htmlFor='password' className='label'>
                  <span className='label-text'>Hasło</span>
                </label>
                <Field
                  type='password'
                  id='password'
                  name='password'
                  className='input input-bordered w-full'
                  placeholder='Wpisz hasło'
                />
                <ErrorMessage
                  name='password'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              {/* Zapomniałem hasła */}
              <div className='text-right mb-4'>
                <a href='/forgot-password' className='text-blue-500 hover:underline text-sm'>
                  Zapomniałem hasła
                </a>
              </div>

              {/* Zaloguj się */}
              <button type='submit' className='btn btn-primary w-full mb-4'>
                Zaloguj się
              </button>

              {/* Zarejestruj się */}
              <div className='text-center'>
                <span className='text-sm text-gray-600'>
                  Nie masz konta?{' '}
                  <a href='/register' className='text-blue-500 hover:underline'>
                    Zarejestruj się
                  </a>
                </span>
              </div>
              <GoogleLoginButton />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default LoginPage
