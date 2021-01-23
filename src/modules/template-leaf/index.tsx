import React, { FC, PropsWithChildren } from 'react'

export type TemplateLeafType = Partial<{
  bold: boolean
  code: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
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

  return <span {...attributes}>{children}</span>
}

export default TemplateLeaf
