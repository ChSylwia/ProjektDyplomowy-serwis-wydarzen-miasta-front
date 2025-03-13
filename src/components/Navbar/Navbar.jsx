import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { NavbarRouteName } from '@/constants/RouteName'
import { toast, ToastContainer } from 'react-toastify'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const token = Cookies.get('authToken')

  const [isOpen, setIsOpen] = useState(false)

  const handleLogoutClick = () => {
    Cookies.remove('authToken')
    toast.success('Wylogowano pomyślnie!')
    navigate(NavbarRouteName.LOGIN)
  }

  return (
    <div className='navbar fixed top-0 left-0 right-0 bg-base-100 z-50 shadow-md'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <button
            tabIndex={0}
            className='btn btn-ghost lg:hidden'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          {isOpen && (
            <ul className='absolute left-0 mt-3 w-52 bg-base-100 rounded-box z-50 p-2 shadow'>
              {Object.entries(NavbarRouteName)
                .filter(([key]) => key !== 'LOGIN' && key !== 'REGISTER')
                .map(([key, path]) => (
                  <li key={key} onClick={() => setIsOpen(false)}>
                    <Link
                      to={path}
                      className={`block px-4 py-2 font-medium ${
                        pathname === path ? 'text-primary' : 'hover:text-gray-400'
                      }`}
                    >
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <Link to={NavbarRouteName.HOME} className='btn btn-ghost p-0'>
          <img src='/assets/Logo.svg' alt='Logo' className='h-12' />
        </Link>
      </div>

      <div className='navbar-center hidden lg:flex space-x-4'>
        {Object.entries(NavbarRouteName)
          .filter(([key]) => key !== 'LOGIN' && key !== 'REGISTER')
          .map(([key, path]) => (
            <Link
              key={key}
              to={path}
              className={`relative px-4 py-2 font-medium ${
                pathname === path
                  ? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary'
                  : 'hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-1 hover:after:bg-gray-400'
              }`}
            >
              {key === 'HOME' ? 'Strona główna' : key.charAt(0) + key.slice(1).toLowerCase()}
            </Link>
          ))}
      </div>

      <div className='navbar-end'>
        {token ? (
          <button
            className='btn btn-primary bg-primary text-white hover:bg-primary/90'
            onClick={handleLogoutClick}
          >
            Wyloguj się
          </button>
        ) : (
          <>
            <button
              className='btn btn-primary bg-primary text-white hover:bg-primary/90'
              onClick={() => navigate(NavbarRouteName.LOGIN)}
            >
              Zaloguj się
            </button>
            <button
              className='btn bg-secondary text-white hover:bg-secondary/90 ml-2'
              onClick={() => navigate(NavbarRouteName.REGISTER)}
            >
              Zarejestruj się
            </button>
          </>
        )}
      </div>

      <ToastContainer
        position='top-right'
        autoClose={1000}
        className='z-50 fixed top-16 right-0 m-4'
      />
    </div>
  )
}

export default Navbar
