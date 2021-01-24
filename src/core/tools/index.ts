import { Editor, Element as SlateElement, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import classnames from 'classnames'
import { CSSProperties } from 'react'
import { areEqualColors, clamp, notNil } from '../utils'
import { INDENTATION_FACTOR, LIST_TYPES } from '../constants'

export type BlockAlignment = 'left' | 'center' | 'right' | 'justify'

export type LeafFormatType =
  | 'bold'
  | 'code'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'color'

export type HeadingFormatType = 'heading-one' | 'heading-two' | 'heading-three'

export type ListFormatType = 'numbered-list' | 'bulleted-list'

export type QuoteFormatType = 'block-quote'

export type ElementFormatType =
  | HeadingFormatType
  | ListFormatType
  | QuoteFormatType

export type SlateEditorType = Editor & ReactEditor

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

export function isMarkActive(editor: SlateEditorType, format: LeafFormatType) {
  if (!editor) {
    return null
  }

  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export function isColorMarkActive(editor: SlateEditorType) {
  if (!editor) {
    return null
  }

  const marks = Editor.marks(editor)
  return marks ? notNil(marks.color) : false
}

export function getColorMark(editor: SlateEditorType) {
  if (!editor) {
    return null
  }

  const marks = Editor.marks(editor)
  return marks?.color
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

export function toggleColorMarkActive(editor: SlateEditorType, value?: string) {
  const existingMark = getColorMark(editor)

  if (notNil(existingMark) && areEqualColors(existingMark, value)) {
    Editor.removeMark(editor, 'color')
  } else {
    Editor.addMark(editor, 'color', value)
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

export function composeWithAlignmentClassName(
  attributes: any,
  alignment?: BlockAlignment,
  className?: string
) {
  return {
    ...attributes,
    className: classnames(attributes?.className, className, {
      'text-right': alignment === 'right',
      'text-center': alignment === 'center',
      'text-justify': alignment === 'justify'
    })
  }
}

export function composeWithStyle(attributes: any, style: CSSProperties = {}) {
  return {
    ...attributes,
    style: { ...(attributes?.style || {}), ...style }
  }
}

export function getCurrentNode(editor: SlateEditorType) {
  const selection = editor?.selection

  if (selection !== null && selection.anchor !== null) {
    return editor.children[selection.anchor.path[0]]
  } else {
    return null
  }
}

export function getAlignment(editor: SlateEditorType): BlockAlignment {
  const currentNode = getCurrentNode(editor) as any
  return currentNode?.alignment
}

export function setAlignment(editor: SlateEditorType, value?: BlockAlignment) {
  const alignment = value === 'left' ? null : value
  const newProperties: Partial<SlateElement> = {
    alignment
  }

  Transforms.setNodes(editor, newProperties)
}

export function getIndentation(editor: SlateEditorType): number {
  const currentNode = getCurrentNode(editor) as any
  return currentNode?.indentation
}

export function getIndentationPercent(value: number): string {
  if (!value) {
    return null
  }

  return `${value}%`
}

export function increaseIndentation(editor: SlateEditorType) {
  const currentIndentation = getIndentation(editor) || 0
  const indentation = clamp(currentIndentation + INDENTATION_FACTOR, 0, 99)
  const newProperties: Partial<SlateElement> = {
    indentation
  }

  Transforms.setNodes(editor, newProperties)
}

export function decreaseIndentation(editor: SlateEditorType) {
  const currentIndentation = getIndentation(editor) || 0
  const indentation = clamp(currentIndentation - INDENTATION_FACTOR, 0, 99)
  const newProperties: Partial<SlateElement> = {
    indentation: indentation === 0 ? null : indentation
  }

  Transforms.setNodes(editor, newProperties)
}
