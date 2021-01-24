import React, { FC, memo, PropsWithChildren } from 'react'
import Icon from '../icon'
import classnames from 'classnames'
import { useMouseDown } from '../../core/hooks'

type IconButtonProps = PropsWithChildren<{
  active?: boolean
  disabled?: boolean
  className?: string
  data?: string
  onPress?: Fn
}>

const BaseIconButton: FC<IconButtonProps> = ({
  active,
  data,
  disabled,
  className,
  children,
  onPress
}) => {
  const handlePress = useMouseDown(() => {
    onPress?.(data)
  })

  return (
    <div
      className={classnames(
        's-32 rounded-default bg-transparent cursor-pointer flex items-center justify-center transition-colors duration-250 hover:bg-blue-100 hover:text-blue-500',
        {
          'text-blue-500 bg-blue-highlight': active,
          'pointer-events-none opacity-50': disabled
        },
        className
      )}
      onMouseDown={handlePress}
    >
      <Icon className='s-20'>{children}</Icon>
    </div>
  )
}

const IconButton = memo(BaseIconButton)

export default IconButton
