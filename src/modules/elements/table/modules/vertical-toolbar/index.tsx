import { NodeEntry, Transforms } from 'slate'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import css from '../../style.module.css'
import { options } from '../../utils/options'
import { splittedTable } from '../../utils/selection'
import { useEditor } from 'slate-react'

let startFromY = 0

export const VerticalToolbar: React.FC<{
  table: HTMLElement
  tableNode: NodeEntry
}> = ({ table, tableNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useEditor()
  const [rows, setRows] = useState<{ height: number; el: HTMLElement[] }[]>([])
  const heightFnObject = useRef({}).current

  useEffect(() => {
    const { gridTable = [] } = splittedTable(editor, tableNode)
    if (!gridTable.length) return

    const rowsArray = [] as { height: number; el: HTMLElement[] }[]

    for (let i = 0; i < gridTable.length; i++) {
      for (let j = 0; j < gridTable[i].length; j++) {
        const currCell = gridTable[i][j]
        const td = table.querySelector(
          `[data-key=${currCell.cell.key}]`
        ) as HTMLElement

        if (!td) continue

        if (!rowsArray[i]) {
          rowsArray[i] = {
            height: 0,
            el: []
          }
        }

        if (currCell.isReal) {
          rowsArray[i].height = !rowsArray[i].height
            ? td.offsetHeight
            : Math.min(rowsArray[i].height, td.offsetHeight)
        }

        if (
          rowsArray[i].el.findIndex(
            ({ dataset }) => dataset.key === td.dataset.key
          ) < 0
        ) {
          rowsArray[i].el.push(td)
        }
      }
    }

    setRows(() => rowsArray)
  }, [editor, table, tableNode])

  const onHandleDrag = useCallback(
    ({ item, index }) => {
      if (heightFnObject[index]) {
        return heightFnObject[index]
      }

      const fn = function (e: React.MouseEvent | MouseEvent) {
        const changedHeight = e.clientY - startFromY

        if (!changedHeight || !e.clientY) {
          return
        }

        if (item.el) {
          const minHeight = options.defaultHeight

          const dragger = ref.current?.querySelector(
            `#vertical-dragger-item-${index}`
          ) as HTMLElement

          if (!dragger) return
          const draggerHeight = dragger.offsetHeight

          if (draggerHeight + changedHeight > minHeight) {
            dragger.style.height = `${draggerHeight + changedHeight}px`
          }

          const savedChangedHeight = []
          let moreThanMinHeight = true
          for (const cell of item.el) {
            if (cell.offsetHeight + changedHeight < minHeight) {
              moreThanMinHeight = false
              break
            }

            savedChangedHeight.push({
              td: cell,
              height: cell.offsetHeight + changedHeight
            })
          }

          if (moreThanMinHeight) {
            savedChangedHeight.forEach((item) => {
              item.td.style.height = `${item.height}px`
            })
          }
        }

        startFromY = e.clientY
      }

      heightFnObject[index] = fn

      return heightFnObject[index]
    },
    [heightFnObject]
  )

  const onHandleDragEnd = useCallback(
    (item: { height: number; el: HTMLElement[] }, index: number) => {
      if (item.el) {
        for (const cell of item.el) {
          Transforms.setNodes(
            editor,
            {
              height: cell.offsetHeight
            },
            {
              at: tableNode[1],
              match: (n) => n.key === cell.dataset.key
            }
          )
        }

        const dragger = ref.current?.querySelector(
          `#vertical-dragger-item-${index}`
        ) as HTMLElement

        const draggerHeight = dragger.offsetHeight

        const newRows = Array.from(rows)
        newRows[index] = {
          height: draggerHeight,
          el: item.el
        }

        setRows(() => newRows)
      }
    },
    [rows, editor, tableNode]
  )

  return (
    <div
      contentEditable={false}
      className={css['table-vertical-toolbar']}
      ref={ref}
    >
      {rows.map((item, index) => (
        <div
          key={index}
          className={css['table-dragger-item']}
          style={{ height: `${item.height}px` }}
          id={`vertical-dragger-item-${index}`}
        >
          <div
            className={css['table-trigger']}
            draggable
            onMouseDown={(e) => {
              startFromY = e.clientY
              document.body.addEventListener(
                'dragover',
                onHandleDrag({ item, index }),
                false
              )
            }}
            onDragEnd={() => {
              document.body.removeEventListener(
                'dragover',
                onHandleDrag({ item, index }),
                false
              )

              onHandleDragEnd(item, index)
            }}
          />
        </div>
      ))}
    </div>
  )
}
