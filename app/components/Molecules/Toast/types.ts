/**
 * @description Type definition for Toast
 * @interface ToastProps
 */

/**
 * Toast states, use of cases, using const assertions
 */

type Variants = 'success' | 'error' | 'warning' | 'info';

/**
 * @description Export available options to match classes
 */
const VariantsRecord: Record<Variants, string> = {
  success: '__success bg-[#4CAF50]',
  error: '__error bg-[#DD3819]',
  warning: '__warning bg-[#FF8200]',
  info: '__info bg-[#2196f3]',
}

export interface ToastProps {
  /**
   * Toast message
   */
  message?: string
  /**
   * Toast Theme
   */
  variant?: Variants
  /**
   * Toast isOpen
   */
  isOpen?: boolean
  /**
   * Toast classNames
   */
  classNames?: string
  /**
   * onClose
   */
  onClose?: () => void
}

export { VariantsRecord }
