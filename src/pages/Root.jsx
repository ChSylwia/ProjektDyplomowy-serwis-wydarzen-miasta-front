import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar/Navbar'

const Root = () => {
  return (
    <div className='min-h-screen flex flex-col items-center pt-16 relative main'>
      <div className='circle-1'></div>
      <div className='circle-2'></div>
      <div className='circle-3'></div>
      <div className='circle-4'></div>
      <div className='circle-5'></div>
      <div className='circle-6'></div>

      <Navbar />

      <div className='min-h-20 p-4 flex-grow justify-around align-middle w-full'></div>
      <Outlet />

      <footer className='w-full bg-base-200 text-center py-4 shadow-inner z-50 mt-32'>
        <p className='text-gray-600'>&copy; 2025 Projekt dyplomowy - Sylwia Chędkowska.</p>
        <div className='mt-2 space-x-4'>
          <a href='/' className='text-primary hover:underline'>
            Strona główna
          </a>
          <a href='/select' className='text-primary hover:underline'>
            Wydarzenia
          </a>
          <a href='/profile' className='text-primary hover:underline'>
            Profil
          </a>
          <a href='/privacypolicy' className='text-primary hover:underline'>
            Polityka Prywatności
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Root
