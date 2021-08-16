import { Editor, NodeEntry, Path, Transforms } from 'slate'

import { TableCell } from '../../../../core/tools'

export type Col = {
  cell: TableCell
  isReal: boolean
  path: Path
  originPath: Path
  isInsertPosition?: boolean
}

export const splittedTable: (
  editor: Editor,
  table: NodeEntry,
  startKey?: string | undefined
) => {
  tableDepth?: number
  gridTable: Col[][]
  getCol: (match?: (node: Col) => boolean) => Col[]
} = (editor, table, startKey) => {
  const tableDepth = table[1].length

  const cells = [] as { cell: TableCell; path: Path; realPath: Path }[]

  const nodes = Editor.nodes(editor, {
    at: table[1],
    match: (n) => n.type === 'table-cell'
  })

  for (const node of nodes) {
    const [cell, path] = node as [TableCell, Path]
    cells.push({
      cell,
      path,
      realPath: [...path]
    })
  }

  const gridTable: Col[][] = []
  let insertPosition = null

  for (let i = 0; i < cells.length; i++) {
    const { cell, path, realPath } = cells[i]
    const { rowspan = 1, colspan = 1 } = cell
    const y = path[tableDepth]
    let x = path[tableDepth + 1]

    if (!gridTable[y]) {
      gridTable[y] = []
    }

    while (gridTable[y][x]) {
      x++
    }

    for (let j = 0; j < rowspan; j++) {
      for (let k = 0; k < colspan; k++) {
        const _y = y + j
        const _x = x + k

        if (!gridTable[_y]) {
          gridTable[_y] = []
        }

        gridTable[_y][_x] = {
          cell,
          path: [...realPath.slice(0, tableDepth), _y, _x],
          isReal: (rowspan === 1 && colspan === 1) || (_y === y && _x === x),
          originPath: path
        }

        if (!insertPosition && cell.key === startKey) {
          insertPosition = gridTable[_y][_x]
          gridTable[_y][_x].isInsertPosition = true
        }
      }
    }
  }

  const getCol = (match?: (node: Col) => boolean): Col[] => {
    const result: Col[] = []

    gridTable.forEach((row) => {
      row.forEach((col: Col) => {
        if (match && match(col)) {
          result.push(col)
        }
      })
    })

    return result
  }

  return {
    gridTable,
    tableDepth,
    getCol
  }
}

export function addSelection(
  editor: Editor,
  table: NodeEntry | null,
  startPath: Path,
  endPath: Path
): Col[] {
  removeSelection(editor)

  if (!table) return []

  const { gridTable, getCol } = splittedTable(editor, table)

  if (!getCol || !gridTable) return []

  const [head] = getCol(
    (n: Col) =>
      Path.equals(Editor.path(editor, n.originPath), startPath) && n.isReal
  )
  const [tail] = getCol(
    (n: Col) =>
      Path.equals(Editor.path(editor, n.originPath), endPath) && n.isReal
  )

  if (!tail || !head) return []

  const { path: tailPath } = tail
  const { path: headPath } = head

  headPath.forEach((item: number, index: number) => {
    headPath[index] = Math.min(item, tailPath[index])
    tailPath[index] = Math.max(item, tailPath[index])
  })

  const coverCols: Col[] = []

  gridTable.forEach((row: Col[]) => {
    row.forEach((col: Col) => {
      const { path } = col

      const isOver = path.findIndex((item, index) => {
        if (item < headPath[index] || item > tailPath[index]) {
          return true
        }
        return false
      })

      if (isOver < 0) {
        coverCols.push(col)
      }
    })
  })

  coverCols.forEach(({ originPath }) => {
    Transforms.setNodes(
      editor,
      {
        selectedCell: true
      },
      {
        at: originPath,
        match: (n) => n.type === 'table-cell'
      }
    )
  })

  return coverCols
}

export function removeSelection(editor: Editor) {
  Transforms.unsetNodes(editor, 'selectedCell', {
    at: [],
    match: (n) => !!n.selectedCell
  })
}
