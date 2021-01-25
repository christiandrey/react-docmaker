import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useFocused, useSelected } from 'slate-react'
import classnames from 'classnames'
import {
  composeWithClassName,
  composeWithStyle,
  EditableAttributes,
  EditableElementType
} from '../../../core/tools'

type EditableElementProps = PropsWithChildren<{
  attributes: any
  element: EditableElementType<EditableAttributes>
}>

const EditableElement: FC<EditableElementProps> = ({
  attributes,
  children,
  element
}) => {
  const selected = useSelected()
  const focused = useFocused()

  useEffect(() => {
    return () => {
      // TODO: Find refs that match unset ref value
    }
  }, [])

  return (
    <span
      {...composeWithStyle(
        composeWithClassName(
          attributes,
          classnames(
            'bg-blue-500 text-white font-medium px-4 py-2 rounded-default mx-1',
            {
              'shadow-outline': selected && focused
            }
          )
        ),
        { fontSize: '0.85em' }
      )}
      contentEditable={false}
    >
      {element.defaultValue}
      {children}
    </span>
  )
}

export default EditableElement
