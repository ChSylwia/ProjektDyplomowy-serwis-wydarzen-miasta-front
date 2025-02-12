import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { toast, ToastContainer } from 'react-toastify'
import * as Yup from 'yup'
import imageAddEvent from '@/assets/add-event.svg'
import { useNavigate } from 'react-router-dom'
const RegisterPage = () => {
  const [loading, setLoading] = useState(false)
  const initialValues = {
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    postalCode: '',
    password: '',
    confirmPassword: '',
    userType: '',
    termsAccepted: false
  }
  const navigate = useNavigate()
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Imię jest wymagane'),
    lastName: Yup.string().required('Nazwisko jest wymagane'),
    email: Yup.string().email('Nieprawidłowy email').required('Email jest wymagany'),
    city: Yup.string().required('Miasto jest wymagane'),
    postalCode: Yup.string()
      .matches(/^\d{2}-\d{3}$/, 'Kod pocztowy musi być w formacie 00-000')
      .required('Kod pocztowy jest wymagany'),
    password: Yup.string()
      .min(8, 'Hasło musi mieć co najmniej 8 znaków')
      .required('Hasło jest wymagane'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Hasła muszą być identyczne')
      .required('Potwierdzenie hasła jest wymagane'),
    userType: Yup.string().required('Wybór typu użytkownika jest wymagany'),
    termsAccepted: Yup.boolean().oneOf([true], 'Musisz zaakceptować regulamin')
  })

  const handleSubmit = (values) => {
    setLoading(true)
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.email,
      city: values.city,
      postalCode: values.postalCode,
      userType: values.userType,
      termsAccepted: values.termsAccepted,
      password: values.password
    })

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch('http://127.0.0.1:8000/api/v1/user/create', requestOptions)
      .then((response) => {
        setLoading(false)
        return response.text().then((text) => {
          try {
            const json = JSON.parse(text)
            if (response.ok) {
              toast.success('Rejestracja zakończona sukcesem!')
              setTimeout(() => {
                navigate('/login')
              }, 1000)
              return json
            } else {
              throw new Error(json.message || 'Wystąpił błąd')
            }
          } catch (e) {
            throw new Error('Nieprawidłowa odpowiedź JSON: ' + text)
          }
        })
      })
      .catch((error) => {
        setLoading(false)
        toast.error(`Rejestracja nieudana: ${error.message}`)
      })
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h2 className='text-3xl font-bold text-center mb-8 text-gray-800'>Zarejestruj się</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control'>
                <label htmlFor='firstName' className='label'>
                  <span className='label-text'>Imię</span>
                </label>
                <Field
                  type='text'
                  id='firstName'
                  name='firstName'
                  className='input input-bordered w-full bg-tertiary'
                  placeholder='Wpisz imię'
                />
                <ErrorMessage
                  name='firstName'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              <div className='form-control'>
                <label htmlFor='lastName' className='label'>
                  <span className='label-text'>Nazwisko</span>
                </label>
                <Field
                  type='text'
                  id='lastName'
                  name='lastName'
                  className='input input-bordered w-full bg-tertiary'
                  placeholder='Wpisz nazwisko'
                />
                <ErrorMessage
                  name='lastName'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <div className='form-control'>
                <label htmlFor='city' className='label'>
                  <span className='label-text'>Miasto</span>
                </label>
                <Field
                  type='text'
                  id='city'
                  name='city'
                  className='input input-bordered w-full bg-tertiary'
                  placeholder='Wpisz miasto'
                />
                <ErrorMessage name='city' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='form-control'>
                <label htmlFor='postalCode' className='label'>
                  <span className='label-text'>Kod pocztowy</span>
                </label>
                <Field
                  type='text'
                  id='postalCode'
                  name='postalCode'
                  className='input input-bordered w-full bg-tertiary'
                  placeholder='00-000'
                />
                <ErrorMessage
                  name='postalCode'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
            </div>
            <div className='form-control'>
              <label htmlFor='email' className='label'>
                <span className='label-text'>Email (Login)</span>
              </label>
              <Field
                type='email'
                id='email'
                name='email'
                className='input input-bordered w-full bg-tertiary'
                placeholder='Wpisz email'
              />
              <ErrorMessage name='email' component='div' className='text-red-500 text-sm mt-1' />
            </div>
            <div className='form-control mt-4'>
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
              <ErrorMessage name='password' component='div' className='text-red-500 text-sm mt-1' />
            </div>
            <div className='form-control mt-4'>
              <label htmlFor='confirmPassword' className='label'>
                <span className='label-text'>Potwierdź hasło</span>
              </label>
              <Field
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                className='input input-bordered w-full bg-tertiary'
                placeholder='Potwierdź hasło'
              />
              <ErrorMessage
                name='confirmPassword'
                component='div'
                className='text-red-500 text-sm mt-1'
              />
            </div>
            <div className='form-control mt-4'>
              <label htmlFor='userType' className='label'>
                <span className='label-text'>Typ użytkownika</span>
              </label>
              <Field
                as='select'
                id='userType'
                name='userType'
                className='select select-bordered w-full bg-tertiary'
              >
                <option value='' label='Wybierz typ użytkownika' />
                <option value='private' label='Osoba prywatna' />
                <option value='organization' label='Organizacja' />
              </Field>
              <ErrorMessage name='userType' component='div' className='text-red-500 text-sm mt-1' />
            </div>
            <div className='form-control mt-4'>
              <label className='cursor-pointer flex items-center'>
                <Field type='checkbox' name='termsAccepted' className='checkbox' />
                <span className='ml-2'>
                  Akceptuję regulamin (
                  <a href='#' className='hover:text-primary/90'>
                    link
                  </a>
                  )
                </span>
              </label>
              <ErrorMessage
                name='termsAccepted'
                component='div'
                className='text-red-500 text-sm mt-1'
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-full mt-6 bg-primary text-white hover:bg-primary/90'
            >
              {loading ? 'Ładowanie...' : 'Zarejestruj się'}
            </button>
            <div className='text-center p-2'>
              <span className='text-sm text-gray-600'>
                Masz konto?{' '}
                <a href='/login' className='text-blue-500 hover:underline'>
                  Zaloguj się
                </a>
              </span>
            </div>
          </Form>
        </Formik>
      </div>
      <div
        className='flex items-center justify-center bg-tertiary rounded-lg p-6 image-for-forms'
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
  )
}

export default RegisterPage
