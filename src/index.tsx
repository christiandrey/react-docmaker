import React, { useMemo, useRef, useState } from 'react'
import classnames from 'classnames'
import 'tailwindcss/tailwind.css'
import Header from './modules/header'
import Toolbar from './modules/toolbar'
import TemplateEditor from './modules/template-editor'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor, Node } from 'slate'

interface Props {
  className?: string
}

export const DocmakerEditor = ({ className }: Props) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const createdAt = useRef(new Date().toISOString()).current

  const [title, setTitle] = useState('')
  const [editorState, setEditorState] = useState<Array<Node>>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text' }]
    }
  ])

  return (
    <div className={classnames('font-sans', className)}>
      <Slate editor={editor} value={editorState} onChange={setEditorState}>
        <div className='sticky top-0'>
          <Header
            title={title}
            createdAt={createdAt}
            onChangeTitle={setTitle}
          />
          <Toolbar />
        </div>
        <TemplateEditor>
          <Editable placeholder='Start typing...' />
        </TemplateEditor>
      </Slate>
    </div>
  )
}
