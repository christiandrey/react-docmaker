import { Editor, Element as SlateElement } from 'slate'
import { ReactEditor } from 'slate-react'

export const withEditable = (editor: Editor & ReactEditor) => {
  const { isInline, isVoid } = editor

  editor.isInline = (element: SlateElement) => {
    return element.type === 'editable' ? true : isInline(element)
  }

  editor.isVoid = (element: SlateElement) => {
    return element.type === 'editable' ? true : isVoid(element)
  }

  return editor
}
