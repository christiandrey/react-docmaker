import React, { FC, MutableRefObject, PropsWithChildren } from 'react'
import Popup from '../../popup'
import classnames from 'classnames'

type TextSizePopupProps = {
  anchorRef: MutableRefObject<Element>
  isVisible: boolean
  onRequestClose: Fn
}

type TextSizeOptionProps = PropsWithChildren<{
  active?: boolean
}>

const TextSizeOption: FC<TextSizeOptionProps> = ({ active, children }) => {
  return (
    <div
      className={classnames(
        'cursor-pointer h-40 px-20 flex items-center font-medium bg-transparent transition-colors duration-250 hover:bg-blue-100 hover:text-blue-500',
        {
          'text-blue-500 bg-blue-highlight': active
        }
      )}
    >
      {children}
    </div>
  )
}

const TextSizePopup: FC<TextSizePopupProps> = ({
  anchorRef,
  isVisible,
  onRequestClose
}) => {
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
        <TextSizeOption>
          <span className='-ml-1'>Normal</span>
        </TextSizeOption>
        <TextSizeOption>
          <span className='text-headline -ml-1'>Heading 3</span>
        </TextSizeOption>
        <TextSizeOption active>
          <span className='text-heading-3 -ml-1'>Heading 2</span>
        </TextSizeOption>
        <TextSizeOption>
          <span className='text-heading-2 -ml-1'>Heading 1</span>
        </TextSizeOption>
      </div>
    </Popup>
  )
}

export default TextSizePopup
