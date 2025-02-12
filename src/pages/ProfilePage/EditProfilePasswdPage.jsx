import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import useApiClient from '../../components/Cookie/useApiClient'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import imageAddEvent from '@/assets/add-event.svg'

const EditProfilePasswdPage = () => {
  const navigate = useNavigate()

  const { post } = useApiClient()

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Aktualne hasło jest wymagane'),
    newPassword: Yup.string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .required('Nowe hasło jest wymagane'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Hasła muszą się zgadzać')
      .required('Powtórzenie hasła jest wymagane')
  })

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await post('/user/edit/passwd', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })

      if (response.error) {
        toast.error(response.message)
      } else {
        toast.success('Udało się zmienić hasło!')
        setTimeout(() => navigate('/profile'), 1000)
      }
    } catch (error) {
      console.error(error)
      toast.error('Wystąpił błąd podczas zmiany hasła.')
    }
    setSubmitting(false)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-6/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-lg font-bold mb-4'>Zmień hasło</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className='space-y-4'>
              <div>
                <label htmlFor='currentPassword' className='block font-medium'>
                  Aktualne hasło
                </label>
                <Field
                  type='password'
                  id='currentPassword'
                  name='currentPassword'
                  className='w-full px-4 py-2 border bg-tertiary rounded-md'
                />
                <ErrorMessage
                  name='currentPassword'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <div>
                <label htmlFor='newPassword' className='block font-medium'>
                  Nowe hasło
                </label>
                <Field
                  type='password'
                  id='newPassword'
                  name='newPassword'
                  className='w-full px-4 py-2 border bg-tertiary rounded-md'
                />
                <ErrorMessage
                  name='newPassword'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <div>
                <label htmlFor='confirmPassword' className='block font-medium'>
                  Powtórz nowe hasło
                </label>
                <Field
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  className='w-full px-4 py-2 border bg-tertiary rounded-md'
                />
                <ErrorMessage
                  name='confirmPassword'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <div className='flex justify-end space-x-4'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full py-2 bg-primary text-white hover:bg-primary/90'
                >
                  {isSubmitting ? 'Ładowanie...' : 'Zmień hasło'}
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
        className='flex items-center justify-center bg-tertiary rounded-lg p-6 image-for-forms'
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

export default EditProfilePasswdPage
