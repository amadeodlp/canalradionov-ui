// components/atoms/Logo.tsx
import React from 'react'

type LogoProps = {
  src: string
  alt?: string
}

export const Logo: React.FC<LogoProps> = ({ src, alt = 'Logo' }) => {
  return <img src={src} alt={alt} />
}
