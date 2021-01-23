import React, { FC, memo, PropsWithChildren } from 'react'

type ButtonProps = PropsWithChildren<{}>

const BaseButton: FC<ButtonProps> = ({ children }) => {
  return (
    <button className='border-transparent bg-blue-500 rounded-default font-medium cursor-pointer text-white px-18 py-12 transition-colors duration-250 hover:bg-blue-600'>
      {children}
    </button>
  )
}

const Button = memo(BaseButton)

export default Button
