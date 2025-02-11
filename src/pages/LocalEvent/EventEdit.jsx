import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useApiClient from '../../components/Cookie/useApiClient'
import imageAddEvent from '@/assets/add-event.svg'

const categories = ['teatr', 'muzyka', 'rodzina', 'widowisko', 'sport', 'sztuka', 'kino', 'inne']

const EventEdit = () => {
  const { id } = useParams()
  const { get, postWithFile } = useApiClient()
  const navigate = useNavigate()

  const [initialData, setInitialData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await get(`/local-events/${id}`)
        if (response.ok) {
          // Assume the API returns an array and we take the first event object.
          const event = response[0] || {}
          setInitialData({
            // For editing, we start with an empty file field.
            image: '',
            title: event.title || '',
            description: event.description || '',
            // For datetime-local inputs, we use the first 16 characters.
            date: event.date ? event.date.substring(0, 16) : '',
            priceMin:
              event.priceMin !== null && event.priceMin !== undefined
                ? event.priceMin.toString()
                : '',
            priceMax:
              event.priceMax !== null && event.priceMax !== undefined
                ? event.priceMax.toString()
                : '',
            link: event.link || '',
            category: event.category || ''
          })
        } else {
          throw new Error('Nie udało się pobrać wydarzenia')
        }
      } catch (err) {
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [get, id])

  // Yup validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required('Tytuł jest wymagany'),
    description: Yup.string().required('Opis jest wymagany'),
    date: Yup.date()
      .min(new Date(), 'Data wydarzenia musi być w przyszłości')
      .required('Data wydarzenia jest wymagana'),
    priceMin: Yup.number()
      .typeError('Cena musi być liczbą')
      .min(0, 'Cena nie może być ujemna')
      .nullable(),
    priceMax: Yup.number()
      .typeError('Cena musi być liczbą')
      .min(0, 'Cena nie może być ujemna')
      .nullable()
      .when('priceMin', (priceMin, schema) => {
        return priceMin !== undefined && priceMin !== null && priceMin !== ''
          ? schema.min(priceMin, 'Maksymalna cena musi być większa lub równa minimalnej cenie')
          : schema
      }),
    link: Yup.string().url('Podaj poprawny URL').nullable(),
    category: Yup.string()
      .oneOf(categories, 'Wybierz poprawną kategorię')
      .required('Kategoria jest wymagana'),
    image: Yup.mixed()
      // For editing, the image is optional. If a file is provided, validate its type and size.
      .test('fileType', 'Niepoprawny format pliku. Dozwolone: JPG, PNG, GIF.', (value) => {
        if (!value) return true
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
      })
      .test('fileSize', 'Plik jest za duży. Maksymalny rozmiar: 2MB.', (value) => {
        if (!value) return true
        return value.size <= 2 * 1024 * 1024
      })
  })

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', values.title)
      formDataToSend.append('description', values.description)
      formDataToSend.append('date', values.date)
      formDataToSend.append('priceMin', values.priceMin !== '' ? values.priceMin : '0')
      formDataToSend.append('priceMax', values.priceMax !== '' ? values.priceMax : '0')
      formDataToSend.append('link', values.link || '')
      formDataToSend.append('category', values.category || '')
      if (values.image) {
        formDataToSend.append('image', values.image)
      }

      const response = await postWithFile(`/local-events/${id}/edit`, formDataToSend)
      if (response.ok) {
        toast.success('Wydarzenie zostało zaktualizowane!')
        setTimeout(() => navigate('/profile'), 2000)
      } else {
        throw new Error('Nie udało się zaktualizować wydarzenia')
      }
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
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

  if (!initialData) {
    return <p>Dane wydarzenia nie są dostępne</p>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h1 className='text-2xl font-semibold mb-6'>Edycja wydarzenia</h1>
        {error && <div className='alert alert-error'>{error}</div>}
        <Formik
          initialValues={initialData}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className='space-y-4'>
              {/* Image */}
              <div className='form-control'>
                <label className='label'>Zdjęcie</label>
                <input
                  type='file'
                  name='image'
                  accept='image/*'
                  className='file-input file-input-ghost w-full bg-tertiary'
                  onChange={(e) => {
                    setFieldValue('image', e.currentTarget.files[0])
                  }}
                />
                <ErrorMessage name='image' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              {/* Title */}
              <div className='form-control'>
                <label className='label'>Tytuł</label>
                <Field
                  type='text'
                  name='title'
                  className='input input-bordered w-full bg-tertiary'
                  required
                />
                <ErrorMessage name='title' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              {/* Description */}
              <div className='form-control'>
                <label className='label'>Opis</label>
                <Field
                  as='textarea'
                  name='description'
                  className='textarea textarea-bordered w-full bg-tertiary'
                  required
                />
                <ErrorMessage
                  name='description'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              {/* Date */}
              <div className='form-control'>
                <label className='label'>Data</label>
                <Field
                  type='datetime-local'
                  name='date'
                  className='input input-bordered w-full bg-tertiary'
                  required
                />
                <ErrorMessage name='date' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              {/* Price Min */}
              <div className='form-control'>
                <label className='label'>Cena minimalna</label>
                <Field
                  type='number'
                  name='priceMin'
                  className='input input-bordered w-full bg-tertiary'
                />
                <ErrorMessage
                  name='priceMin'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              {/* Price Max */}
              <div className='form-control'>
                <label className='label'>Cena maksymalna</label>
                <Field
                  type='number'
                  name='priceMax'
                  className='input input-bordered w-full bg-tertiary'
                />
                <ErrorMessage
                  name='priceMax'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              {/* Link */}
              <div className='form-control'>
                <label className='label'>Link</label>
                <Field
                  type='text'
                  name='link'
                  className='input input-bordered w-full bg-tertiary'
                />
                <ErrorMessage name='link' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              {/* Category */}
              <div className='form-control'>
                <label className='label'>Kategoria</label>
                <Field
                  as='select'
                  name='category'
                  className='select select-bordered w-full bg-tertiary'
                  required
                >
                  <option value='' disabled>
                    Wybierz kategorię
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name='category'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='btn btn-primary w-9/12 bg-primary text-white hover:bg-primary/90'
                >
                  {isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany'}
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
        autoClose={2000}
        className='z-50 fixed top-16 right-0 m-4'
      />
    </div>
  )
}

export default EventEdit
