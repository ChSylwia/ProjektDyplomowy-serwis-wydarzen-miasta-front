import HomePage from '@/pages/HomePage/HomePage'
import ProfilePage from '@/pages/ProfilePage/ProfilePage'
import Root from '@/pages/Root'
import SelectPage from './pages/SelectPage/SelectPage'
import LoginPage from './pages/ProfilePage/LoginPage'
import { RouteName } from './constants/RouteName'
import RegisterPage from './pages/ProfilePage/RegisterPage'
import SuccessLoggedPage from './pages/Other/SuccessLoggedPage'
import EventAdd from './pages/LocalEvent/EventAdd'
import EventConfigurate from './pages/LocalEvent/EventConfigurate'
import EventEdit from './pages/LocalEvent/EventEdit'
import LocalEventsDetails from './pages/Details/LocalEventDetails'
import EditProfilePage from './pages/ProfilePage/EditProfilePage'
import EditProfilePasswdPage from './pages/ProfilePage/EditProfilePasswdPage'
import AdminProfilePage from './pages/Admin/AdminProfilePage'
import ForgotPasswordPage from './pages/ProfilePage/ForgotPasswordPage'

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
        path: RouteName.PROFIL,
        element: <ProfilePage />
      },
      {
        path: RouteName.WYDARZENIA,
        element: <SelectPage />
      },
      {
        path: `${RouteName.WYDARZENIA}/:type`,
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
      },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      {
        path: `/events/add`,
        element: <EventAdd />
      },
      {
        path: `/events/configure`,
        element: <EventConfigurate />
      },
      {
        path: `/events/edit/:id`,
        element: <EventEdit />
      },
      {
        path: `/events/details/localEventDetails/:id`,
        element: <LocalEventsDetails />
      },
      {
        path: `/profile/edit`,
        element: <EditProfilePage />
      },
      {
        path: `/profile/edit/passwd`,
        element: <EditProfilePasswdPage />
      },
      { path: '/admin', element: <AdminProfilePage /> }
    ]
  }
]
