import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const RegisterPage = () => {
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

  const validationSchema = Yup.object({
    login: Yup.string()
      .min(4, 'Login musi mieć co najmniej 4 znaki')
      .required('Login jest wymagany'),
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
    // Prepare the request headers
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    // Prepare the request body with the form values
    const raw = JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.login, // Using login field for username
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
        console.log('Raw response:', response)
        if (response.ok) {
          return response.json()
        } else {
          return response.text()
        }
      })
      .then((result) => {
        if (result.error) {
          // Handle error response
          console.error('Registration failed:', result.description)
        } else {
          // Handle successful registration
          console.log('Registration successful:', result)
        }
      })
      .catch((error) => {
        // Handle network or server error
        console.error('Error during registration:', error)
      })
  }

  return (
    <div className='min-h-screen flex items-center justify-center '>
      <div className='w-full max-w-2xl bg-white shadow-md rounded-lg p-6 md:p-8'>
        <h2 className='text-3xl font-bold text-center mb-8 text-gray-800'>Zarejestruj</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control'>
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
              <div className='form-control'>
                <label htmlFor='firstName' className='label'>
                  <span className='label-text'>Imię</span>
                </label>
                <Field
                  type='text'
                  id='firstName'
                  name='firstName'
                  className='input input-bordered w-full'
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
                  className='input input-bordered w-full'
                  placeholder='Wpisz nazwisko'
                />
                <ErrorMessage
                  name='lastName'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              <div className='form-control'>
                <label htmlFor='email' className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <Field
                  type='email'
                  id='email'
                  name='email'
                  className='input input-bordered w-full'
                  placeholder='Wpisz email'
                />
                <ErrorMessage name='email' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='form-control'>
                <label htmlFor='city' className='label'>
                  <span className='label-text'>Miasto</span>
                </label>
                <Field
                  type='text'
                  id='city'
                  name='city'
                  className='input input-bordered w-full'
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
                  className='input input-bordered w-full'
                  placeholder='00-000'
                />
                <ErrorMessage
                  name='postalCode'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
            </div>
            <div className='form-control mt-4'>
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
                className='input input-bordered w-full'
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
                className='select select-bordered w-full'
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
                <span className='ml-2'>Akceptuję regulamin</span>
              </label>
              <ErrorMessage
                name='termsAccepted'
                component='div'
                className='text-red-500 text-sm mt-1'
              />
            </div>
            <button type='submit' className='btn btn-primary w-full mt-6'>
              Zarejestruj się
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default RegisterPage
