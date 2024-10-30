'use client'
import { Button } from '@components/atoms/Button/Button'
import { LoginInput } from '@components/atoms/LoginInput/LoginInput'
import { Logo } from '@components/atoms/Logo/Logo'
import { Spinner } from "@components/atoms/Spinner/Spinner"
import { Toast } from "@components/Molecules/Toast/Toast"
import { useAppDispatch } from "@hooks"
import { login } from "@redux/auth/authSlice"
import { emailRegex } from "@utils/regex"
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>("")
  const [toastState, setToastState] = useState({ open: false, variant: "success", message: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const justCreated = searchParams.get("justCreated");
    if (justCreated) {
      setToastState({ open: true, variant: "success", message: "Account created Succesfully Please sign in." });
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 5000);
    }
  }, []);

  const validate = () => {
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    if (!password) {
      setError("Password is required")
      return false
    }
    setError("")
    return true;
  }

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setIsSubmitting(true);
      await dispatch(login({ username: email, password }));
      router.push('/');
      setIsSubmitting(false);
    } catch (error: any) {
      if(error.toString().includes('INVALID_CREDENTIALS')) {
        setError('Invalid email or password')
      } else {
        setError('An error occurred during authentication')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg min-h-60 h-full w-96 gap-4">
      {isSubmitting ? (
      <Spinner />
      ) : (
        <>
      <Logo src="/assets/flyer.webp" alt="Canal Radionov" />
      <h2 className="text-xl font-semibold mt-4">Welcome</h2>
      <p className="text-gray-600">Log in to continue to Canal Radionov.</p>

      <div className="w-full">
        <LoginInput
          name="email"
          type="text"
          placeholder="Email address"
          value={email}
          error={!!error}
          onChange={handleChange}
        />
      </div>

      <div className="w-full">
        <LoginInput
          name="password"
          type="password"
          placeholder="Password"
          value={password}
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
        <a
          href="/forgotPassword"
          className="text-blue-600 font-bold cursor-pointer"
        >
          Forgot password?
        </a>
      </div>
      <Button onClick={handleSubmit} variant="green">
        Continue
      </Button>
      <div className="flex justify-center items-center gap-1">
        <p className="text-gray-600 text-sm">Don't have an account?</p>
        <a href="/signup" className="text-blue-600 font-bold cursor-pointer">
          Sign up
        </a>
      </div>
      <Toast
        message={toastState.message}
        isOpen={toastState.open}
        variant={toastState.variant as 'success' | 'error'}
        onClose={() => setToastState({ ...toastState, open: false })}
      />
      </>
      )}
    </div>
  )
}
