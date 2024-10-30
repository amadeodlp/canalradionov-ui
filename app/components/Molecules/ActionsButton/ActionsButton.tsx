"use client"
import { Spinner } from "@components/atoms/Spinner/Spinner"
import { useAppDispatch } from "@hooks"
import React, { useState, useEffect, useRef } from 'react'
import { logout } from "@redux/auth/authSlice"

type ActionsButtonProps = {
  onClick?: (e: React.FormEvent) => void
  disabled?: boolean
  variant?: 'black' | 'white' | 'green' | 'red' | 'blue' | 'transparent'
  profilePicture: string
  children?: React.ReactNode
  classnames?: string
}

export const ActionsButton: React.FC<ActionsButtonProps> = ({
  onClick,
  disabled,
  variant = 'white',
  profilePicture,
  classnames,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLogginOut, setIsLogginOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isAdmin = true;
  const dispatch = useAppDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLogginOut(true)
    try {
      return dispatch(logout()) 
    } finally {
      setIsLogginOut(false)
    }
  }

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'black':
        return 'bg-black hover:bg-gray-800 text-white'
      case 'white':
        return 'bg-white hover:bg-gray-200 text-black'
      case 'green':
        return 'bg-green-500 hover:bg-green-600 text-white'
      case 'red':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white'
      case 'transparent':
        return 'bg-transparent hover:bg-gray-400 text-black'
      default:
        return 'bg-white hover:bg-gray-200 text-black'
    }
  }

  return (
    <div className={`relative border border-black rounded inline-block ${classnames}`} ref={dropdownRef}>
      <button
        onClick={(e) => {
          toggleDropdown()
          onClick && onClick(e)
        }}
        disabled={disabled}
        className={`w-60 h-20 p-3 font-bold rounded transition-all flex items-center justify-between ${getVariantStyles(
          variant
        )}`}
      >
        <img
          src={profilePicture}
          alt="Profile"
          className="rounded-full object-cover w-16 h-16 mr-3"
        />
        <span className="flex-grow text-left text-[#edebeb]">{children}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            {/* Standard Admin Operations */}
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Perform regular user task 1
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Perform regular user task 2
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              Perform regular user task 3
            </li>

            {isAdmin && (
              <>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Perform admin task 1
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Perform admin task 2
                </li>
              </>
            )}
            <div onClick={handleLogout}>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {isLogginOut ? <Spinner color="black" /> : "Logout"}
              </li>
            </div>
          </ul>
        </div>
      )}
    </div>
  )
}
