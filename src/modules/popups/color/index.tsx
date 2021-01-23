import React, { FC, memo, MutableRefObject } from 'react'
import Popup from '../../popup'
import css from './style.module.css'
import classnames from 'classnames'

type ColorPopupProps = {
  anchorRef: MutableRefObject<Element>
  isVisible: boolean
  onRequestClose: Fn
}

type ColorBoxProps = {
  active?: boolean
  color: string
  onPress?: (value: string) => void
}

// -------------------------------------------------------------
// DEFAULT COLORS
// -------------------------------------------------------------
const DEFAULT_COLORS = [
  '#FF6900',
  '#FCB900',
  '#7BDCB5',
  '#00D084',
  '#8ED1FC',
  '#326FF3',
  '#ABB8C3',
  '#EB144C',
  '#F78DA7',
  '#9900EF'
]

const BaseColorBox: FC<ColorBoxProps> = ({ active, color, onPress }) => {
  const handlePress = () => {
    onPress?.(color)
  }

  return (
    <div
      style={{ color }}
      onClick={handlePress}
      title={color}
      className={classnames(
        's-32 rounded-default bg-current cursor-pointer transition-shadow duration-250',
        css['color-box'],
        { [css.active]: active }
      )}
    />
  )
}

const ColorBox = memo(BaseColorBox)

const ColorPopup: FC<ColorPopupProps> = ({
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
      <div className='rounded-default grid grid-cols-7 gap-6 p-8 bg-white border border-gray-300 overflow-hidden text-gray-500'>
        {DEFAULT_COLORS.map((o) => (
          <ColorBox color={o} key={o} />
        ))}
        <div className='h-32 col-span-4 overflow-hidden rounded-default border border-gray-200 flex items-center justify-start'>
          <div className='flex s-32 rounded-default rounded-r-none rounded-b-none bg-gray-200 text-gray-500 items-center justify-center font-semibold'>
            #
          </div>
          <input
            maxLength={6}
            className={classnames(
              'border-none h-full px-6 bg-transparent font-medium',
              css.input
            )}
            type='text'
          />
        </div>
      </div>
    </Popup>
  )
}

export default ColorPopup
