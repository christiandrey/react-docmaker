import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  KeyboardEvent
} from 'react'
import classnames from 'classnames'
import 'tailwindcss/tailwind.css'
import Header from './modules/header'
import Toolbar from './modules/toolbar'
import TemplateEditor from './modules/template-editor'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor, Node } from 'slate'
import { stripHTMLEntities } from './core/utils'
import { withHTML } from './core/plugins/paste-html'
import TemplateElement from './modules/template-element'
import TemplateLeaf from './modules/template-leaf'
import { HOT_KEYS } from './core/constants'
import isHotkey from 'is-hotkey'
import { SlateEditorType, toggleMarkActive } from './core/tools'

interface Props {
  className?: string
}

export const DocmakerEditor = ({ className }: Props) => {
  const editor = useMemo(
    () => withHTML(withReact(withHistory(createEditor()))),
    []
  )
  const createdAt = useRef(new Date().toISOString()).current

  const [title, setTitle] = useState('')
  const [editorState, setEditorState] = useState<Array<Node>>([
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ])

  const renderElement = useCallback(
    (props) => <TemplateElement {...props} />,
    []
  )

  const renderLeaf = useCallback((props) => <TemplateLeaf {...props} />, [])

  const handleEditorKeydown = useCallback(
    (event: KeyboardEvent) => {
      for (const hotkey in HOT_KEYS) {
        if (isHotkey(hotkey, event as any)) {
          event.preventDefault()
          const mark = HOT_KEYS[hotkey]
          toggleMarkActive(editor as SlateEditorType, mark)
        }
      }
    },
    [editor]
  )

  const handlePressSave = useCallback(() => {
    console.log({
      title: stripHTMLEntities(title),
      createdAt,
      template: editorState
    })
  }, [title, createdAt, editorState])

  return (
    <div className={classnames('font-sans', className)}>
      <Slate editor={editor} value={editorState} onChange={setEditorState}>
        <div className='sticky top-0'>
          <Header
            title={title}
            createdAt={createdAt}
            onChangeTitle={setTitle}
            onPressSave={handlePressSave}
          />
          <Toolbar />
        </div>
        <TemplateEditor>
          <Editable
            spellCheck
            placeholder='Start typing...'
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={handleEditorKeydown}
          />
        </TemplateEditor>
      </Slate>
    </div>
  )
}
