import React from 'react'

interface LabelProps {
  text: string
  required?: boolean
}

const Label: React.FC<LabelProps> = ({ text, required }) => (
  <label className="block text-sm font-medium text-gray-700">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
)

export default Label
