import { Editor, NodeEntry, Transforms } from 'slate'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { RenderElementProps, useSelected, useSlate } from 'slate-react'
import { addSelection, removeSelection } from '../../utils/selection'

import { HorizontalToolbar } from '../horizontal-toolbar'
import { VerticalToolbar } from '../vertical-toolbar'
import classnames from 'classnames'
import css from '../../style.module.css'
import { options } from '../../utils/options'

export const TableBody: React.FC<
  {
    table: NodeEntry | null
  } & RenderElementProps
> = (props) => {
  const { table, children, element } = props
  const editor = useSlate()
  const selected = useSelected()
  const ref = useRef<HTMLTableElement>(null)

  const resizeTable = useCallback(() => {
    if (ref.current) {
      ref.current.querySelectorAll('td').forEach((cell) => {
        Transforms.setNodes(
          editor,
          {
            width: cell.offsetWidth,
            height: cell.offsetHeight
          },
          {
            at: [],
            match: (n) => n.key === cell.dataset.key
          }
        )
      })
    }
  }, [editor])

  useEffect(() => {
    resizeTable()
  }, [resizeTable, selected, editor.selection])

  useEffect(() => {
    if (!selected) removeSelection(editor)
  }, [selected, editor])

  const [startKey, setStartKey] = useState<string>('')

  const startNode = useMemo(() => {
    const [node] = Editor.nodes(editor, {
      match: (n) => n.key === startKey,
      at: []
    })

    return node
  }, [startKey, editor])

  const ResizeToolbar = useMemo(() => {
    return (
      selected &&
      ref.current &&
      table && (
        <Fragment>
          <HorizontalToolbar table={ref.current} tableNode={table} />
          <VerticalToolbar table={ref.current} tableNode={table} />
        </Fragment>
      )
    )
  }, [selected, table])

  return (
    <Fragment>
      {ResizeToolbar}
      <table
        className={classnames(css.table, {
          [css.borderless]: !!element.borderless
        })}
        slate-table-element='table'
        ref={ref}
        style={options.tableStyle}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={(e) => {
          const cell = (e.target as HTMLBaseElement).closest('td')
          const key = cell?.getAttribute('data-key') || ''
          setStartKey(key)
        }}
        onMouseMove={(e) => {
          const cell = (e.target as HTMLBaseElement).closest('td')
          if (cell && startKey) {
            const endKey = cell.getAttribute('data-key')

            const [endNode] = Editor.nodes(editor, {
              match: (n) => n.key === endKey,
              at: []
            })

            addSelection(
              editor,
              table,
              Editor.path(editor, startNode[1]),
              Editor.path(editor, endNode[1])
            )
          }
        }}
        onMouseUp={() => {
          setStartKey('')
          resizeTable()
        }}
        onMouseLeave={() => {
          setStartKey('')
        }}
      >
        <tbody slate-table-element='tbody'>{children}</tbody>
      </table>
    </Fragment>
  )
}
