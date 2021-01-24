import React, { FC, useRef, Fragment, useCallback } from 'react'
import IconButton from '../icon-button'
import { RiImage2Fill, RiImageEditFill } from 'react-icons/ri'
import classnames from 'classnames'
import { GrRedo, GrUndo } from 'react-icons/gr'
import {
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatBold,
  MdFormatIndentDecrease,
  MdFormatIndentIncrease,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatSize,
  MdFormatStrikethrough,
  MdFormatUnderlined,
  MdTextFields,
  MdTransform
} from 'react-icons/md'
import Icon from '../icon'
import IconGroup from '../icon-group'
import {
  useHeadingFormatType,
  useLeafColorValue,
  useMouseDown,
  usePopupUtils
} from '../../core/hooks'
import TextSizePopup from '../popups/text-size'
import ColorPopup from '../popups/color'
import {
  focusEditor,
  HeadingFormatType,
  toggleBlockActive,
  toggleColorMarkActive
} from '../../core/tools'
import { nil, notNil } from '../../core/utils'
import { useSlate } from 'slate-react'
import { Transforms } from 'slate'

const Toolbar: FC = () => {
  const editor = useSlate()
  const editorSelection = useRef(editor.selection)

  const textSizePopupAnchorRef = useRef(null)
  const colorPopupAnchorRef = useRef(null)

  const textSizePopup = usePopupUtils()
  const colorPopup = usePopupUtils()

  const headingFormatType = useHeadingFormatType()
  const leafColorValue = useLeafColorValue()

  const handlePressHeadingFormatType = useCallback(
    (value: HeadingFormatType) => {
      const prevValue = headingFormatType?.name

      if (value === prevValue) {
        return
      }

      if (notNil(prevValue)) {
        toggleBlockActive(editor, prevValue)
      }

      if (notNil(value)) {
        toggleBlockActive(editor, value)
      }

      focusEditor(editor)
    },
    [editor, headingFormatType]
  )

  const handleChangeColorOption = useCallback(
    (value: string) => {
      const prevValue = leafColorValue

      if (value === prevValue) {
        return
      }

      Transforms.select(editor, editorSelection.current)

      if (notNil(prevValue)) {
        toggleColorMarkActive(editor, prevValue)
      }

      if (notNil(value)) {
        toggleColorMarkActive(editor, value)
      }

      focusEditor(editor)
    },
    [editor, leafColorValue]
  )

  const handlePressTextSize = useMouseDown(() => {
    textSizePopup.open()
  })

  const handlePressColor = useMouseDown(() => {
    editorSelection.current = editor.selection
    colorPopup.open()
  })

  return (
    <Fragment>
      <div className='border-t border-b border-solid border-gray-300 py-20 px-60 bg-blue-50 flex items-center divide-x divide-gray-300 text-gray-500'>
        <div className='font-medium flex items-center'>
          <div
            ref={textSizePopupAnchorRef}
            className='flex items-center w-144 space-x-4 flex-1'
            onMouseDown={handlePressTextSize}
          >
            <Icon>
              <MdFormatSize />
            </Icon>
            <span className='flex-1 cursor-pointer transition-colors duration-250 hover:text-blue-500'>
              {headingFormatType?.label || 'Normal'}
            </span>
          </div>
          <div
            ref={colorPopupAnchorRef}
            className={classnames(
              's-28 cursor-pointer border-2 border-solid border-white mx-16 rounded-full shadow-2 transition-colors duration-250',
              {
                'bg-black': nil(leafColorValue)
              }
            )}
            style={{ backgroundColor: leafColorValue }}
            onMouseDown={handlePressColor}
          />
        </div>
        <IconGroup>
          <IconButton>
            <MdFormatBold />
          </IconButton>
          <IconButton>
            <MdFormatItalic />
          </IconButton>
          <IconButton>
            <MdFormatUnderlined />
          </IconButton>
          <IconButton>
            <MdFormatStrikethrough />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton>
            <MdFormatAlignLeft />
          </IconButton>
          <IconButton>
            <MdFormatAlignCenter />
          </IconButton>
          <IconButton>
            <MdFormatAlignRight />
          </IconButton>
          <IconButton>
            <MdFormatAlignJustify />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton>
            <MdFormatIndentIncrease />
          </IconButton>
          <IconButton>
            <MdFormatIndentDecrease />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton>
            <MdFormatListNumbered />
          </IconButton>
          <IconButton>
            <MdFormatListBulleted />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton>
            <RiImage2Fill />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton className='border border-dotted border-gray-500'>
            <RiImageEditFill />
          </IconButton>
          <IconButton className='border border-dotted border-gray-500'>
            <MdTextFields />
          </IconButton>
          <IconButton className='border border-dotted border-gray-500'>
            <MdTransform />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton>
            <GrUndo />
          </IconButton>
          <IconButton>
            <GrRedo />
          </IconButton>
        </IconGroup>
      </div>
      <TextSizePopup
        anchorRef={textSizePopupAnchorRef}
        isVisible={textSizePopup.visible}
        value={headingFormatType?.name}
        onPressOption={handlePressHeadingFormatType}
        onRequestClose={textSizePopup.close}
      />
      <ColorPopup
        anchorRef={colorPopupAnchorRef}
        isVisible={colorPopup.visible}
        value={leafColorValue}
        onChangeColorOption={handleChangeColorOption}
        onRequestClose={colorPopup.close}
      />
    </Fragment>
  )
}

export default Toolbar
