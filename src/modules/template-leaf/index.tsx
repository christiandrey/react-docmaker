import React, { FC, PropsWithChildren } from 'react'
import {
  composeWithClassName,
  composeWithStyle,
  EditableRefAttributes
} from '../../core/tools'
import classnames from 'classnames'
import { notNil } from '../../core/utils'

export type TemplateLeafType = Partial<{
  bold: boolean
  code: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  color: string
  ref: EditableRefAttributes
}>

type TemplateLeafProps = PropsWithChildren<{
  attributes: any
  leaf: TemplateLeafType
}>

const TemplateLeaf: FC<TemplateLeafProps> = ({
  attributes,
  children,
  leaf
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikethrough) {
    children = <del>{children}</del>
  }

  return (
    <span
      {...composeWithClassName(
        composeWithStyle(attributes, { color: leaf.color }),
        classnames({ 'bg-green-highlight': notNil(leaf.ref) })
      )}
    >
      {children}
    </span>
  )
}

export default TemplateLeaf
