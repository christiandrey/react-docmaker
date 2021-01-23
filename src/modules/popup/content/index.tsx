import classnames from 'classnames'
import React, { useLayoutEffect, useState } from 'react'

import css from './style.module.css'

export type ContentDimensions = {
  width?: number
  height?: number
  x?: number
  y?: number
}

type ContentProps = {
  onLayoutUpdate: (dimensions: ContentDimensions) => void
  x?: number
  y?: number
  hideArrow?: boolean
  position?: string
  alignment?: string
  className?: string
}

const Content: React.FC<ContentProps> = ({
  onLayoutUpdate,
  children,
  x,
  y,
  position,
  alignment,
  className,
  hideArrow
}) => {
  const [dimensions, setDimensions] = useState<ContentDimensions>({ x, y })

  useLayoutEffect(() => {
    const element = document.querySelector(`.${css.container}`)
    const { width, height, x, y } = element.getBoundingClientRect()
    const computedDimensions: ContentDimensions = { width, height, x, y }

    if (JSON.stringify(computedDimensions) !== JSON.stringify(dimensions)) {
      setDimensions(computedDimensions)
      onLayoutUpdate(computedDimensions)
    }
  }, [dimensions, onLayoutUpdate])

  let composedClassName = css.container
  const arrowClassName = ` ${css.arrow} ${css[`arrow${position}`]} ${
    css[`arrow${alignment}`]
  }`

  if (!hideArrow) composedClassName += arrowClassName

  return (
    <div
      className={classnames(composedClassName, 'shadow-6', className)}
      style={{ top: y, left: x }}
    >
      {children}
    </div>
  )
}

Content.defaultProps = {
  x: 0,
  y: 0
}

export default Content
