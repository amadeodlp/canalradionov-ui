'use client'
import { Button } from '@components/atoms/Button/Button'
import { LoginInput } from '@components/atoms/LoginInput/LoginInput'
import { Logo } from '@components/atoms/Logo/Logo'
import { Spinner } from "@components/atoms/Spinner/Spinner"
import { Toast } from "@components/Molecules/Toast/Toast"
import { emailRegex } from "@utils/regex"
import { resetPassword } from "aws-amplify/auth"
import React, { useState } from 'react'

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      setError(true)
    } else {
      setError(false)
      setIsSubmitting(true)
      resetPassword({ username: email });
      setIsSubmitting(false)
      setIsToastOpen(true)
      setTimeout(() => {
        setIsToastOpen(false)
      }
      , 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError(false)
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg h-full w-96 gap-4">
      <Logo src="/assets/flyer.webp" alt="Canal Radionov" />
      <h2 className="text-xl font-semibold mt-4">Forgot Your Password?</h2>
      <p className="text-gray-600">
        Enter your email address and we will send you instructions to reset your
        password.
      </p>

      <div className="w-full">
        <LoginInput
          name="email"
          type="text"
          placeholder="Email address"
          value={email}
          error={error}
          onChange={handleChange}
        />
      </div>
      <div className="self-start">
        {error && (
          <div className="flex justify-center items-center gap-1 mb-3">
            <img src="/assets/mark.png" alt="error-icon" className="w-5 h-5" />
            <p className="text-[#d00e17] text-xs">Email is not valid</p>
          </div>
        )}
      </div>
      <Button variant="blue" onClick={handleSubmit}>
        {isSubmitting ? <Spinner color="white" /> :
        "Continue"
        }
      </Button>
      <a href="/login" className="text-blue-600 font-bold cursor-pointer">
        Back to Canal Radionov
      </a>
      <Toast variant="success" isOpen={isToastOpen} message="Password reset instructions sent to your email" />
    </div>
  )
}
