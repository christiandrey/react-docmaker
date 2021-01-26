import React, { FC, PropsWithChildren } from 'react'
import ImageElement, { ImageElementType } from '../elements/image'
import {
  BlockAlignment,
  composeWithAlignmentClassName,
  composeWithClassName,
  composeWithStyle,
  EditableAttributes,
  EditableElementType,
  getIndentationPercent
} from '../../core/tools'
import EditableElement from '../elements/editable'

export type ElementType =
  | 'quote'
  | 'code'
  | 'bulleted-list'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'heading-four'
  | 'heading-five'
  | 'heading-six'
  | 'list-item'
  | 'numbered-list'
  | 'link'
  | 'image'
  | 'editable'

type TemplateElementType = {
  type: ElementType
  alignment?: BlockAlignment
  indentation?: number
} & ImageElementType &
  EditableElementType<EditableAttributes>

type TemplateElementProps = PropsWithChildren<{
  attributes: any
  element: TemplateElementType
}>

const TemplateElement: FC<TemplateElementProps> = ({
  attributes,
  children,
  element
}) => {
  const { type, url, alignment, indentation, dataType } = element

  switch (type) {
    default:
      return (
        <p
          {...composeWithStyle(
            composeWithAlignmentClassName(attributes, alignment),
            { paddingLeft: getIndentationPercent(indentation) }
          )}
        >
          {children}
        </p>
      )
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'code':
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      )
    case 'bulleted-list':
      return (
        <ul {...composeWithClassName(attributes, 'list-disc list-inside')}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1
          {...composeWithStyle(
            composeWithAlignmentClassName(
              attributes,
              alignment,
              'text-heading-2'
            ),
            { paddingLeft: getIndentationPercent(indentation) }
          )}
        >
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2
          {...composeWithStyle(
            composeWithAlignmentClassName(
              attributes,
              alignment,
              'text-heading-3'
            ),
            { paddingLeft: getIndentationPercent(indentation) }
          )}
        >
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3
          {...(composeWithStyle(
            composeWithAlignmentClassName(
              attributes,
              alignment,
              'text-headline'
            )
          ),
          { paddingLeft: getIndentationPercent(indentation) })}
        >
          {children}
        </h3>
      )
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return (
        <li
          {...composeWithStyle(attributes, {
            paddingLeft: getIndentationPercent(indentation)
          })}
        >
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol {...composeWithClassName(attributes, 'list-decimal list-inside')}>
          {children}
        </ol>
      )
    case 'link':
      return (
        <a href={url} {...attributes}>
          {children}
        </a>
      )
    case 'image':
      return <ImageElement {...{ attributes, children, element }} />
    case 'editable':
      return dataType === 'image' ? (
        <ImageElement {...{ attributes, children, element }} />
      ) : (
        <EditableElement {...{ attributes, children, element }} />
      )
  }
}

export default TemplateElement
