import React from 'react'
import { ToastProps, VariantsRecord } from './types'
import classnames from 'classnames'

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'success',
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div
      className={classnames('__toast-molecule', VariantsRecord[variant])}
      onClick={onClose}
    >
      <div className="h-full flex items-center justify-center">
        <span>{message}</span>
      </div>
    </div>
  )
}
