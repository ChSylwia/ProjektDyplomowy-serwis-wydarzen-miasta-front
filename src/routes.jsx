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
      },
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
      }
    ]
  }
]
