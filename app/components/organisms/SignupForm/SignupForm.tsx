import { Button } from '@components/atoms/Button/Button'
import { Dropdown } from '@components/atoms/Dropdown/Dropdown'
import Input from '@components/atoms/Input/Input'
import {
  autoformatPhoneNumber,
  formatUSPhoneNumberTo164,
} from '@utils/formattedPhone'
import Label from '@components/atoms/Label/Label'
import { Logo } from '@components/atoms/Logo/Logo'
import React, { useState } from 'react'
import { Spinner } from '@components/atoms/Spinner/Spinner'
import { Toast } from '@components/Molecules/Toast/Toast'
import { emailRegex, passwordRegex } from '@utils/regex';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@hooks';
import { signup } from "@redux/auth/authSlice"

const SignUpForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastState, setToastState] = useState({
    message: '',
    open: false,
    variant: 'success',
  })
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    account: '',
    userType: '',
    phoneNumber: '',
    timezone: '',
  })
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    account: '',
    userType: '',
    phoneNumber: '',
    timezone: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }))
  }

  const validate = () => {
    const newErrors = { ...errors }

    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.firstName) newErrors.firstName = 'First Name is required'
    if (!formData.lastName) newErrors.lastName = 'Last Name is required'
    if (!formData.account) newErrors.account = 'Account is required'
    if (!formData.userType) newErrors.userType = 'User Type is required'
    if (!formData.timezone) newErrors.timezone = 'Timezone is required'
    if (!formData.phoneNumber)
      newErrors.phoneNumber = 'Phone Number is required'

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email is not valid'
    }

    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must have at least 8 characters, including one uppercase, one lowercase, one number, and one special.'
    }

    setErrors(newErrors)

    return Object.values(newErrors).every((error) => error === '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return
    setIsSubmitting(true)
    try {
      const payload = {
        username: formData.email,
        password: formData.password,
        options: {
          userAttributes: {
            email: formData.email,
            given_name: formData.firstName,
            family_name: formData.lastName,
            phone_number: formatUSPhoneNumberTo164(formData.phoneNumber),
            'custom:userType': formData.userType,
            'custom:account': formData.account,
            zoneinfo: formData.timezone,
          },
        },
      }
      await dispatch(signup(payload));
      router.push(`/login?justCreated=true`)
    } catch (error: any) {
      console.log(error, 'error')
      if (error.toString().includes('USERNAME_EXISTS')) {
        setToastState({
          message: 'An account with this email already exists.',
          open: true,
          variant: 'error',
        })
      } else {
        setToastState({
          message: 'An error occurred. Please try again.',
          open: true,
          variant: 'error',
        })
      }
      setTimeout(() => {
        setToastState({ ...toastState, open: false })
      }, 5000)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 mx-auto rounded-lg shadow-lg">
      <div className="flex justify-center mb-4">
        <Logo src="/assets/canalradionovlogo.png" />
      </div>
      <p className="text-center text-gray-600 mb-6">
        Hi there, we just need some more details to complete your signup process
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label text="Email" required />
            <Input
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div>
            <Label text="Password" required />
            <Input
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
            />
            {errors.password && (
              <p className="text-red-500 text-xs max-w-64">{errors.password}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label text="First Name" required />
            <Input
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>
          <div>
            <Label text="Last Name" required />
            <Input
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label text="Account" required />
            <Dropdown
              name="account"
              options={['Account 1', 'Account 2', 'Account 3']}
              value={formData.account}
              onChange={handleChange}
              placeholder="Select Account"
              error={!!errors.account}
            />
            {errors.account && (
              <p className="text-red-500 text-xs">{errors.account}</p>
            )}
          </div>
          <div>
            <Label text="User Type" required />
            <Dropdown
              name="userType"
              options={['Admin', 'User', 'Manager']}
              value={formData.userType}
              onChange={handleChange}
              placeholder="Select user Type"
              error={!!errors.userType}
            />
            {errors.userType && (
              <p className="text-red-500 text-xs">{errors.userType}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label text="Phone Number" required />
            <Input
              name="phoneNumber"
              type="tel"
              placeholder="(999) 888-7777"
              value={autoformatPhoneNumber(formData.phoneNumber)}
              error={!!errors.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <Label text="Timezone" required />
            <Dropdown
              name="timezone"
              options={['GMT', 'EST', 'PST']}
              value={formData.timezone}
              onChange={handleChange}
              placeholder="Select timezone"
              error={!!errors.timezone}
            />
            {errors.timezone && (
              <p className="text-red-500 text-xs">{errors.timezone}</p>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mb-6">
          By signing up, you agree to 24Seven Fees{' '}
          <a href="/terms" className="text-blue-600">
            terms of service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600">
            privacy policy
          </a>
          .
        </p>

        <Button
          onClick={handleSubmit}
          variant="green"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : 'Complete Sign Up'}
        </Button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600">
            Log in here.
          </a>
        </p>
      </form>
      <Toast
        message={toastState.message}
        isOpen={toastState.open}
        variant={toastState.variant as 'success' | 'error'}
        onClose={() => setToastState({ ...toastState, open: false })}
      />
    </div>
  )
}

export default SignUpForm
