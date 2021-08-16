import { Editor, NodeEntry, Path, Range, Transforms } from 'slate'
import { createTableContent, insertParagraph, isInSameTable } from '../tools'

import { ReactEditor } from 'slate-react'

export const PreserveSpaceAfter = new Set<any>(['table'])

export const PreserveSpaceBefore = new Set<any>(['table'])

const shouldPreserveSpace = (
  editor: Editor & ReactEditor,
  entry: NodeEntry
): boolean | void => {
  const [node, path] = entry
  const { type } = node
  let preserved = false

  if (PreserveSpaceAfter.has(type)) {
    const next = Editor.next(editor, { at: path })
    if (!next || PreserveSpaceBefore.has(next[0].type)) {
      insertParagraph(editor, Path.next(path))
      preserved = true
    }
  }

  if (PreserveSpaceBefore.has(type)) {
    if (path[path.length - 1] === 0) {
      insertParagraph(editor, path)
      preserved = true
    } else {
      const prev = Editor.previous(editor, { at: path })
      if (!prev || PreserveSpaceAfter.has(prev[0].type)) {
        insertParagraph(editor, path)
        preserved = true
      }
    }
  }

  return preserved
}

export const withTable = (editor: Editor & ReactEditor) => {
  const { addMark, removeMark, deleteBackward, deleteFragment } = editor

  editor.addMark = (key, value) => {
    if (editor.selection) {
      const lastSelection = editor.selection

      const selectedCells = Editor.nodes(editor, {
        match: (n) => n.selectedCell as any,
        at: []
      })

      let isTable = false

      for (const cell of selectedCells) {
        if (!isTable) {
          isTable = true
        }

        const [content] = Editor.nodes(editor, {
          match: (n) => n.type === 'table-content',
          at: cell[1]
        })

        if (Editor.string(editor, content[1]) !== '') {
          Transforms.setSelection(editor, Editor.range(editor, cell[1]))
          addMark(key, value)
        }
      }

      if (isTable) {
        Transforms.select(editor, lastSelection)
        return
      }
    }

    addMark(key, value)
  }

  editor.removeMark = (key) => {
    if (editor.selection) {
      const lastSelection = editor.selection
      const selectedCells = Editor.nodes(editor, {
        match: (n) => {
          return n.selectedCell as any
        },
        at: []
      })

      let isTable = false
      for (const cell of selectedCells) {
        if (!isTable) {
          isTable = true
        }

        const [content] = Editor.nodes(editor, {
          match: (n) => n.type === 'table-content',
          at: cell[1]
        })

        if (Editor.string(editor, content[1]) !== '') {
          Transforms.setSelection(editor, Editor.range(editor, cell[1]))
          removeMark(key)
        }
      }

      if (isTable) {
        Transforms.select(editor, lastSelection)
        return
      }
    }
    removeMark(key)
  }

  editor.deleteFragment = (...args) => {
    if (editor.selection && isInSameTable(editor)) {
      const selectedCells = Editor.nodes(editor, {
        match: (n) => {
          return n.selectedCell as any
        }
      })

      for (const cell of selectedCells) {
        Transforms.setSelection(editor, Editor.range(editor, cell[1]))

        const [content] = Editor.nodes(editor, {
          match: (n) => n.type === 'table-content'
        })

        Transforms.insertNodes(editor, createTableContent(), { at: content[1] })
        Transforms.removeNodes(editor, { at: Path.next(content[1]) })
      }

      return
    }

    Transforms.removeNodes(editor, {
      match: (n) => n.type === 'table'
    })

    deleteFragment(...args)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const isInTable = Editor.above(editor, {
        match: (n) => n.type === 'table'
      })

      if (isInTable) {
        const start = Editor.start(editor, selection)
        const isStart = Editor.isStart(editor, start, selection)

        const currCell = Editor.above(editor, {
          match: (n) => n.type === 'table-cell'
        })

        if (isStart && currCell && !Editor.string(editor, currCell[1])) {
          return
        }
      }
    }

    deleteBackward(...args)
  }

  return editor
}

export const withSchema = (editor: Editor & ReactEditor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = (entry) => {
    if (shouldPreserveSpace(editor, entry)) return

    normalizeNode(entry)
  }

  return withTable(editor)
}
