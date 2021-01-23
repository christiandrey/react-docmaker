import React, { FC } from 'react'

type TemplateEditorProps = {}

const TemplateEditor: FC<TemplateEditorProps> = ({ children }) => {
  return <div className='max-w-6xl m-auto pt-120 px-60'>{children}</div>
}

export default TemplateEditor
