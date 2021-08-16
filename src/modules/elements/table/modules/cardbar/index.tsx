import React, { HTMLAttributes } from 'react'

import { AiOutlineDelete } from '@react-icons/all-files/ai/AiOutlineDelete'
import IconButton from '../../../../icon-button'
import IconGroup from '../../../../icon-group'
import classnames from 'classnames'
import css from './style.module.css'

interface CardbarProps extends HTMLAttributes<HTMLDivElement> {
  delete?: () => void
}

const exec = (func: Function, ...args: any[]) => (e?: React.MouseEvent) => {
  e && e.preventDefault()
  return func(...args)
}

export const Cardbar: React.FC<CardbarProps> = (props) => {
  return (
    <div className={classnames(css.cardbar, props.className)}>
      <IconGroup className='px-0 text-gray-500 bg-blue-50 rounded-default'>
        {props.children}
        {props.delete && (
          <IconButton onPress={exec(props.delete)} tip='Delete table'>
            <AiOutlineDelete />
          </IconButton>
        )}
      </IconGroup>
    </div>
  )
}
