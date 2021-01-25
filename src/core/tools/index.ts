import { Editor, Element as SlateElement, Node, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import classnames from 'classnames'
import { CSSProperties } from 'react'
import { areEqualColors, clamp, generateUUID, nil, notNil } from '../utils'
import { INDENTATION_FACTOR, LIST_TYPES } from '../constants'
import { HistoryEditor } from 'slate-history'
import { ImageProps } from '../../modules/popups/image'
import { ImageElementType } from '../../modules/elements/image'

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

export type SlateEditorType = Editor & ReactEditor & HistoryEditor

export type EditableElementType<T> = {
  id?: string
  editable?: true
} & T

export type EditableDataType = 'text' | 'options' | 'radio' | 'time' | 'date'

export type EditableOption = {
  id: string
  label: string
}

export type EditableAttributes = Partial<{
  dataType: EditableDataType
  dateTimeFormat: string
  defaultValue: string
  label: string
  multiline: boolean
  options: Array<EditableOption>
  tip: string
  valueRef: string
}>

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
  ReactEditor.focus(editor as ReactEditor)
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
    const parentNode = editor.children[selection.anchor.path[0]]

    if (LIST_TYPES.includes(parentNode?.type as BlockAlignment)) {
      return parentNode.children[selection.anchor.path[1]]
    }

    return parentNode
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

export function composeWithEditable<T extends object>(
  attributes: T
): EditableElementType<T> {
  if (nil(attributes)) {
    return null
  }

  return {
    ...attributes,
    editable: true,
    id: generateUUID()
  }
}

export function insertImageBlock(
  editor: SlateEditorType,
  attributes: ImageProps,
  editable?: boolean
) {
  const {
    url,
    dimensions: { width, height }
  } = attributes

  let imageNode: SlateElement & ImageElementType = {
    type: 'image',
    url,
    width,
    height,
    children: [{ text: '' }]
  }

  if (editable) {
    imageNode = composeWithEditable(imageNode)
  }

  Transforms.insertNodes(editor, imageNode)
  Transforms.move(editor)
}

export function insertEditableBlock(
  editor: SlateEditorType,
  attributes: EditableAttributes
) {
  let editableNode: SlateElement & EditableAttributes = {
    type: 'editable',
    ...attributes,
    children: [{ text: '' }]
  }

  editableNode = composeWithEditable(editableNode)

  Transforms.insertNodes(editor, editableNode)
  Transforms.move(editor)
}

export function getEditableAttributes(
  attributes: EditableAttributes,
  showTip = false
) {
  const {
    dataType,
    dateTimeFormat,
    multiline,
    defaultValue,
    label,
    options,
    tip,
    valueRef
  } = attributes

  const parsedAttributes = {
    dataType,
    defaultValue
  } as EditableAttributes

  if (valueRef?.length) {
    parsedAttributes.valueRef = valueRef
    return parsedAttributes
  }

  if (showTip) {
    parsedAttributes.tip = tip
  }

  if (dataType === 'text' && multiline) {
    parsedAttributes.multiline = multiline
  }

  if (['options', 'radio'].includes(dataType)) {
    parsedAttributes.options = options
  }

  if (['date', 'time'].includes(dataType)) {
    parsedAttributes.dateTimeFormat = dateTimeFormat
  }

  parsedAttributes.label = label

  return parsedAttributes
}

export function getEditableAttributesValidity(
  attributes: EditableAttributes,
  showTip = false,
  copyExisting = false
): boolean {
  const {
    dataType,
    dateTimeFormat,
    defaultValue,
    label,
    options,
    tip,
    valueRef
  } = attributes

  if (copyExisting) {
    return !!valueRef?.length && !!defaultValue?.length
  }

  if (
    !dataType?.length ||
    !defaultValue?.length ||
    !label?.length ||
    (showTip && !tip.length)
  ) {
    return false
  }

  if (['options', 'radio'].includes(dataType)) {
    return !!options?.length
  }

  if (['date', 'time'].includes(dataType)) {
    return !!dateTimeFormat?.length
  }

  return true
}

export function getMatchingNodes(
  node: Node,
  match: (node: Node) => boolean = () => true,
  matching: Array<Node> = []
) {
  if (match(node)) {
    matching.push(node)
  }

  const children = node.children as Array<Node>

  if (children?.length) {
    for (const child of children) {
      getMatchingNodes(child, match, matching)
    }
  }

  return matching
}
