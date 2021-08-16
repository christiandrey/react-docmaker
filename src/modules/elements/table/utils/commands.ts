/* eslint-disable no-useless-return */
import { Col, splittedTable } from './selection'
import { Editor, NodeEntry, Path, Transforms } from 'slate'
import {
  TableCell,
  createTableCell,
  createTableRow
} from '../../../../core/tools'

export function splitCell(table: NodeEntry, editor: Editor) {
  const { selection } = editor
  if (!selection || !table) return

  const yIndex = table[1].length
  const xIndex = table[1].length + 1

  const { getCol } = splittedTable(editor, table)

  const [start, end] = Editor.edges(editor, selection)
  const [startNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: start
  })

  const [endNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: end
  })

  if (!startNode || !endNode) return

  const [startCell] = getCol((n: Col) => n.cell.key === startNode[0].key)
  const [endCell] = getCol((n: Col) => n.cell.key === endNode[0].key)

  const [yStart, yEnd] = [startCell.path[yIndex], endCell.path[yIndex]]
  const [xStart, xEnd] = [startCell.path[xIndex], endCell.path[xIndex]]

  const sourceCells = [] as Col[]
  const selectedCols = getCol((n: Col) => {
    if (n.cell.selectedCell) {
      return true
    }

    const [y, x] = n.path.slice(yIndex, xIndex + 1)
    if (y >= yStart && y <= yEnd && x >= xStart && x <= xEnd) {
      if (!n.isReal) {
        const [sourceCell] = getCol(
          (s: Col) => s.isReal && s.cell.key === n.cell.key
        )
        sourceCells.push(sourceCell)
      }
      return true
    }

    return false
  })

  selectedCols.push(...sourceCells)

  const filterColsObject = selectedCols.reduce(
    (p: { [key: string]: Col }, c: Col) => {
      if (c.isReal) {
        p[c.cell.key] = c
      }
      return p
    },
    {}
  ) as { [key: string]: Col }

  Object.values(filterColsObject).forEach((col: Col) => {
    const { cell, isReal, originPath } = col
    const { rowspan = 1, colspan = 1, children } = cell

    if (isReal && (rowspan !== 1 || colspan !== 1)) {
      Transforms.delete(editor, {
        at: originPath
      })

      for (let i = 0; i < rowspan; i++) {
        for (let j = 0; j < colspan; j++) {
          const newPath = Array.from(originPath)
          newPath[yIndex] += i

          const newCell = createTableCell({
            width: 0,
            height: 0,
            elements:
              i === 0 && j === colspan - 1
                ? (children[0].children as any)
                : null
          })

          Transforms.insertNodes(editor, newCell, {
            at: newPath
          })
        }
      }
    }
  })
}

export function insertAbove(table: NodeEntry, editor: Editor) {
  const { selection } = editor
  if (!selection || !table) return

  const yIndex = table[1].length

  const { gridTable, getCol } = splittedTable(editor, table)

  const [startCell] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell'
  })

  const [insertPositionCol] = getCol(
    (c: Col) => c.cell.key === startCell[0].key && c.isReal
  )

  let checkInsertEnable = true
  const insertYIndex = insertPositionCol.path[yIndex]
  const insertCols = new Map<string, Col>()

  gridTable[insertYIndex].forEach((col: Col) => {
    if (!col.isReal) {
      const [originCol] = getCol(
        (c: Col) => c.isReal && c.cell.key === col.cell.key
      )

      if (originCol.path[yIndex] === insertYIndex) {
        insertCols.set(originCol.cell.key, originCol)
      } else {
        checkInsertEnable = false
        return
      }
    } else {
      insertCols.set(col.cell.key, col)
    }
  })

  if (!checkInsertEnable) {
    return
  }

  const newRow = createTableRow(insertCols.size)

  ;[...insertCols.values()].forEach((col, index) => {
    newRow.children[index].colspan = col.cell.colspan || 1
  })

  const [[, path]] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-row'
  })

  Transforms.insertNodes(editor, newRow, {
    at: path
  })
}

export function insertBelow(table: NodeEntry, editor: Editor) {
  const { selection } = editor
  if (!selection || !table) return

  const yIndex = table[1].length

  const { gridTable, getCol } = splittedTable(editor, table)

  const [startCell] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell'
  })

  const [insertPositionCol] = getCol(
    (c: Col) => c.cell.key === startCell[0].key && c.isReal
  )

  let checkInsertEnable = true
  const insertCols = new Map<string, Col>()

  const y =
    insertPositionCol.path[yIndex] + (insertPositionCol.cell.rowspan || 1) - 1

  gridTable[y].forEach((col: Col) => {
    const [originCol] = getCol(
      (n: any) => n.isReal && n.cell.key === col.cell.key
    )

    const { cell, path } = originCol

    if (!gridTable[y + 1]) {
      insertCols.set(cell.key, originCol)
    } else if (path[yIndex] + (cell.rowspan || 1) - 1 === y) {
      insertCols.set(cell.key, originCol)
    } else {
      checkInsertEnable = false
      return
    }
  })

  if (!checkInsertEnable) {
    return
  }

  const newRow = createTableRow(insertCols.size)

  ;[...insertCols.values()].forEach((value, index) => {
    newRow.children[index].colspan = value.cell.colspan || 1
  })

  const [[, path]] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-row'
  })

  for (let i = 1; i < startCell[0].rowspan; i++) {
    path[yIndex] += 1
  }

  Transforms.insertNodes(editor, newRow, {
    at: Path.next(path)
  })
}

export function insertLeft(table: NodeEntry, editor: Editor) {
  const { selection } = editor
  if (!selection || !table) return

  const xIndex = table[1].length + 1

  const { gridTable, getCol } = splittedTable(editor, table)

  const [startCell] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell'
  })

  const [insertPositionCol] = getCol(
    (c: Col) => c.cell.key === startCell[0].key && c.isReal
  )

  const x = insertPositionCol.path[xIndex]

  const insertCols = new Map<string, Col>()
  let checkInsertable = true

  gridTable.forEach((row: Col[]) => {
    const col = row[x]

    if (col.isReal) {
      insertCols.set(col.cell.key, col)
    } else {
      const [originCol] = getCol(
        (n: Col) => n.cell.key === col.cell.key && n.isReal
      )
      const { cell, path } = originCol

      if (path[xIndex] === x) {
        insertCols.set(cell.key, originCol)
      } else {
        checkInsertable = false
        return
      }
    }
  })

  if (!checkInsertable) {
    return
  }

  insertCols.forEach((col: Col) => {
    const newCell = createTableCell({
      rowspan: col.cell.rowspan || 1
    })

    Transforms.insertNodes(editor, newCell, {
      at: col.originPath
    })
  })
}

export function insertRight(table: NodeEntry, editor: Editor) {
  const { selection } = editor
  if (!selection || !table) return

  const xIndex = table[1].length + 1

  const { gridTable, getCol } = splittedTable(editor, table)

  const [startCell] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell'
  })

  const [insertPositionCol] = getCol(
    (c: Col) => c.cell.key === startCell[0].key && c.isReal
  )

  const x =
    insertPositionCol.path[xIndex] + (insertPositionCol.cell.colspan || 1) - 1

  const insertCols = new Map<string, Col>()
  let checkInsertable = true

  gridTable.forEach((row: Col[]) => {
    const col = row[x]

    const [originCol] = getCol(
      (n: Col) => n.cell.key === col.cell.key && n.isReal
    )

    const { cell, path } = originCol

    if (
      !row[x + 1] ||
      (col.isReal && (!col.cell.colspan || col.cell.colspan === 1))
    ) {
      insertCols.set(cell.key, originCol)
    } else {
      if (path[xIndex] + (cell.colspan || 1) - 1 === x) {
        insertCols.set(cell.key, originCol)
      } else {
        checkInsertable = false
        return
      }
    }
  })

  if (!checkInsertable) {
    return
  }

  insertCols.forEach((col: Col) => {
    const newCell = createTableCell({
      rowspan: col.cell.rowspan || 1
    })

    Transforms.insertNodes(editor, newCell, {
      at: Path.next(col.originPath)
    })
  })
}

export function mergeSelection(table: NodeEntry, editor: Editor) {
  if (!table || !editor.selection) return

  const startPoint = Editor.start(editor, editor.selection)
  const [startCell] = Editor.nodes(editor, {
    match: (n) => n.selectedCell as any,
    at: startPoint
  })

  if (!startCell) return

  const { gridTable } = splittedTable(editor, table, startCell[0].key as any)

  const selectedTable = checkMerge(gridTable)
  if (!selectedTable) return

  const insertPositionCol = selectedTable[0][0]
  const tmpContent: { [key: string]: Node[] } = {}

  gridTable.forEach((row: Col[]) => {
    row.forEach((col: Col) => {
      if (
        col.cell.selectedCell &&
        col.cell.key !== insertPositionCol.cell.key &&
        col.isReal
      ) {
        const [node] = Editor.nodes(editor, {
          match: (n) => n.key === col.cell.key,
          at: []
        })

        if (node) {
          if (Editor.string(editor, node[1])) {
            tmpContent[col.cell.key] = node[0].children as any
          }

          Transforms.removeNodes(editor, {
            at: table[1],
            match: (n) => n.key === col.cell.key
          })
        }
      }
    })
  })

  Transforms.setNodes(
    editor,
    {
      height: 0,
      width: 0,
      colspan: selectedTable[0].length,
      rowspan: selectedTable.length
    },
    {
      at: table[1],
      match: (n) => n.key === insertPositionCol.cell.key
    }
  )

  Transforms.removeNodes(editor, {
    at: table[1],
    match: (n) => {
      if (n.type !== 'table-row') {
        return false
      }

      if (
        !n.children ||
        (n.children as any).findIndex(
          (cell: TableCell) => cell.type === 'table-cell'
        ) < 0
      ) {
        return true
      }

      return false
    }
  })

  const rows = Editor.nodes(editor, {
    at: table[1],
    match: (n) => n.type === 'table-row'
  })

  for (const row of rows) {
    let minRowHeight = Infinity
    ;(row[0].children as any).forEach((cell: TableCell) => {
      const { rowspan = 1 } = cell
      if (rowspan < minRowHeight) {
        minRowHeight = rowspan
      }
    })

    if (minRowHeight > 1 && minRowHeight < Infinity) {
      ;(row[0].children as any).forEach((cell: TableCell) => {
        Transforms.setNodes(
          editor,
          {
            height: 0,
            width: 0,
            rowspan: (cell.rowspan || 1) - minRowHeight + 1
          },
          {
            at: table[1],
            match: (n) => n.key === cell.key
          }
        )
      })
    }
  }

  const { gridTable: mergedGridTable } = splittedTable(editor, table)
  for (let idx = 0; idx < mergedGridTable[0].length; idx++) {
    let allColumnIsReal = true
    let minColWidth = Infinity

    for (let j = 0; j < mergedGridTable.length; j++) {
      if (!mergedGridTable[j][idx]) continue

      if (!mergedGridTable[j][idx].isReal) {
        allColumnIsReal = false
      } else {
        const { colspan = 1 } = mergedGridTable[j][idx].cell
        if (colspan < minColWidth) {
          minColWidth = colspan
        }
      }
    }

    if (allColumnIsReal && minColWidth < Infinity && minColWidth > 1) {
      for (let j = 0; j < mergedGridTable.length; j++) {
        const { cell } = mergedGridTable[j][idx]
        Transforms.setNodes(
          editor,
          {
            height: 0,
            width: 0,
            colspan: (cell.colspan || 1) - minColWidth + 1
          },
          {
            at: table[1],
            match: (n) => n.key === cell.key
          }
        )
      }
    }
  }

  const [insertContents] = Editor.nodes(editor, {
    at: insertPositionCol.originPath,
    match: (n) => n.type === 'table-content'
  })

  Object.values(tmpContent).forEach((content) => {
    if (content[0] && (content[0] as any).children) {
      Transforms.insertNodes(editor, (content[0] as any).children, {
        at: Editor.end(editor, insertContents[1])
      })
    }
  })
}

export function removeColumn(table: NodeEntry, editor: Editor) {
  const { selection } = editor
  if (!selection || !table) return

  const { gridTable, getCol } = splittedTable(editor, table)
  const xIndex = table[1].length + 1

  const [start, end] = Editor.edges(editor, selection)
  const [startNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: start
  })

  const [endNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: end
  })

  const [startCol] = getCol((col: Col) => col.cell.key === startNode[0].key)
  const [endCol] = getCol((col: Col) => col.cell.key === endNode[0].key)

  const xLeft = startCol.path[xIndex]
  const xRight = endCol.path[xIndex]

  const topLeftCol = gridTable[0][xLeft]
  const bottomRight = gridTable[gridTable.length - 1][xRight]

  Transforms.setSelection(editor, {
    anchor: Editor.point(editor, topLeftCol.originPath),
    focus: Editor.point(editor, bottomRight.originPath)
  })

  splitCell(table, editor)

  const { gridTable: splitedGridTable } = splittedTable(editor, table)

  const removedCells = splitedGridTable.reduce((p: Col[], c: Col[]) => {
    const cells = c.slice(xLeft, xRight + 1)
    return [...p, ...cells]
  }, []) as Col[]

  removedCells.forEach((cell: { cell: { key: any } }) => {
    Transforms.removeNodes(editor, {
      at: table[1],
      match: (n) => n.key === cell.cell.key
    })
  })

  Transforms.removeNodes(editor, {
    at: table[1],
    match: (n) => {
      if (n.type !== 'table-row') {
        return false
      }

      if (
        !n.children ||
        (n.children as any).findIndex(
          (cell: TableCell) => cell.type === 'table-cell'
        ) < 0
      ) {
        return true
      }

      return false
    }
  })

  const rows = Editor.nodes(editor, {
    at: table[1],
    match: (n) => n.type === 'table-row'
  })

  for (const row of rows) {
    let minRowHeight = Infinity
    ;(row[0].children as any).forEach((cell: TableCell) => {
      const { rowspan = 1 } = cell
      if (rowspan < minRowHeight) {
        minRowHeight = rowspan
      }
    })

    if (minRowHeight > 1 && minRowHeight < Infinity) {
      ;(row[0].children as any).forEach((cell: TableCell) => {
        Transforms.setNodes(
          editor,
          {
            rowspan: (cell.rowspan || 1) - minRowHeight + 1
          },
          {
            at: table[1],
            match: (n) => n.key === cell.key
          }
        )
      })
    }
  }

  const { gridTable: removedGridTable } = splittedTable(editor, table)

  if (!removedGridTable.length) {
    const contentAfterRemove = Editor.string(editor, table[1])

    if (!contentAfterRemove) {
      Transforms.removeNodes(editor, {
        at: table[1]
      })
    }

    return
  }

  for (let idx = 0; idx < removedGridTable[0].length; idx++) {
    let allColumnIsReal = true
    let minColWidth = Infinity

    for (let j = 0; j < removedGridTable.length; j++) {
      if (!removedGridTable[j][idx].isReal) {
        allColumnIsReal = false
      } else {
        const { colspan = 1 } = removedGridTable[j][idx].cell
        if (colspan < minColWidth) {
          minColWidth = colspan
        }
      }
    }

    if (allColumnIsReal && minColWidth < Infinity && minColWidth > 1) {
      for (let j = 0; j < removedGridTable.length; j++) {
        const { cell } = removedGridTable[j][idx]
        Transforms.setNodes(
          editor,
          {
            colspan: (cell.colspan || 1) - minColWidth + 1
          },
          {
            at: table[1],
            match: (n) => n.key === cell.key
          }
        )
      }
    }
  }
}

export function removeRow(table: NodeEntry, editor: Editor) {
  const { selection } = editor
  if (!selection || !table) return

  const { gridTable, getCol } = splittedTable(editor, table)

  const yIndex = table[1].length

  const [start, end] = Editor.edges(editor, selection)
  const [startNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: start
  })

  const [endNode] = Editor.nodes(editor, {
    match: (n) => n.type === 'table-cell',
    at: end
  })

  const [startCol] = getCol((col: Col) => col.cell.key === startNode[0].key)
  const [endCol] = getCol((col: Col) => col.cell.key === endNode[0].key)

  const yTop = startCol.path[yIndex]
  const yBottom = endCol.path[yIndex]

  const topLeftCol = gridTable[yTop][0]
  const bottomRight = gridTable[yBottom][gridTable[yBottom].length - 1]

  Transforms.setSelection(editor, {
    anchor: Editor.point(editor, topLeftCol.originPath),
    focus: Editor.point(editor, bottomRight.originPath)
  })

  splitCell(table, editor)

  const { gridTable: splitedGridTable } = splittedTable(editor, table)

  const removeCols = splitedGridTable
    .slice(yTop, yBottom + 1)
    .reduce((p: Col[], c: Col[]) => [...p, ...c], []) as Col[]

  removeCols.forEach((col: Col) => {
    Transforms.removeNodes(editor, {
      at: table[1],
      match: (n) => n.key === col.cell.key
    })
  })

  Transforms.removeNodes(editor, {
    at: table[1],
    match: (n) => {
      if (n.type !== 'table-row') {
        return false
      }

      if (
        !n.children ||
        (n.children as any).findIndex(
          (cell: TableCell) => cell.type === 'table-cell'
        ) < 0
      ) {
        return true
      }

      return false
    }
  })

  if (!Editor.string(editor, table[1])) {
    Transforms.removeNodes(editor, {
      at: table[1]
    })
  }
}

export function removeTable(table: NodeEntry, editor: Editor) {
  if (editor && table) {
    Transforms.removeNodes(editor, {
      match: (n) => n.type === 'table',
      at: table[1]
    })
  }
}

export function toggleBorders(table: NodeEntry, editor: Editor) {
  if (editor && table) {
    Transforms.setNodes(
      editor,
      {
        borderless: !table[0].borderless
      },
      {
        match: (n) => n.type === 'table',
        at: table[1]
      }
    )
  }
}

function checkMerge(table: Col[][]): Col[][] | undefined {
  let selectedCount = 0

  const selectedTable = table.reduce((t: Col[][], row: Col[]) => {
    const currRow = row.filter((col: Col) => col.cell.selectedCell)
    if (currRow.length) {
      t.push(currRow)
      selectedCount += currRow.length
    }
    return t
  }, [])

  if (selectedCount < 2) {
    return undefined
  }

  const selectedWidth = selectedTable[0].length
  let couldMerge = true

  selectedTable.forEach((row: Col[]) => {
    if (row.length !== selectedWidth) {
      couldMerge = false
    }
  })

  if (!couldMerge) {
    return undefined
  }

  return selectedTable
}
