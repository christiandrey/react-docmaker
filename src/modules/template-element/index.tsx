import React, { FC, PropsWithChildren } from 'react'
import ImageElement, { ImageElementType } from '../elements/image'
import { BlockAlignment, composeWithAlignmentClassName } from '../../core/tools'

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

type TemplateElementType = {
  type: ElementType
  alignment?: BlockAlignment
} & ImageElementType

type TemplateElementProps = PropsWithChildren<{
  attributes: any
  element: TemplateElementType
}>

const TemplateElement: FC<TemplateElementProps> = ({
  attributes,
  children,
  element
}) => {
  const { type, url, alignment } = element

  switch (type) {
    default:
      return (
        <p {...composeWithAlignmentClassName(attributes, alignment)}>
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
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return (
        <h1
          {...composeWithAlignmentClassName(
            attributes,
            alignment,
            'text-heading-2'
          )}
        >
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2
          {...composeWithAlignmentClassName(
            attributes,
            alignment,
            'text-heading-3'
          )}
        >
          {children}
        </h2>
      )
    case 'heading-three':
      return (
        <h3
          {...composeWithAlignmentClassName(
            attributes,
            alignment,
            'text-headline'
          )}
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
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'link':
      return (
        <a href={url} {...attributes}>
          {children}
        </a>
      )
    case 'image':
      return <ImageElement {...{ attributes, children, element }} />
  }
}

export default TemplateElement
