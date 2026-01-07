import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login/Login.jsx'
import MapPage from './Pages/MapPage/MapPage.jsx'
import FirstPage from './Pages/FirstPage/FirstPage.jsx'
const router = createBrowserRouter([
  {
    path: "Login",
    element: <Login/>
  },
  {
    path: "Mapa",
    element: <MapPage/>
  },
  {
    path: "FirstPage",
    element: <FirstPage/>
  }
])

createRoot(document.getElementById('root')).render(
  
    <RouterProvider router={router} />
 
)