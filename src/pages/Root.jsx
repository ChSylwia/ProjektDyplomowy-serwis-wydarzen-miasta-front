import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar/Navbar'

const Root = () => {
  return (
    <div className='min-h-screen flex flex-col items-center relative main'>
      {/* Animated circles */}
      <div className='circle-1'></div>
      <div className='circle-2'></div>
      <div className='circle-3'></div>
      <div className='circle-4'></div>
      <div className='circle-5'></div>
      <div className='circle-6'></div>
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className='min-h-20 p-4'></div>
      <Outlet />
    </div>
  )
}

export default Root
