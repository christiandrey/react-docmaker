import React, { FC, PropsWithChildren } from 'react'
import { useFocused, useSelected } from 'slate-react'
import classnames from 'classnames'

export type ImageElementType = {
  url: string
  width?: number
  height?: number
}

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

  return (
    <span {...attributes}>
      {children}
      <img
        src={element.url}
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
