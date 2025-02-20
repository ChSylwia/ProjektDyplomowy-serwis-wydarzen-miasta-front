import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import useApiClient from '../../components/Cookie/useApiClient'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import imageAddEvent from '@/assets/add-event.svg'

const EditProfilePage = () => {
  const navigate = useNavigate()
  const { get, put } = useApiClient()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Imię jest wymagane'),
    lastName: Yup.string().required('Nazwisko jest wymagane'),
    email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
    city: Yup.string().required('Miasto jest wymagane')
  })

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await put(`/user/edit/${userData.id}`, values)
      if (response.error) {
        toast.error(response.message || 'Wystąpił błąd')
      } else {
        toast.success('Profil został pomyślnie zaktualizowany!')
        setTimeout(() => navigate('/profile'), 1000)
      }
    } catch (error) {
      toast.error('Nie udało się zaktualizować profilu.')
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center bg-white rounded-lg shadow-lg p-6 z-10'>
        <p className='text-lg font-semibold'>
          <span className='loading loading-dots loading-lg'></span>
        </p>
      </div>
    )
  }

  if (!userData) {
    return <p>Dane użytkownika nie są dostępne</p>
  }

  const formInitialValues = {
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    city: userData.city || ''
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h2 className='text-lg font-bold mb-4'>Edytuj profil</h2>
        <Formik
          initialValues={formInitialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className='space-y-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-semibold'>
                  Imię
                </label>
                <Field
                  type='text'
                  id='firstName'
                  name='firstName'
                  className='w-full p-2 border bg-tertiary rounded'
                />
                <ErrorMessage
                  name='firstName'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <div>
                <label htmlFor='lastName' className='block text-sm font-semibold'>
                  Nazwisko
                </label>
                <Field
                  type='text'
                  id='lastName'
                  name='lastName'
                  className='w-full p-2 border bg-tertiary rounded'
                />
                <ErrorMessage
                  name='lastName'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-semibold'>
                  Email
                </label>
                <Field
                  type='email'
                  id='email'
                  name='email'
                  className='w-full p-2 border bg-tertiary rounded'
                />
                <ErrorMessage name='email' component='div' className='text-red-500 text-sm mt-1' />
              </div>

              <div>
                <label htmlFor='city' className='block text-sm font-semibold'>
                  Miasto
                </label>
                <Field
                  type='text'
                  id='city'
                  name='city'
                  className='w-full p-2 border bg-tertiary rounded'
                />
                <ErrorMessage name='city' component='div' className='text-red-500 text-sm mt-1' />
              </div>

              <div className='flex justify-end space-x-4'>
                <button
                  type='submit'
                  disabled={isSubmitting || loading}
                  className='w-full py-2 bg-primary text-white hover:bg-primary/90'
                >
                  Zapisz zmiany
                </button>
                <button
                  type='button'
                  onClick={() => navigate('/profile')}
                  className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
                >
                  Anuluj
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div
        className='flex items-center justify-center bg-tertiary rounded-lg p-6 image-for-forms min-h-96'
        style={{ backgroundImage: `url(${imageAddEvent})` }}
      ></div>
      <ToastContainer
        position='top-right'
        autoClose={1000}
        className='z-50 fixed top-16 right-0 m-4'
      />
    </div>
  )
}

export default EditProfilePage
