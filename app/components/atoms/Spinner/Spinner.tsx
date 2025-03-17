import React from 'react'

type SpinnerProps = {
  color?: 'black' | 'white' | 'green' | 'red' | 'blue'
}

export const Spinner: React.FC<SpinnerProps> = ({ color = 'black' }) => {
  const getBorderColor = (color: string) => {
    switch (color) {
      case 'black':
        return 'border-t-transparent border-b-black';
      case 'white':
        return 'border-t-transparent border-b-white';
      case 'green':
        return 'border-t-transparent border-b-green-500';
      case 'red':
        return 'border-t-transparent border-b-red-500';
      case 'blue':
        return 'border-t-transparent border-b-blue-500';
      default:
        return 'border-t-transparent border-b-white'; // Default to white
    }
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 h-6 w-6 ${getBorderColor(
        color
      )}`}
    ></div>
  )
}
