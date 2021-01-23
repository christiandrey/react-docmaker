import React, {
  FC,
  MutableRefObject,
  PropsWithChildren,
  useCallback
} from 'react'
import Popup from '../../popup'
import classnames from 'classnames'
import { HeadingFormatType } from '../../../core/tools'
import { nil } from '../../../core/utils'
import { useMouseDown } from '../../../core/hooks'

type TextSizePopupProps = {
  anchorRef: MutableRefObject<Element>
  isVisible: boolean
  value: HeadingFormatType
  onPressOption?: (value: HeadingFormatType) => void
  onRequestClose: Fn
}

type TextSizeOptionProps = PropsWithChildren<{
  active?: boolean
  onPress?: Fn
}>

const TextSizeOption: FC<TextSizeOptionProps> = ({
  active,
  children,
  onPress
}) => {
  const handlePress = useMouseDown(onPress)

  return (
    <div
      className={classnames(
        'cursor-pointer h-40 px-20 flex items-center font-medium bg-transparent transition-colors duration-250 hover:bg-blue-100 hover:text-blue-500',
        {
          'text-blue-500 bg-blue-highlight': active
        }
      )}
      onMouseDown={handlePress}
    >
      {children}
    </div>
  )
}

const TextSizePopup: FC<TextSizePopupProps> = ({
  anchorRef,
  isVisible,
  value,
  onPressOption,
  onRequestClose
}) => {
  const handlePressOption = useCallback(
    (option?: HeadingFormatType) => {
      onPressOption?.(option)
      onRequestClose?.()
    },
    [onPressOption, onRequestClose]
  )

  return (
    <Popup
      position='down'
      alignment='start'
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      anchorRef={anchorRef}
      transparent
      hideArrow
      overlayCloseOnClick
      contentClassName='rounded-default'
    >
      <div className='rounded-default w-144 bg-white border border-gray-300 overflow-hidden text-gray-500'>
        <TextSizeOption active={nil(value)} onPress={() => handlePressOption()}>
          <span className='-ml-1'>Normal</span>
        </TextSizeOption>
        <TextSizeOption
          active={value === 'heading-three'}
          onPress={() => handlePressOption('heading-three')}
        >
          <span className='text-headline -ml-1'>Heading 3</span>
        </TextSizeOption>
        <TextSizeOption
          active={value === 'heading-two'}
          onPress={() => handlePressOption('heading-two')}
        >
          <span className='text-heading-3 -ml-1'>Heading 2</span>
        </TextSizeOption>
        <TextSizeOption
          active={value === 'heading-one'}
          onPress={() => handlePressOption('heading-one')}
        >
          <span className='text-heading-2 -ml-1'>Heading 1</span>
        </TextSizeOption>
      </div>
    </Popup>
  )
}

export default TextSizePopup
