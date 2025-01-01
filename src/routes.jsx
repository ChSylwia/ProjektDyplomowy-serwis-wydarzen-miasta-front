import HomePage from '@/pages/HomePage/HomePage'
import ProfilePage from '@/pages/ProfilePage/ProfilePage'
import Root from '@/pages/Root'
import SelectPage from './pages/SelectPage/SelectPage'
import { RouteName } from './constants/RouteName'

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
      }
    ]
  }
]
