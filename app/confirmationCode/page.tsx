import { ConfirmationCodeForm } from '@components/organisms/ConfirmationCodeForm/ConfirmationCodeForm'
import React, { Suspense } from 'react'

const VerificationCode: React.FC = () => {
  return (
    <Suspense>
      <ConfirmationCodeForm />
    </Suspense>
  )
}

export default VerificationCode
