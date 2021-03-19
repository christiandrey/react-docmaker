import React, { ReactNode, Ref, forwardRef } from 'react'

import Icon from '../icon'
import classnames from 'classnames'
import css from './style.module.css'
import { useMouseDown } from '../../core/hooks'

type IconButtonProps = {
  active?: boolean
  disabled?: boolean
  className?: string
  data?: string
  tip?: string
  onPress?: Fn
  children?: ReactNode
}

const BaseIconButton = (
  {
    active,
    data,
    disabled,
    className,
    children,
    onPress,
    tip
  }: IconButtonProps,
  ref: Ref<HTMLDivElement>
) => {
  const handlePress = useMouseDown(() => {
    onPress?.(data)
  })

  return (
    <div
      ref={ref}
      className={classnames(
        's-32 rounded-default bg-transparent cursor-pointer flex items-center justify-center transition-colors duration-250 hover:bg-blue-100 hover:text-blue-500',
        {
          'text-blue-500 bg-blue-highlight': active,
          'pointer-events-none opacity-50': disabled,
          [css.tooltip]: !!tip?.length
        },
        className
      )}
      data-tip={tip}
      onMouseDown={handlePress}
    >
      <Icon className='s-20'>{children}</Icon>
    </div>
  )
}

const IconButton = forwardRef(BaseIconButton)

export default IconButton
