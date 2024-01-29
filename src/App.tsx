import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import MRoutes from './router/index'
export default function App() {
  return (
    <>
      <BrowserRouter>
        <MRoutes></MRoutes>
      </BrowserRouter>
    </>
  )
}
