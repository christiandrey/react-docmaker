import { NodeEntry, Transforms } from 'slate'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import css from '../../style.module.css'
import { options } from '../../utils/options'
import { splittedTable } from '../../utils/selection'
import { useEditor } from 'slate-react'

let startFromX = 0

export const HorizontalToolbar: React.FC<{
  table: HTMLElement
  tableNode: NodeEntry
}> = ({ table, tableNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const editor = useEditor()
  const [cols, setCols] = useState<{ width: number; el: HTMLElement[] }[]>([])
  const widthFnObject = useRef({}).current

  useEffect(() => {
    const { gridTable = [] } = splittedTable(editor, tableNode)
    if (!gridTable.length) return

    const colsArray = [] as { width: number; el: HTMLElement[] }[]
    for (let i = 0; i < gridTable[0].length; i++) {
      for (let j = 0; j < gridTable.length; j++) {
        const currCol = gridTable[j][i]
        if (!currCol) continue

        const td = table.querySelector(
          `[data-key=${currCol.cell.key}]`
        ) as HTMLElement

        if (!td) continue

        if (!colsArray[i]) {
          colsArray[i] = {
            width: 0,
            el: []
          }
        }

        colsArray[i].width = !colsArray[i].width
          ? td.offsetWidth + td.offsetLeft
          : Math.min(colsArray[i].width, td.offsetWidth + td.offsetLeft)

        if (
          colsArray[i].el.findIndex(
            ({ dataset }) => dataset.key === td.dataset.key
          ) < 0
        ) {
          colsArray[i].el.push(td)
        }
      }
    }

    for (let i = 1; i < colsArray.length; i++) {
      const leftSumWidth = colsArray
        .slice(0, i)
        .reduce((p, c) => p + c.width, 0)
      colsArray[i].width = colsArray[i].width - leftSumWidth
    }
    setCols(colsArray.filter((item) => item.width))
  }, [editor, table, tableNode])

  const maxWidth = useMemo(() => table.closest('div')?.offsetWidth, [table])

  const onHandleDrag = useCallback(
    ({ item, index }) => {
      if (widthFnObject[index]) {
        return widthFnObject[index]
      }

      const fn = function (e: React.MouseEvent) {
        const changedWidth = e.clientX - startFromX

        if (!changedWidth || !e.clientX) {
          return
        }

        const tableWidthAfterChanged = table.offsetWidth + changedWidth

        if (item.el && maxWidth && tableWidthAfterChanged < maxWidth) {
          const dragger = ref.current?.querySelector(
            `#horizontal-dragger-item-${index}`
          ) as HTMLElement

          if (!dragger) return
          const draggerWidth = dragger.offsetWidth

          if (draggerWidth + changedWidth > options.defaultWidth) {
            dragger.style.width = `${draggerWidth + changedWidth}px`
          }

          const savedChangedWidth = []
          let moreThanMinWidth = true
          for (const cell of item.el) {
            if (cell.offsetWidth + changedWidth <= options.defaultWidth) {
              moreThanMinWidth = false
              break
            }
            savedChangedWidth.push({
              target: cell,
              width: cell.offsetWidth + changedWidth
            })
          }

          if (moreThanMinWidth) {
            savedChangedWidth.forEach((item) => {
              item.target.style.width = `${item.width}px`
            })
          }
        }

        startFromX = e.clientX
      }

      widthFnObject[index] = fn
      return widthFnObject[index]
    },
    [maxWidth, table, widthFnObject]
  )

  const onHandleDragEnd = useCallback(
    (item: { width: number; el: HTMLElement[] }, index: number) => () => {
      if (item.el) {
        for (const cell of item.el) {
          Transforms.setNodes(
            editor,
            {
              width: cell.offsetWidth
            },
            {
              at: tableNode[1],
              match: (n) => n.key === cell.dataset.key
            }
          )
        }

        const dragger = ref.current?.querySelector(
          `#horizontal-dragger-item-${index}`
        ) as HTMLElement
        const draggerWidth = dragger.offsetWidth

        const newCols = Array.from(cols)
        newCols[index] = {
          width: draggerWidth,
          el: item.el
        }

        setCols(() => newCols)
      }
    },
    [cols, editor, tableNode]
  )

  return (
    <div
      contentEditable={false}
      className={css['table-horizontal-toolbar']}
      ref={ref}
    >
      {cols.map((item, index) => (
        <div
          key={index}
          className={css['table-dragger-item']}
          style={{ width: `${item.width}px` }}
          id={`horizontal-dragger-item-${index}`}
        >
          <div
            className={css['table-trigger']}
            draggable
            onMouseDown={(e) => {
              startFromX = e.clientX
              document.body.addEventListener(
                'dragover',
                onHandleDrag({ item, index }),
                false
              )
            }}
            onDragEnd={() => {
              document.body.removeEventListener(
                'dragover',
                onHandleDrag({ item, index })
              )
              onHandleDragEnd(item, index)
            }}
          />
        </div>
      ))}
    </div>
  )
}
