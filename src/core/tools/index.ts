import { Editor, Element as SlateElement, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import classnames from 'classnames'

export type LeafFormatType =
  | 'bold'
  | 'code'
  | 'italic'
  | 'underline'
  | 'strikethrough'

export type HeadingFormatType = 'heading-one' | 'heading-two' | 'heading-three'

export type ListFormatType = 'numbered-list' | 'bulleted-list'

export type QuoteFormatType = 'block-quote'

export type ElementFormatType =
  | HeadingFormatType
  | ListFormatType
  | QuoteFormatType

export type SlateEditorType = Editor & ReactEditor

const LIST_TYPES = ['numbered-list', 'bulleted-list']

export function isMarkActive(editor: SlateEditorType, format: LeafFormatType) {
  if (!editor) {
    return null
  }

  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export function isBlockActive(
  editor: SlateEditorType,
  format: ElementFormatType
) {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  }) as any

  return !!match
}

export function toggleMarkActive(
  editor: SlateEditorType,
  format: LeafFormatType
) {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export function toggleBlockActive(
  editor: SlateEditorType,
  format: ElementFormatType
) {
  const isActive = isBlockActive(editor, format)

  if (isActive) {
    setBlockInactive(editor)
    return
  }

  setBlockActive(editor, format)
}

export function setBlockActive(
  editor: SlateEditorType,
  format: ElementFormatType
) {
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type as any)
      ),
    split: true
  })

  const newProperties: Partial<SlateElement> = {
    type: isList ? 'list-item' : format
  }

  Transforms.setNodes(editor, newProperties)

  if (isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export function setBlockInactive(editor: SlateEditorType) {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && (n.type as any)
      ),
    split: true
  })

  const newProperties: Partial<SlateElement> = {
    type: 'paragraph'
  }

  Transforms.setNodes(editor, newProperties)
}

export function focusEditor(editor: SlateEditorType) {
  ReactEditor.focus(editor)
}

export function composeWithClassName(attributes: any, className?: string) {
  return {
    ...attributes,
    className: classnames(attributes?.className, className)
  }
}