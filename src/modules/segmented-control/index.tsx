import React, { MouseEvent, FC, memo } from 'react'
import classnames from 'classnames'

type SegmentedControlProps = {
  className?: string
  value: number
  options: Array<string>
  onChangeValue: (value: number) => void
}

const BaseSegmentedControl: FC<SegmentedControlProps> = ({
  className,
  value,
  options,
  onChangeValue
}) => {
  const handlePressOption = (e: MouseEvent, index: number) => {
    e.preventDefault()
    onChangeValue?.(index)
  }

  return (
    <div
      className={classnames(
        'bg-gray-100 rounded-full p-4 w-296 h-40 flex items-center relative',
        className
      )}
    >
      <div
        className='absolute bg-gray-500 rounded-full z-0 top-4 h-32 transition-all duration-500'
        style={{ width: 144, left: 144 * value + 4 }}
      />
      {options.map((o, i) => (
        <div
          className={classnames(
            'font-medium flex-1 flex items-center justify-center relative z-1 cursor-pointer transition-colors duration-500',
            {
              'text-gray-500 hover:text-gray-700': value !== i,
              'text-white': value === i
            }
          )}
          key={i}
          onMouseDown={(e) => handlePressOption(e, i)}
        >
          {o}
        </div>
      ))}
    </div>
  )
}

const SegmentedControl = memo(BaseSegmentedControl)

export default SegmentedControl
