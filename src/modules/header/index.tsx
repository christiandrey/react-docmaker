import React, { FC, useRef } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import Button from '../button'
import classnames from 'classnames'
import css from './style.module.css'
import { fromNow, toCapitalizedFirst } from '../../core/utils'

type HeaderProps = {
  title?: string
  createdAt?: string
  onChangeTitle?: (value: string) => void
  onPressSave?: Fn
}

const Header: FC<HeaderProps> = ({
  title,
  createdAt,
  onChangeTitle,
  onPressSave
}) => {
  const editorRef = useRef(null)
  const state = useRef(title)

  const handleBlur = () => {
    console.log('s', state.current)
    onChangeTitle?.(state.current)
  }

  const handleChange = (event: ContentEditableEvent) => {
    const value = event.target.value
    state.current = value

    if (value === '<br>') {
      editorRef.current.innerHTML = ''
    }
  }

  return (
    <div className='bg-white py-18 px-60 flex items-center justify-between'>
      <div>
        <ContentEditable
          innerRef={editorRef}
          className={classnames(
            css.container,
            'text-heading-2 font-medium mb-4'
          )}
          placeholder='Untitled document'
          html={state.current}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {createdAt && (
          <div className='font-medium text-gray-400 text-subhead'>
            {toCapitalizedFirst(fromNow(createdAt))}
          </div>
        )}
      </div>
      <Button disabled={!state.current?.length} onPress={onPressSave}>
        Save changes
      </Button>
    </div>
  )
}

export default Header
