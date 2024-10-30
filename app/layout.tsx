'use client'
import '../app/globals.css'
import './styles/tailwind.css'
import { setupAmplify } from '@utils/setupAmplify'
import { useEffect } from 'react'
import { Provider } from "react-redux"
import store from "@redux/store"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    setupAmplify()
  }, [])

  return (
    <html lang="en">
      <body>
        <div className="flex items-center justify-center min-h-screen bg-[url('/assets/rebirth.webp')] bg-no-repeat bg-cover bg-center">
          <Provider store={store}>
          {children}
          </Provider>
        </div>
      </body>
    </html>
  )
}
