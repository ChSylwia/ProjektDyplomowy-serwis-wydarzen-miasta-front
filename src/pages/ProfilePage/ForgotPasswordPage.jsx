import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const initialValues = {
    email: ''
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Wprowadź poprawny adres email').required('Email jest wymagany')
  })

  const handleSubmit = (values) => {
    setLoading(true)

    fetch('http://127.0.0.1:8000/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: values.email })
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw error
          })
        }
        return response.json()
      })
      .then((result) => {
        setLoading(false)
        toast.success('Link resetujący hasło został wysłany na Twój email!')
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      })
      .catch((error) => {
        setLoading(false)
        toast.error('Błąd podczas wysyłania linku resetującego hasło.')
        console.error('Error:', error)
      })
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg z-10'>
      <h2 className='text-2xl font-bold mb-4 text-center'>Resetuj hasło</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <div className='form-control mb-4'>
              <label htmlFor='email' className='label'>
                <span className='label-text'>Email</span>
              </label>
              <Field
                type='email'
                id='email'
                name='email'
                className='input input-bordered w-full'
                placeholder='Wpisz swój email'
              />
              <ErrorMessage name='email' component='div' className='text-red-500 text-sm mt-1' />
            </div>
            <button
              disabled={loading}
              type='submit'
              className='btn btn-primary mr-3 mb-4 bg-primary text-white hover:bg-primary/90'
            >
              {loading ? 'Przetwarzanie...' : 'Wyślij link resetujący'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/login')}
              className=' btn px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
            >
              Anuluj
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer
        position='top-right'
        autoClose={1000}
        className='z-50 fixed top-16 right-0 m-4'
      />
    </div>
  )
}

export default ForgotPasswordPage
