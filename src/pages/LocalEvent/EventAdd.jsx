import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import useApiClient from '../../components/Cookie/useApiClient'
import imageAddEvent from '@/assets/add-event.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const categories = ['teatr', 'muzyka', 'rodzina', 'widowisko', 'sport', 'sztuka', 'kino', 'inne']

const EventAdd = () => {
  const { postWithFile } = useApiClient()
  const navigate = useNavigate()
  const initialValues = {
    title: '',
    description: '',
    date: '',
    priceMin: '',
    priceMax: '',
    category: [],
    link: '',
    image: null
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Tytuł wydarzenia jest wymagany'),
    description: Yup.string().required('Opis wydarzenia jest wymagany'),
    date: Yup.date()
      .min(new Date(), 'Data wydarzenia musi być w przyszłości')
      .required('Data wydarzenia jest wymagana'),
    priceMin: Yup.number()
      .typeError('Minimalna cena musi być liczbą')
      .min(0, 'Minimalna cena musi być co najmniej 0')
      .nullable(),
    priceMax: Yup.number()
      .typeError('Maksymalna cena musi być liczbą')
      .min(0, 'Maksymalna cena musi być co najmniej 0')
      .nullable()
      .when('priceMin', (priceMin, schema) =>
        priceMin !== undefined && priceMin !== null && priceMin !== ''
          ? schema.min(priceMin, 'Maksymalna cena musi być większa lub równa minimalnej cenie')
          : schema
      ),
    category: Yup.array()
      .of(Yup.string().oneOf(categories, 'Wybierz poprawną kategorię'))
      .min(1, 'Kategoria jest wymagana'),
    link: Yup.string().url('Podaj poprawny URL').nullable(),
    image: Yup.mixed()
      .required('Zdjęcie jest wymagane')
      .test(
        'fileType',
        'Niepoprawny format pliku. Dozwolone: JPG, PNG, GIF.',
        (value) => value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
      )
      .test(
        'fileSize',
        'Plik jest za duży. Maksymalny rozmiar: 2MB.',
        (value) => value && value.size <= 2 * 1024 * 1024
      )
  })

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    const formDataToSend = new FormData()
    for (const key in values) {
      if (values[key] !== null && values[key] !== undefined) {
        // For category, convert the array to a comma-separated string
        if (key === 'category' && Array.isArray(values.category)) {
          formDataToSend.append(key, values.category.join(','))
        } else {
          formDataToSend.append(key, values[key])
        }
      }
    }

    try {
      const response = await postWithFile('/local-events/create', formDataToSend)
      if (response.ok) {
        toast.success('Wydarzenie zostało pomyślnie dodane!')
        setTimeout(() => navigate('/profile'), 1000)
      } else {
        const errorMessage = response.data?.error || 'Nie udało się dodać wydarzenia'
        toast.error(errorMessage)
      }
    } catch (err) {
      toast.error('Błąd podczas dodawania wydarzenia. Spróbuj ponownie.')
    }
    setSubmitting(false)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-9/12 mx-auto m-8 p-6 bg-white rounded-lg shadow-lg z-10'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl'>
        <h2 className='text-2xl font-semibold mb-4'>Dodaj własne wydarzenie lokalne</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className='space-y-4'>
              <div className='form-control'>
                <label htmlFor='title' className='label'>
                  Tytuł wydarzenia
                </label>
                <Field
                  type='text'
                  id='title'
                  name='title'
                  className='input input-bordered w-full bg-tertiary'
                />
                <ErrorMessage name='title' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='form-control'>
                <label htmlFor='description' className='label'>
                  Opis wydarzenia
                </label>
                <Field
                  as='textarea'
                  id='description'
                  name='description'
                  className='textarea textarea-bordered w-full bg-tertiary'
                />
                <ErrorMessage
                  name='description'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>
              <div className='form-control'>
                <label htmlFor='date' className='label'>
                  Data wydarzenia
                </label>
                <Field
                  type='datetime-local'
                  id='date'
                  name='date'
                  className='input input-bordered w-full bg-tertiary'
                />
                <ErrorMessage name='date' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='form-control'>
                <label htmlFor='priceMin' className='label'>
                  Minimalna cena (opcjonalna)
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
                  id='priceMin'
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
                <label htmlFor='priceMax' className='label'>
                  Maksymalna cena (opcjonalna)
                </label>
                <Field
                  type='number'
                  id='priceMax'
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
                <label htmlFor='category' className='label'>
                  Kategoria
                </label>
                <Field
                  as='select'
                  id='category'
                  name='category'
                  multiple
                  className='select select-bordered w-full bg-tertiary'
                >
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
              <div className='form-control'>
                <label htmlFor='link' className='label'>
                  Link do wydarzenia (opcjonalny)
                </label>
                <Field
                  type='url'
                  id='link'
                  name='link'
                  className='input input-bordered w-full bg-tertiary'
                />
                <ErrorMessage name='link' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='form-control'>
                <label htmlFor='image' className='label'>
                  Dodaj zdjęcie
                </label>
                <input
                  type='file'
                  id='image'
                  name='image'
                  accept='image/*'
                  className='file-input file-input-ghost w-full bg-tertiary'
                  onChange={(e) => {
                    setFieldValue('image', e.currentTarget.files[0])
                  }}
                />
                <ErrorMessage name='image' component='div' className='text-red-500 text-sm mt-1' />
              </div>
              <div className='flex justify-end space-x-4'>
                <button
                  disabled={isSubmitting}
                  type='submit'
                  className='btn btn-primary w-9/12 bg-primary text-white hover:bg-primary/90'
                >
                  {isSubmitting ? 'Dodawanie...' : 'Dodaj wydarzenie'}
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

export default EventAdd
