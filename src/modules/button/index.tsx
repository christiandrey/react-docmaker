import React, { FC, memo, PropsWithChildren } from 'react'
import classnames from 'classnames'

type ButtonProps = PropsWithChildren<{
  disabled?: boolean
  onPress?: Fn
}>

const BaseButton: FC<ButtonProps> = ({ children, disabled, onPress }) => {
  return (
    <button
      onClick={onPress}
      className={classnames(
        'border-transparent rounded-default font-medium cursor-pointer text-white px-18 py-12 transition-colors duration-250 hover:bg-blue-600',
        {
          'bg-blue-500': !disabled,
          'pointer-events-none bg-blue-300': disabled
        }
      )}
    >
      {children}
    </button>
  )
}

const Button = memo(BaseButton)

export default Button
