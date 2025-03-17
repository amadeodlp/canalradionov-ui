import React from 'react'
type InputProps = {
  type: string
  placeholder: string
  value: string
  error?: boolean
  onChange: (value: string) => void
}
export declare const Input: React.FC<InputProps>
export {}
