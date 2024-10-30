import React from 'react'

type ButtonProps = {
  onClick: (e: React.FormEvent) => void
  disabled?: boolean
  variant?: 'black' | 'white' | 'green' | 'red' | 'blue'
  children?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled,
  variant = 'white',
  children,
}) => {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'black':
        return 'bg-black hover:bg-gray-800 text-white';
      case 'white':
        return 'bg-white hover:bg-gray-200 text-black';
      case 'green':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'red':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-white hover:bg-gray-200 text-black'; // Fallback to white
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-3 ${getVariantStyles(variant)} font-bold rounded transition-all flex items-center justify-center`}
    >
      {children}
    </button>
  )
}
