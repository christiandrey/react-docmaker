import React, { FC, PropsWithChildren } from 'react'
import { useFocused, useSelected } from 'slate-react'
import classnames from 'classnames'

export type ImageElementType = {
  url: string
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
    <div {...attributes}>
      {children}
      <img
        src={element.url}
        className={classnames('block max-w-full max-h-120 rounded-default', {
          'shadow-outline': selected && focused
        })}
      />
    </div>
  )
}

export default ImageElement
