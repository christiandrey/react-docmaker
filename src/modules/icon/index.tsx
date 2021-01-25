import React, {
  Children,
  cloneElement,
  FC,
  memo,
  PropsWithChildren,
  ReactElement
} from 'react'
import classnames from 'classnames'

type IconProps = PropsWithChildren<{
  className?: string
  onPress?: Fn
}>

const BaseIcon: FC<IconProps> = ({ children, className, onPress }) => {
  return (
    <figure
      onClick={onPress}
      className={classnames('flex-shrink-0', className, {
        's-16': !/\bs-[0-9]/gi.test(className)
      })}
    >
      {Children.map(children, (child: ReactElement) =>
        cloneElement(child, {
          className: classnames(
            child.props.className,
            'h-full w-full object-contain object-center m-auto pointer-events-none'
          )
        })
      )}
    </figure>
  )
}

const Icon = memo(BaseIcon)

export default Icon
