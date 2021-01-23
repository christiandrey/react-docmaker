import React, { FC, memo, PropsWithChildren } from 'react'
import Icon from '../icon'
import classnames from 'classnames'

type IconButtonProps = PropsWithChildren<{
  active?: boolean
  className?: string
  onPress?: Fn
}>

const BaseIconButton: FC<IconButtonProps> = ({
  active,
  className,
  children,
  onPress
}) => {
  return (
    <div
      className={classnames(
        's-32 rounded-default bg-transparent cursor-pointer flex items-center justify-center transition-colors duration-250 hover:bg-blue-100 hover:text-blue-500',
        {
          'text-blue-500 bg-blue-highlight': active
        },
        className
      )}
      onClick={onPress}
    >
      <Icon className='s-20'>{children}</Icon>
    </div>
  )
}

const IconButton = memo(BaseIconButton)

export default IconButton
