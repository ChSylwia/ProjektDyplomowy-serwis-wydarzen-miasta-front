import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { NavbarRouteName } from '@/constants/RouteName'
import { toast, ToastContainer } from 'react-toastify'
const Navbar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Check if the user is logged in
  const token = Cookies.get('authToken')

  const handleLogoutClick = () => {
    Cookies.remove('authToken') // Remove the auth token
    toast.success('Logged out successfully!')
    navigate(NavbarRouteName.LOGIN) // Redirect to the login page
  }

  return (
    <div className='navbar bg-base-100 z-20'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow'
          >
            {Object.entries(NavbarRouteName)
              .filter(([key]) => key !== 'LOGIN' && key !== 'REGISTER') // Exclude Login and Register from the dropdown
              .map(([key, path]) => (
                <Link
                  key={key}
                  to={path}
                  role='tab'
                  className={`tab ${pathname === path ? 'tab-active' : ''}`}
                >
                  <p className='font-medium'>{key.charAt(0) + key.slice(1).toLowerCase()}</p>
                </Link>
              ))}
          </ul>
        </div>
        <a className='btn btn-ghost text-xl'>Events</a>
      </div>
      <div className='navbar-center hidden lg:flex'>
        {Object.entries(NavbarRouteName)
          .filter(([key]) => key !== 'LOGIN' && key !== 'REGISTER') // Exclude Login and Register from the center links
          .map(([key, path]) => (
            <Link
              key={key}
              to={path}
              role='tab'
              className={`tab ${pathname === path ? 'tab-active' : ''}`}
            >
              <p className='font-medium'>{key.charAt(0) + key.slice(1).toLowerCase()}</p>
            </Link>
          ))}
      </div>
      <div className='navbar-end'>
        {token ? (
          <button className='btn' onClick={handleLogoutClick}>
            Wyloguj się
          </button>
        ) : (
          <>
            <button className='btn' onClick={() => navigate(NavbarRouteName.LOGIN)}>
              Zaloguj się
            </button>
            <button className='btn ml-2' onClick={() => navigate(NavbarRouteName.REGISTER)}>
              Zarejestruj się
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}

export default Navbar
