import {
  Editor,
  Node,
  NodeEntry,
  Path,
  Point,
  Range,
  Element as SlateElement,
  Transforms
} from 'slate'
import { INDENTATION_FACTOR, LIST_TYPES } from '../constants'
import { areEqualColors, clamp, generateUUID, nil, notNil } from '../utils'

import { CSSProperties } from 'react'
import { HistoryEditor } from 'slate-history'
import { ImageElementType } from '../../modules/elements/image'
import { ImageProps } from '../../modules/popups/image'
import { ReactEditor } from 'slate-react'
import classnames from 'classnames'

export type TableCell = {
  type: 'table-cell'
  key: string
  rowspan?: number
  colspan?: number
  width?: number
  height?: number
  selectedCell?: boolean
  children: Node[]
} & SlateElement

export type TableRow = {
  type: 'table-row'
  key: string
  data: any
  children: TableCell[]
} & SlateElement

export type TableContent = {
  type: 'table-content'
  children: Node[]
} & SlateElement

export type Table = {
  type: 'table'
  children: TableRow[]
  data: any
  borderless?: boolean
} & SlateElement

export type BlockAlignment = 'left' | 'center' | 'right' | 'justify'

export type LeafFormatType =
  | 'bold'
  | 'code'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'color'
  | 'ref'

export type HeadingFormatType = 'heading-one' | 'heading-two' | 'heading-three'

export type ListFormatType = 'numbered-list' | 'bulleted-list'

export type QuoteFormatType = 'block-quote'

export type TableFormatType =
  | 'table'
  | 'table-content'
  | 'table-row'
  | 'table-cell'

export type ElementFormatType =
  | HeadingFormatType
  | ListFormatType
  | QuoteFormatType
  | TableFormatType

export type SlateEditorType = Editor & ReactEditor & HistoryEditor

export type EditableElementType<T> = {
  id?: string
  editable?: true
} & T

export type EditableDataType =
  | 'text'
  | 'options'
  | 'radio'
  | 'time'
  | 'date'
  | 'image'

export type EditableOption = {
  id: string
  label: string
}

export type EditableRefAttributes = {
  parent: string
  value: string
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
  ref: EditableRefAttributes
  isOrphan: boolean
  children: Array<EditableAttributes & { text: string }>
}>

export type DocmakerNode = EditableElementType<
  EditableAttributes & { text: string }
>

export type DocmakerData = Partial<{
  title: string
  createdAt: string
  nodes: Array<DocmakerNode>
  orphans: Array<DocmakerNode>
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

export function isMarkActiveLegacy(
  editor: SlateEditorType,
  format: LeafFormatType
) {
  if (!editor) {
    return null
  }

  const marks = Editor.marks(editor)

  if (notNil(marks)) {
    const value = marks[format]
    return format === 'ref' ? notNil(value) : value === true
  }

  return false
}

export function isMarkActive(editor: SlateEditorType, format: LeafFormatType) {
  if (!editor) {
    return null
  }

  const marks = Editor.marks(editor)
  const nodesInSelection = getMatchingNodesInSelection(editor, (o) =>
    Editor.isInline(editor, o)
  )
  const editableNodes = getMatchingNodesInSelection(
    editor,
    (o) => o.type === 'editable'
  )

  let marksResolution = false
  let editablesResolution = false

  if (notNil(marks)) {
    const value = marks[format]
    marksResolution = ['color', 'ref'].includes(format)
      ? notNil(value)
      : value === true
  }

  if (editableNodes?.length) {
    editablesResolution = editableNodes
      .map((o) =>
        ['color', 'ref'].includes(format)
          ? notNil(o[format])
          : o[format] === true
      )
      .every((o) => o)
  }

  if (
    nodesInSelection?.length &&
    nodesInSelection.every((o) => editableNodes.includes(o))
  ) {
    return editablesResolution
  }

  return editableNodes?.length
    ? editablesResolution && marksResolution
    : marksResolution
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
  const nodesInSelection = getMatchingNodesInSelection(editor, (o) =>
    Editor.isInline(editor, o)
  )
  const editableNodes = getMatchingNodesInSelection(
    editor,
    (o) => o.type === 'editable'
  )

  const marksValue = marks?.color
  let editablesValue = null

  if (editableNodes?.length) {
    editablesValue = editableNodes[0].color
  }

  if (
    nodesInSelection?.length &&
    nodesInSelection.every((o) => editableNodes.includes(o))
  ) {
    return editablesValue
  }

  return editableNodes?.length ? editablesValue : marksValue
}

export function toggleMarkActiveLegacy(
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

export function toggleMarkActive(
  editor: SlateEditorType,
  format: LeafFormatType
) {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
    Transforms.unsetNodes(editor, format, {
      match: (o) => Editor.isVoid(editor, o) && o.type === 'editable'
    })
  } else {
    Transforms.setNodes(
      editor,
      { [format]: true },
      {
        match: (o) => Editor.isVoid(editor, o) && o.type === 'editable',
        hanging: true
      }
    )
    Editor.addMark(editor, format, true)
  }
}

export function toggleColorMarkActive(editor: SlateEditorType, value?: string) {
  const existingMark = getColorMark(editor)

  if (notNil(existingMark) && areEqualColors(existingMark, value)) {
    Editor.removeMark(editor, 'color')
    Transforms.unsetNodes(editor, 'color', {
      match: (o) => Editor.isVoid(editor, o) && o.type === 'editable'
    })
  } else {
    Transforms.setNodes(
      editor,
      { color: value },
      {
        match: (o) => Editor.isVoid(editor, o) && o.type === 'editable',
        hanging: true
      }
    )
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

export function createEditableNode(
  attributes: EditableAttributes,
  isOrphan = false
) {
  let editableNode: SlateElement & EditableAttributes = {
    type: 'editable',
    ...attributes,
    children: [{ text: '' }]
  }

  if (isOrphan) {
    editableNode.isOrphan = isOrphan
  }

  editableNode = composeWithEditable(editableNode)

  return editableNode
}

export function insertImageBlock(
  editor: SlateEditorType,
  attributes: ImageProps,
  editable?: boolean
) {
  const {
    url,
    dimensions: { width, height },
    label
  } = attributes

  let imageNode: SlateElement & ImageElementType = {
    type: 'image',
    url,
    width,
    height,
    children: [{ text: '' }]
  }

  if (editable) {
    imageNode.type = 'editable'
    imageNode.dataType = 'image'
    imageNode.label = label
    imageNode = composeWithEditable(imageNode)
  }

  Transforms.insertNodes(editor, imageNode)
  Transforms.move(editor)
}

export function insertEditableBlock(
  editor: SlateEditorType,
  attributes: EditableAttributes
) {
  const editableNode = createEditableNode(attributes)

  Transforms.insertNodes(editor, editableNode)
  Transforms.move(editor)
}

export function insertParagraph(
  editor: Editor & ReactEditor,
  at: Path | Point,
  text = ''
) {
  Transforms.insertNodes(
    editor,
    {
      type: 'paragraph',
      children: [{ text }]
    },
    {
      at
    }
  )
}

export function insertTableBlock(editor: SlateEditorType) {
  if (!editor.selection) return

  const node = Editor.above(editor, {
    match: (n) => n.type === 'table'
  })

  const isCollapsed = Range.isCollapsed(editor.selection)

  if (!node && isCollapsed) {
    const table = createTable(3, 3)
    Transforms.insertNodes(editor, table)
  }
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

export function getMatchingNodesInSelection(
  node: SlateEditorType,
  match: (node: Node) => boolean = () => true
) {
  const generator = Editor.nodes(node, {
    match
  })

  return Array.from(generator).map((o) => o[0])
}

export function setConditionActive(
  editor: SlateEditorType,
  condition: EditableRefAttributes
) {
  Editor.addMark(editor, 'ref', condition)
  Transforms.setNodes(
    editor,
    { ref: condition },
    {
      match: (o) => Editor.isVoid(editor, o) && o.type === 'editable'
    }
  )
}

export function unsetConditionActive(editor: SlateEditorType) {
  Editor.removeMark(editor, 'ref')
  Transforms.unsetNodes(editor, 'ref', {
    match: (o) => Editor.isVoid(editor, o) && o.type === 'editable'
  })
}

export function checkTableIsExist(editor: Editor, table: NodeEntry) {
  const cells = Array.from(
    Editor.nodes(editor, {
      at: table[1],
      match: (n) => n.type === 'table-cell'
    })
  )

  return !!cells.length
}

export function isTableElement(type: string) {
  return (
    type === 'table' ||
    type === 'table-row' ||
    type === 'table-cell' ||
    type === 'table-content'
  )
}

export function isInSameTable(editor: Editor): boolean {
  if (!editor.selection) return false

  const [start, end] = Editor.edges(editor, editor.selection)
  const [startTable] = Editor.nodes(editor, {
    at: start,
    match: (n) => n.type === 'table'
  })

  const [endTable] = Editor.nodes(editor, {
    at: end,
    match: (n) => n.type === 'table'
  })

  if (startTable && endTable) {
    const [, startPath]: [any, Path] = startTable
    const [, endPath]: [any, Path] = endTable

    if (Path.equals(startPath, endPath)) {
      return true
    }
  }

  return false
}

export function createTableContent(elements?: Node[]): TableContent {
  return {
    type: 'table-content',
    children: elements || [{ type: 'paragraph', children: [{ text: '' }] }]
  }
}

export function createTableCell({
  elements,
  colspan,
  rowspan,
  height,
  width
}: {
  elements?: Node[]
  height?: number
  width?: number
  colspan?: number
  rowspan?: number
} = {}): TableCell {
  const content = createTableContent(elements)

  return {
    type: 'table-cell',
    key: `cell_${generateUUID()}`,
    children: [content],
    width: width,
    height: height,
    colspan,
    rowspan
  }
}

export function createTableRow(columns: number): TableRow {
  const cellNodes = [...new Array(columns)].map(() => createTableCell())

  return {
    type: 'table-row',
    key: `row_${generateUUID()}`,
    data: {},
    children: cellNodes
  }
}

export function createTable(columns: number, rows: number): Table {
  const rowNodes = [...new Array(rows)].map(() => createTableRow(columns))

  return {
    type: 'table',
    children: rowNodes,
    borderless: false,
    data: {}
  }
}
