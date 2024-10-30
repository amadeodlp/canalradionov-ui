import React, { useState } from 'react'

type DropdownProps = {
  placeholder: string
  value: string
  name: string
  options: string[]
  error?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const Dropdown: React.FC<DropdownProps> = ({
  placeholder,
  value,
  name,
  options,
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
      <select
        value={value}
        name={name}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full h-12 p-2 border ${error ? 'border-[#d00e17]' : focused ? 'border-blue-500' : 'border-gray-300'} rounded focus:outline-none`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
