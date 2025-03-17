// components/atoms/Input.tsx
import React, { useState } from 'react'

type LoginInputProps = {
  type: string
  placeholder: string
  name: string
  value: string
  error?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const LoginInput: React.FC<LoginInputProps> = ({
  type,
  placeholder,
  name,
  value,
  error,
  onChange,
}) => {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className="relative"
      onClick={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <label
        className={`absolute left-3 top-3 bg-white px-2 ${error ? 'text-[#d00e17]' : focused ? 'text-blue-500' : 'text-gray-500'} transition-all ${
          focused || value ? 'transform -translate-y-6 text-sm' : ''
        }`}
      >
        {placeholder}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full h-12 p-2 border ${error ? 'border-[#d00e17]' : focused ? 'border-blue-500' : 'border-gray-300'} rounded focus:outline-none`}
      />
    </div>
  )
}
