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

  const [preview, setPreview] = useState(null)
  useEffect(() => {
    if (initialData && initialData.image) {
      setPreview(initialData.image)
    }
  }, [initialData])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await get(`/local-events/${id}`)
        if (response.ok) {
          const event = response[0] || {}
          setInitialData({
            image: event.image || '',
            title: event.title || '',
            description: event.description || '',
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
            category: event.category || []
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
  }, [])

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const tomorrow = new Date()
  tomorrow.setHours(0, 0, 0, 0)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const validationSchema = Yup.object({
    title: Yup.string().required('Tytuł jest wymagany'),
    description: Yup.string().required('Opis jest wymagany'),
    date: Yup.date()
      .min(tomorrow, 'Data wydarzenia musi być w przyszłości (od jutra)')
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
    category: Yup.array()
      .of(Yup.string().oneOf(categories, 'Wybierz poprawną kategorię'))
      .min(1, 'Kategoria jest wymagana'),
    image: Yup.mixed()
      .test('fileType', 'Niepoprawny format pliku. Dozwolone: JPG, PNG, GIF.', (value) => {
        if (!value || typeof value === 'string') return true
        return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
      })
      .test('fileSize', 'Plik jest za duży. Maksymalny rozmiar: 2MB.', (value) => {
        if (!value || typeof value === 'string') return true
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
      formDataToSend.append('category', values.category.join(','))
      if (values.image && values.image !== initialData.image) {
        formDataToSend.append('image', values.image)
      }

      const response = await postWithFile(`/local-events/${id}/edit`, formDataToSend)
      if (response.ok) {
        toast.success('Wydarzenie zostało zaktualizowane!')
        setTimeout(() => navigate('/profile'), 1000)
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
              <div className='form-control'>
                <label className='label'>
                  Data
                  <div className='relative group cursor-pointer'>
                    <span className='text-bg-secondary text-lg'>ℹ️</span>
                    <div className='absolute left-0 bottom-full mb-1 hidden w-64 p-2 bg-secondary text-white text-sm rounded-md group-hover:block'>
                      Można dodać datę wyłącznie w przyszłości, rozpoczynając od dnia jutrzejszego.
                    </div>
                  </div>
                </label>
                <Field
                  type='datetime-local'
                  name='date'
                  className='input input-bordered w-full bg-tertiary'
                  required
                />
                <ErrorMessage name='date' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='form-control'>
                <label className='label'>
                  Cena minimalna (opcjonalna){' '}
                  <div className='relative group cursor-pointer'>
                    <span className='text-bg-secondary text-lg'>ℹ️</span>
                    <div className='absolute left-0 bottom-full mb-1 hidden w-64 p-2 bg-secondary text-white text-sm rounded-md group-hover:block'>
                      Cena minimalna uwzględnia rabaty i promocje. Jeśli cena wynosi 0, wydarzenie
                      jest darmowe.
                    </div>
                  </div>
                </label>
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
              <div className='form-control'>
                <label className='label'>Cena maksymalna (opcjonalna)</label>
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

              <div className='form-control'>
                <label className='label'>
                  Kategoria
                  <div className='relative group cursor-pointer'>
                    <span className='text-bg-secondary text-lg'>ℹ️</span>
                    <div className='absolute left-0 bottom-full mb-1 hidden w-64 p-2 bg-secondary text-white text-sm rounded-md group-hover:block'>
                      Można wybrać więcej niż jedną kategorię.
                    </div>
                  </div>
                </label>
                <div className='grid grid-cols-2 gap-2'>
                  {categories.map((cat) => (
                    <label key={cat} className='flex items-center gap-2 cursor-pointer'>
                      <Field
                        type='checkbox'
                        name='category'
                        value={cat}
                        className=' checkbox:bg-secondary  checked:bg-secondary checked:border-secondary checked:text-white'
                      />
                      {cat}
                    </label>
                  ))}
                </div>
                <ErrorMessage
                  name='category'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              <div className='form-control'>
                <label className='label'>Link (opcjonalny)</label>
                <Field
                  type='text'
                  name='link'
                  className='input input-bordered w-full bg-tertiary'
                />
                <ErrorMessage name='link' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='form-control'>
                <label className='label'>Zdjęcie</label>
                <div className='relative'>
                  <input
                    type='file'
                    name='image'
                    accept='image/*'
                    className='file-input file-input-ghost w-full bg-tertiary opacity-0 absolute inset-0'
                    onChange={(e) => {
                      const selectedFile = e.currentTarget.files[0]
                      if (selectedFile) {
                        setFieldValue('image', selectedFile)
                        setPreview(URL.createObjectURL(selectedFile))
                      }
                    }}
                  />
                  {preview ? (
                    <div className='flex items-center space-x-2'>
                      <img
                        src={preview}
                        alt='Image preview'
                        className='w-16 h-16 object-cover rounded-md'
                      />
                      <span className='text-sm text-gray-500 truncate'>
                        Kliknij, aby zmienić obraz
                      </span>
                    </div>
                  ) : (
                    <span className='text-sm text-gray-500'>Brak wybranego obrazu</span>
                  )}
                </div>
                <ErrorMessage name='image' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  type='submit'
                  disabled={loading || isSubmitting}
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

export default EventEdit
