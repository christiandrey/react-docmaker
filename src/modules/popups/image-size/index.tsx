import { ImageDimensions, notNil, parseNumber } from '../../../core/utils'
import React, {
  ChangeEvent,
  FC,
  MutableRefObject,
  useCallback,
  useState
} from 'react'

import Button from '../../button'
import Field from '../../field'
import Icon from '../../icon'
import Popup from '../../popup'
import { TiTimes } from '@react-icons/all-files/ti/TiTimes'

type ImageSizePopupProps = {
  anchorRef: MutableRefObject<Element>
  isVisible: boolean
  onRequestClose: Fn
  onSubmitEditing?: (value: ImageDimensions, label?: string) => void
}

const ImageSizePopup: FC<ImageSizePopupProps> = ({
  anchorRef,
  isVisible,
  onRequestClose,
  onSubmitEditing
}) => {
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [label, setLabel] = useState('')

  const isValid =
    notNil(width) && notNil(height) && !!label?.length && width * height > 0

  const handleChangeWidth = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setWidth(parseNumber(e.target.value))
  }, [])

  const handleChangeHeight = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setWidth(parseNumber(e.target.value))
  }, [])

  const handleChangeLabel = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value)
  }, [])

  const handleRequestClose = useCallback(() => {
    setWidth(100)
    setHeight(100)
    onRequestClose?.()
  }, [onRequestClose])

  const handlePressSubmit = useCallback(() => {
    onSubmitEditing?.(
      {
        width,
        height
      },
      label
    )
    handleRequestClose()
  }, [handleRequestClose, height, label, onSubmitEditing, width])

  return (
    <Popup
      position='down'
      alignment='start'
      isVisible={isVisible}
      onRequestClose={handleRequestClose}
      anchorRef={anchorRef}
      transparent
      hideArrow
      overlayCloseOnClick
      contentClassName='rounded-default'
    >
      <div className='rounded-default p-8 bg-white border border-gray-300 overflow-hidden text-gray-500'>
        <div>
          <Field label='Label' className='mb-8'>
            <input
              value={label}
              onChange={handleChangeLabel}
              placeholder='Image upload label'
            />
          </Field>
        </div>
        <span className='text-blue-500 block mb-4 text-subhead font-medium'>
          Dimensions
        </span>
        <div className='flex items-center justify-between space-x-4 mb-8'>
          <div className='h-32 overflow-hidden rounded-default border border-gray-200 flex items-center justify-start'>
            <input
              className='border-none h-full w-40 px-6 bg-transparent font-medium m-0'
              placeholder='0'
              value={width}
              onChange={handleChangeWidth}
            />
            <div className='flex s-32 bg-transparent text-gray-300 items-center justify-center text-subhead font-semibold'>
              PX
            </div>
          </div>
          <Icon>
            <TiTimes />
          </Icon>
          <div className='h-32 overflow-hidden rounded-default border border-gray-200 flex items-center justify-start'>
            <input
              className='border-none h-full w-40 px-6 bg-transparent font-medium m-0'
              placeholder='0'
              value={height}
              onChange={handleChangeHeight}
            />
            <div className='flex s-32 bg-transparent text-gray-300 items-center justify-center text-subhead font-semibold'>
              PX
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            disabled={!isValid}
            className='h-32'
            onPress={handlePressSubmit}
          >
            Insert
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default ImageSizePopup
