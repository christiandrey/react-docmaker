import React, { HTMLAttributes } from 'react'
import {
  insertAbove,
  insertBelow,
  insertLeft,
  insertRight,
  mergeSelection,
  removeColumn,
  removeRow,
  removeTable,
  splitCell,
  toggleBorders
} from '../../utils/commands'

import { AiOutlineBorderInner } from '@react-icons/all-files/ai/AiOutlineBorderInner'
import { AiOutlineDeleteColumn } from '@react-icons/all-files/ai/AiOutlineDeleteColumn'
import { AiOutlineDeleteRow } from '@react-icons/all-files/ai/AiOutlineDeleteRow'
import { AiOutlineInsertRowAbove } from '@react-icons/all-files/ai/AiOutlineInsertRowAbove'
import { AiOutlineInsertRowBelow } from '@react-icons/all-files/ai/AiOutlineInsertRowBelow'
import { AiOutlineInsertRowLeft } from '@react-icons/all-files/ai/AiOutlineInsertRowLeft'
import { AiOutlineInsertRowRight } from '@react-icons/all-files/ai/AiOutlineInsertRowRight'
import { AiOutlineMergeCells } from '@react-icons/all-files/ai/AiOutlineMergeCells'
import { AiOutlineSplitCells } from '@react-icons/all-files/ai/AiOutlineSplitCells'
import { Cardbar } from '../cardbar'
import { Editor } from 'slate'
import IconButton from '../../../../icon-button'
import classnames from 'classnames'
import css from '../../style.module.css'
import { useSlate } from 'slate-react'

interface TableCardbarProps extends HTMLAttributes<HTMLDivElement> {}

export const TableCardbar: React.FC<TableCardbarProps> = (props) => {
  const editor = useSlate()

  const [table] = Array.from(
    Editor.nodes(editor, {
      match: (n) => n.type === 'table'
    })
  )

  const run = (action: (table: any, editor: Editor) => any) => () =>
    action(table, editor)

  const getIsBorderActive = () => {
    if (!table) {
      return false
    }

    return !table?.[0].borderless
  }

  return (
    <Cardbar
      className={classnames(props.className, css['table-cardbar'])}
      delete={run(removeTable)}
    >
      <IconButton onPress={run(insertAbove)} tip='Insert row above'>
        <AiOutlineInsertRowAbove />
      </IconButton>
      <IconButton onPress={run(insertBelow)} tip='Insert row below'>
        <AiOutlineInsertRowBelow />
      </IconButton>
      <IconButton onPress={run(insertLeft)} tip='Insert column left'>
        <AiOutlineInsertRowLeft />
      </IconButton>
      <IconButton onPress={run(insertRight)} tip='Insert column right'>
        <AiOutlineInsertRowRight />
      </IconButton>
      <IconButton onPress={run(mergeSelection)} tip='Merge selection'>
        <AiOutlineMergeCells />
      </IconButton>
      <IconButton onPress={run(removeColumn)} tip='Remove column'>
        <AiOutlineDeleteColumn />
      </IconButton>
      <IconButton onPress={run(removeRow)} tip='Remove row'>
        <AiOutlineDeleteRow />
      </IconButton>
      <IconButton onPress={run(splitCell)} tip='Split cell'>
        <AiOutlineSplitCells />
      </IconButton>
      <IconButton
        active={getIsBorderActive()}
        onPress={run(toggleBorders)}
        tip='Toggle borders'
      >
        <AiOutlineBorderInner />
      </IconButton>
    </Cardbar>
  )
}
