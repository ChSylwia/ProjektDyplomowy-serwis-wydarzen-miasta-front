import HomePage from '@/pages/HomePage/HomePage'
import ProfilePage from '@/pages/ProfilePage/ProfilePage'
import Root from '@/pages/Root'
import SelectPage from './pages/SelectPage/SelectPage'
import LoginPage from './pages/ProfilePage/LoginPage'
import { RouteName } from './constants/RouteName'
import RegisterPage from './pages/ProfilePage/RegisterPage'
import SuccessLoggedPage from './pages/SuccessLoggedPage'

export const routes = [
  {
    path: RouteName.HOME,
    element: <Root />,
    children: [
      {
        path: RouteName.HOME,
        element: <HomePage />
      },
      {
        path: RouteName.PROFILE,
        element: <ProfilePage />
      },
      {
        path: RouteName.SELECT,
        element: <SelectPage />
      },
      {
        path: `${RouteName.SELECT}/:type`,
        element: <SelectPage />
      },
      {
        path: RouteName.LOGIN,
        element: <LoginPage />
      },
      {
        path: RouteName.REGISTER,
        element: <RegisterPage />
      },
      {
        path: `/success`,
        element: <SuccessLoggedPage />
      }
    ]
  }
]
