import { ImageDimensions, getImageSizeAsync, nil } from '../../../core/utils'
import React, {
  ChangeEvent,
  FC,
  MutableRefObject,
  useCallback,
  useMemo,
  useState
} from 'react'

import { BiLink } from '@react-icons/all-files/bi/BiLink'
import Button from '../../button'
import Icon from '../../icon'
import Popup from '../../popup'

export type ImageProps = {
  url?: string
  label?: string
  dimensions: ImageDimensions
}

type ImagePopupProps = {
  anchorRef: MutableRefObject<Element>
  isVisible: boolean
  onRequestClose: Fn
  onSubmitEditing?: (value: ImageProps) => void
}

const ImagePopup: FC<ImagePopupProps> = ({
  anchorRef,
  isVisible,
  onRequestClose,
  onSubmitEditing
}) => {
  const [imageState, setImageState] = useState('')
  const [scaleState, setScaleState] = useState('100')
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>()

  const decimalScale = useMemo(() => {
    const value = parseFloat(scaleState)
    const normalized = isNaN(value) || value < 1 ? 1 : value
    return normalized / 100
  }, [scaleState])

  const handleChangeImageUrl = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setImageState(e.target.value)
    },
    []
  )

  const handleChangeScale = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setScaleState(e.target.value)
  }, [])

  const handleBlurImageInput = useCallback(async () => {
    if (!imageState?.length) {
      setImageDimensions(null)
      return
    }

    try {
      const dimensions = await getImageSizeAsync(imageState)
      setImageDimensions(dimensions)
    } catch (error) {
      setImageDimensions(null)
    }
  }, [imageState])

  const handleRequestClose = useCallback(() => {
    setImageState('')
    setScaleState('100')
    setImageDimensions(null)
    onRequestClose?.()
  }, [onRequestClose])

  const handlePressSubmit = useCallback(() => {
    onSubmitEditing?.({
      url: imageState,
      dimensions: {
        width: imageDimensions.width * decimalScale,
        height: imageDimensions.height * decimalScale
      }
    })
    handleRequestClose()
  }, [
    decimalScale,
    handleRequestClose,
    imageDimensions,
    imageState,
    onSubmitEditing
  ])

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
      <div className='rounded-default p-8 w-296 bg-white border border-gray-300 overflow-hidden text-gray-500'>
        <div className='flex items-center justify-between space-x-4 mb-8'>
          <div className='h-32 flex-1 overflow-hidden rounded-default border border-gray-200 flex items-center justify-start'>
            <div className='flex s-32 rounded-default rounded-r-none rounded-b-none bg-gray-200 text-gray-500 items-center justify-center font-semibold'>
              <Icon>
                <BiLink />
              </Icon>
            </div>
            <input
              className='border-none h-full px-6 bg-transparent font-medium flex-1 min-w-0'
              type='text'
              placeholder='https://www...'
              value={imageState}
              onChange={handleChangeImageUrl}
              onBlur={handleBlurImageInput}
            />
          </div>
          <div className='h-32 overflow-hidden rounded-default border border-gray-200 flex items-center justify-start'>
            <input
              maxLength={3}
              className='border-none h-full w-40 px-6 bg-transparent font-medium m-0'
              placeholder='0'
              value={scaleState}
              onChange={handleChangeScale}
            />
            <div className='flex s-32 bg-transparent text-gray-300 items-center justify-center font-semibold'>
              %
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            disabled={nil(imageDimensions)}
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

export default ImagePopup
