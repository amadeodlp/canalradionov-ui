export const autoformatPhoneNumber = (input: string) => {
  if (!input) return input
  const phoneNumber = input.replace(/[^\d]/g, '')
  if (phoneNumber.length < 4) return phoneNumber
  if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
}

export const formatUSPhoneNumberTo164 = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '').trim()
  return `+1${cleaned.slice(0, 3)}${cleaned.slice(3, 6)}${cleaned.slice(6, 10)}`
}
