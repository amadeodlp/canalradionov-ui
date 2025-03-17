'use client'
import { Button } from '@components/atoms/Button/Button'
import { LoginInput } from '@components/atoms/LoginInput/LoginInput'
import { Logo } from '@components/atoms/Logo/Logo'
import { Spinner } from "@components/atoms/Spinner/Spinner"
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

export const ConfirmationCodeForm: React.FC = () => {
  const [confirmationCode, setConfirmationCode] = useState('')
  const [toastState, setToastState] = useState({ open: false, variant: "success", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string>("")
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;

  const handleSubmit = async () => {
    if (!confirmationCode) {
      setError("Code is required")
    } else {
      setIsSubmitting(true);
      setError("")
      try {
      await confirmSignUp({username: email, confirmationCode})
      setIsSubmitting(false);
      router.push(`/login?confirmed=true`)
    } catch (error: any) {
      setIsSubmitting(false);
      if (error.toString().includes('ExpiredCodeException')) {
        setToastState({ open: true, variant: "error", message: "The code has expired. Please request a new one." });
      }
      else {
        setToastState({ open: true, variant: "error", message: "Invalid code. Please try again." });
      }
    }
  }
}

  const resendCode = async () => {
    try {
      setIsResending(true);
      await resendSignUpCode({username: email})
      setToastState({ open: true, variant: "success", message: "Code resent successfully. Check your inbox." });
      setIsResending(false);
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 5000);
    } catch (error: any) {
      console.log(error, 'error')
      setToastState({ open: true, variant: "error", message: "An error occurred. Please try again." });
      setIsResending(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationCode(e.target.value)
    setError("")
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg h-full w-96 gap-4">
      <Logo src="/assets/flyer.webp" alt="Canal Radionov" />
      <h2 className="text-xl font-semibold mt-4">Verify your email</h2>
      <p className="text-gray-600 text-center">
        Enter the verification code we sent to {email}. If you didn't receive a code, check your spam folder.
      </p>

      <div className="w-full">
        <LoginInput
          name="confirmationCode"
          type="text"
          placeholder="Verification code"
          value={confirmationCode}
          error={!!error}
          onChange={handleChange}
        />
      </div>
      <div className="self-start">
        {error && (
          <div className="flex justify-center items-center gap-1 mb-3">
            <img src="/assets/mark.png" alt="error-icon" className="w-5 h-5" />
            <p className="text-[#d00e17] text-xs">{error}</p>
          </div>
        )}
      </div>
      <Button onClick={handleSubmit}>
        {isSubmitting ? <Spinner /> : "Submit"}
      </Button>
      <Button onClick={resendCode}>
        {isResending ? <Spinner /> : "Resend code"}
      </Button>
      <a href="/login" className="text-blue-600 font-bold cursor-pointer">
        Back to Canal Radionov
      </a>
    </div>
  )
}
