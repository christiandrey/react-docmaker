import React, { useRef, useState } from 'react'
import classnames from 'classnames'
import 'tailwindcss/tailwind.css'
import Header from './modules/header'
import Toolbar from './modules/toolbar'

interface Props {
  className?: string
}

export const DocmakerEditor = ({ className }: Props) => {
  const createdAt = useRef(new Date().toISOString()).current

  const [title, setTitle] = useState('')

  return (
    <div className={classnames('font-sans', className)}>
      <Header title={title} createdAt={createdAt} onChangeTitle={setTitle} />
      <Toolbar />
    </div>
  )
}
