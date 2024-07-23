import { HomeLayout } from '@/pages/home/Home.layout'
import { HomeScreen } from '@/pages/home/Home.screen'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        path: '',
        element: <HomeScreen />,
      },
      {
        path: 'account',
        element: <>Account</>,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
