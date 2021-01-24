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
  useTextSizeValue,
  useLeafColorValue,
  useMouseDown,
  usePopupUtils,
  useAlignmentValue
} from '../../core/hooks'
import TextSizePopup from '../popups/text-size'
import ColorPopup from '../popups/color'
import {
  BlockAlignment,
  decreaseIndentation,
  focusEditor,
  HeadingFormatType,
  increaseIndentation,
  isMarkActive,
  LeafFormatType,
  setAlignment,
  toggleBlockActive,
  toggleColorMarkActive,
  toggleMarkActive
} from '../../core/tools'
import { nil, notNil } from '../../core/utils'
import { useSlate } from 'slate-react'
import { Transforms } from 'slate'
import { ALIGNMENTS } from '../../core/constants'

const Toolbar: FC = () => {
  const editor = useSlate()
  const editorSelection = useRef(editor.selection)

  const textSizePopupAnchorRef = useRef(null)
  const colorPopupAnchorRef = useRef(null)

  const textSizePopup = usePopupUtils()
  const colorPopup = usePopupUtils()

  const textSizeValue = useTextSizeValue()
  const leafColorValue = useLeafColorValue()
  const alignmentValue = useAlignmentValue()

  const handleChangeTextSizeOption = useCallback(
    (value: HeadingFormatType) => {
      const prevValue = textSizeValue?.name

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
    [editor, textSizeValue]
  )

  const handleChangeColorOption = useCallback(
    (value: string, focus = true) => {
      const prevValue = leafColorValue

      if (value === prevValue) {
        return
      }

      if (notNil(editorSelection.current)) {
        Transforms.select(editor, editorSelection.current)
      }

      if (notNil(prevValue)) {
        toggleColorMarkActive(editor, prevValue)
      }

      if (notNil(value)) {
        toggleColorMarkActive(editor, value)
      }

      editorSelection.current = editor.selection

      if (focus) {
        focusEditor(editor)
      }
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

  const handlePressInlineFormat = useCallback(
    (format: LeafFormatType) => {
      toggleMarkActive(editor, format)
    },
    [editor]
  )

  const handlePressAlignment = useCallback(
    (value?: BlockAlignment) => {
      setAlignment(editor, value)
    },
    [editor]
  )

  const handlePressIncreaseIndentation = useCallback(() => {
    increaseIndentation(editor)
  }, [editor])

  const handlePressDecreaseIndentation = useCallback(() => {
    decreaseIndentation(editor)
  }, [editor])

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
              {textSizeValue?.label || 'Normal'}
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
          <IconButton
            data='bold'
            active={isMarkActive(editor, 'bold')}
            onPress={handlePressInlineFormat}
          >
            <MdFormatBold />
          </IconButton>
          <IconButton
            data='italic'
            active={isMarkActive(editor, 'italic')}
            onPress={handlePressInlineFormat}
          >
            <MdFormatItalic />
          </IconButton>
          <IconButton
            data='underline'
            active={isMarkActive(editor, 'underline')}
            onPress={handlePressInlineFormat}
          >
            <MdFormatUnderlined />
          </IconButton>
          <IconButton
            data='strikethrough'
            active={isMarkActive(editor, 'strikethrough')}
            onPress={handlePressInlineFormat}
          >
            <MdFormatStrikethrough />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton
            active={nil(alignmentValue) || alignmentValue === ALIGNMENTS.left}
            onPress={handlePressAlignment}
          >
            <MdFormatAlignLeft />
          </IconButton>
          <IconButton
            data='center'
            active={alignmentValue === ALIGNMENTS.center}
            onPress={handlePressAlignment}
          >
            <MdFormatAlignCenter />
          </IconButton>
          <IconButton
            data='right'
            active={alignmentValue === ALIGNMENTS.right}
            onPress={handlePressAlignment}
          >
            <MdFormatAlignRight />
          </IconButton>
          <IconButton
            data='justify'
            active={alignmentValue === ALIGNMENTS.justify}
            onPress={handlePressAlignment}
          >
            <MdFormatAlignJustify />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton onPress={handlePressIncreaseIndentation}>
            <MdFormatIndentIncrease />
          </IconButton>
          <IconButton onPress={handlePressDecreaseIndentation}>
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
        value={textSizeValue?.name}
        onPressOption={handleChangeTextSizeOption}
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
