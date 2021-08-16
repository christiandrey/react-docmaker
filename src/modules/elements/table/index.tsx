import { Editor, NodeEntry } from 'slate'
import { RenderElementProps, useEditor, useSelected } from 'slate-react'

import React from 'react'
import { TableBody } from './modules/table-body'
import { TableCardbar } from './modules/table-cardbar'
import { TableCell } from './modules/table-cell'
import classnames from 'classnames'
import css from './style.module.css'

export const Table: React.FC<RenderElementProps> = (props) => {
  const { attributes, children, element } = props
  const selected = useSelected()
  const editor = useEditor()

  switch (element.type) {
    case 'table': {
      let existSelectedCell = false
      let table: NodeEntry | null = null

      if (selected && editor.selection) {
        ;[table] = Editor.nodes(editor, {
          match: (n) => n.type === 'table',
          at: Editor.path(editor, editor.selection)
        })

        if (table) {
          const [selectedCell] = Editor.nodes(editor, {
            at: Editor.range(editor, table[1]),
            match: (n) => n.selectedCell as any
          })

          if (selectedCell) {
            existSelectedCell = true
          }
        }
      }

      return (
        <div style={{ position: 'relative' }}>
          <TableCardbar
            className={classnames({ selected: selected || existSelectedCell })}
          />
          <TableBody {...props} table={table}>
            {children}
          </TableBody>
        </div>
      )
    }

    case 'table-row': {
      return (
        <tr
          {...attributes}
          className={css['table-tr']}
          slate-table-element='tr'
          data-key={element.key}
          onDrag={(e) => e.preventDefault()}
        >
          {children}
        </tr>
      )
    }

    case 'table-cell': {
      return (
        <TableCell
          {...props}
          dataKey={element.key as any}
          node={children.props.node}
        >
          {children}
        </TableCell>
      )
    }

    case 'table-content': {
      return (
        <div slate-table-element='content' className={css['table-content']}>
          {children}
        </div>
      )
    }

    default:
      return <p {...props} />
  }
}
