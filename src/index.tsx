import * as React from 'react'
import classnames from 'classnames'
import 'tailwindcss/tailwind.css'

interface Props {
  className?: string
}

export const DocmakerEditor = ({ className }: Props) => {
  return (
    <div className={classnames('font-sans bg-blue-500', className)}>
      Example Component goes here
    </div>
  )
}
