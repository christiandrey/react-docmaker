import React from 'react'
import { RenderElementProps } from 'slate-react'
import classnames from 'classnames'
import css from '../../style.module.css'

export const TableCell: React.FC<
  {
    node: {
      width: number
      height: number
      selectedCell?: boolean
      colspan?: number
      rowspan?: number
    }
    dataKey: string
  } & RenderElementProps
> = ({ attributes, node, dataKey, children }) => {
  const { selectedCell } = node

  return (
    <td
      {...attributes}
      className={classnames(css['table-td'], {
        [css.selectedCell]: selectedCell
      })}
      slate-table-element='td'
      data-key={dataKey}
      colSpan={node.colspan}
      rowSpan={node.rowspan}
      onDragStart={(e) => e.preventDefault()}
      style={{
        position: 'relative',
        minWidth: '50px',
        width: node.width ? `${node.width}px` : 'auto',
        height: node.width ? `${node.height}px` : 'auto'
      }}
    >
      {children}
    </td>
  )
}
