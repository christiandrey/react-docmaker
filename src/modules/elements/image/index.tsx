import React, { FC, PropsWithChildren, useMemo } from 'react'
import { useFocused, useSelected } from 'slate-react'
import classnames from 'classnames'
import { EditableElementType } from '../../../core/tools'
import { getPlaceholderImage } from '../../../core/utils'

export type ImageElementType = EditableElementType<{
  url: string
  width?: number
  height?: number
}>

type ImageElementProps = PropsWithChildren<{
  attributes: any
  element: ImageElementType
}>

const ImageElement: FC<ImageElementProps> = ({
  attributes,
  children,
  element
}) => {
  const selected = useSelected()
  const focused = useFocused()
  const url = useMemo(
    () =>
      element.editable
        ? getPlaceholderImage(element.width, element.height)
        : element.url,
    [element.editable, element.height, element.url, element.width]
  )

  return (
    <span {...attributes}>
      {children}
      <img
        src={url}
        style={{ width: element.width, height: element.height }}
        className={classnames(
          'inline-block max-w-full rounded-default align-bottom',
          {
            'shadow-outline': selected && focused
          }
        )}
      />
    </span>
  )
}

export default ImageElement
