import 'tailwindcss/tailwind.css'

import { DocmakerData, SlateEditorType, toggleMarkActive } from './core/tools'
import { Editable, Slate, withReact } from 'slate-react'
import { Node, createEditor } from 'slate'
import React, {
  KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react'
import { stripHTMLEntities, toDate } from './core/utils'

import { HOT_KEYS } from './core/constants'
import Header from './modules/header'
import OrphanNodesContext from './core/contexts/orphan-nodes'
import TemplateEditor from './modules/template-editor'
import TemplateElement from './modules/template-element'
import TemplateLeaf from './modules/template-leaf'
import Toolbar from './modules/toolbar'
import classnames from 'classnames'
import isHotkey from 'is-hotkey'
import { jsx } from 'slate-hyperscript'
import { withDocxDeserializer } from 'slate-docx-deserializer'
import { withEditable } from './core/plugins/editable'
import { withHistory } from 'slate-history'

interface Props {
  className?: string
  initialValue?: DocmakerData
  onSubmitChanges?: (data: DocmakerData) => void
}

export const DocmakerEditor = ({
  className,
  initialValue,
  onSubmitChanges
}: Props) => {
  const initialData = useRef(initialValue || ({} as DocmakerData)).current
  const editor = useMemo(
    () =>
      withDocxDeserializer(
        withEditable(withReact(withHistory(createEditor()))),
        jsx
      ),
    []
  )
  const createdAt = useRef(toDate(initialData.createdAt).toISOString()).current

  const [title, setTitle] = useState(initialData.title || '')
  const [orphanNodes, setOrphanNodes] = useState<Array<Node>>(
    initialData.orphans || []
  )
  const [editorState, setEditorState] = useState<Array<Node>>(
    initialData.nodes?.length
      ? initialData.nodes
      : [
          {
            type: 'paragraph',
            children: [{ text: '' }]
          }
        ]
  )

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
    onSubmitChanges?.({
      title: stripHTMLEntities(title),
      createdAt,
      nodes: editorState as any,
      orphans: orphanNodes as any
    })
  }, [onSubmitChanges, title, createdAt, editorState, orphanNodes])

  return (
    <div className={classnames('font-sans', className)}>
      <OrphanNodesContext.Provider value={[orphanNodes, setOrphanNodes]}>
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
      </OrphanNodesContext.Provider>
    </div>
  )
}
