import React, {
  Children,
  cloneElement,
  FC,
  PropsWithChildren,
  ReactElement
} from 'react'
import classnames from 'classnames'

type FieldProps = PropsWithChildren<{
  label?: string
  className?: string
}>

const Field: FC<FieldProps> = ({ className, children, label }) => {
  return (
    <div className={className}>
      {!!label?.length && (
        <label className='text-blue-500 block mb-4 text-subhead font-medium'>
          {label}
        </label>
      )}
      {Children.map(children, (child: ReactElement) =>
        cloneElement(child, {
          className: classnames(
            child.props.className,
            'w-full appearance-none border border-gray-200 rounded-default h-32 px-8 transition:colors transition:shadow duration-250 focus:border-blue-500 focus:shadow-outline'
          )
        })
      )}
    </div>
  )
}

export default Field
