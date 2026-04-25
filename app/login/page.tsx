import { LoginForm } from '@components/organisms/LoginForm/LoginForm'
import React, { Suspense } from 'react'

const Login: React.FC = () => {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

export default Login
