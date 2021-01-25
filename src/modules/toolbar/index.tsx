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
  useAlignmentValue,
  useEditor,
  useCanUndo,
  useCanRedo
} from '../../core/hooks'
import TextSizePopup from '../popups/text-size'
import ColorPopup from '../popups/color'
import {
  BlockAlignment,
  decreaseIndentation,
  EditableAttributes,
  focusEditor,
  HeadingFormatType,
  increaseIndentation,
  insertEditableBlock,
  insertImageBlock,
  isBlockActive,
  isMarkActive,
  LeafFormatType,
  setAlignment,
  toggleBlockActive,
  toggleColorMarkActive,
  toggleMarkActive
} from '../../core/tools'
import { ImageDimensions, nil, notNil } from '../../core/utils'
import { Transforms } from 'slate'
import { ALIGNMENTS } from '../../core/constants'
import { HistoryEditor } from 'slate-history'
import ImagePopup, { ImageProps } from '../popups/image'
import ImageSizePopup from '../popups/image-size'
import EditablePopupProps from '../popups/editable'

const Toolbar: FC = () => {
  const editor = useEditor()
  const editorSelection = useRef(editor.selection)

  const textSizePopupAnchorRef = useRef(null)
  const colorPopupAnchorRef = useRef(null)
  const imagePopupAnchorRef = useRef(null)
  const imageSizePopupAnchorRef = useRef(null)

  const textSizePopup = usePopupUtils()
  const colorPopup = usePopupUtils()
  const imagePopup = usePopupUtils()
  const imageSizePopup = usePopupUtils()
  const editablePopup = usePopupUtils()

  const textSizeValue = useTextSizeValue()
  const leafColorValue = useLeafColorValue()
  const alignmentValue = useAlignmentValue()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

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

  const handleCreateImage = useCallback(
    (value: ImageProps) => {
      if (notNil(editorSelection.current)) {
        Transforms.select(editor, editorSelection.current)
      }

      insertImageBlock(editor, value)
      focusEditor(editor)
    },
    [editor]
  )

  const handleCreateEditableImage = useCallback(
    (value: ImageDimensions) => {
      if (notNil(editorSelection.current)) {
        Transforms.select(editor, editorSelection.current)
      }

      insertImageBlock(editor, { dimensions: value }, true)
      focusEditor(editor)
    },
    [editor]
  )

  const handleCreateEditable = useCallback(
    (value: EditableAttributes) => {
      if (notNil(editorSelection.current)) {
        Transforms.select(editor, editorSelection.current)
      }

      insertEditableBlock(editor, value)
      focusEditor(editor)
    },
    [editor]
  )

  const handlePressTextSize = useMouseDown(() => {
    textSizePopup.open()
  })

  const handlePressColor = useMouseDown(() => {
    editorSelection.current = editor.selection
    colorPopup.open()
  })

  const handlePressImage = useMouseDown(() => {
    editorSelection.current = editor.selection
    imagePopup.open()
  })

  const handlePressEditableImage = useMouseDown(() => {
    editorSelection.current = editor.selection
    imageSizePopup.open()
  })

  const handlePressInsertEditable = useMouseDown(() => {
    editorSelection.current = editor.selection
    editablePopup.open()
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

  const handlePressNumberedList = useCallback(() => {
    toggleBlockActive(editor, 'numbered-list')
  }, [editor])

  const handlePressBulletedList = useCallback(() => {
    toggleBlockActive(editor, 'bulleted-list')
  }, [editor])

  const handlePressUndo = useCallback(() => {
    HistoryEditor.undo(editor)
  }, [editor])

  const handlePressRedo = useCallback(() => {
    HistoryEditor.redo(editor)
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
          <IconButton onPress={handlePressDecreaseIndentation}>
            <MdFormatIndentDecrease />
          </IconButton>
          <IconButton onPress={handlePressIncreaseIndentation}>
            <MdFormatIndentIncrease />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton
            active={isBlockActive(editor, 'numbered-list')}
            onPress={handlePressNumberedList}
          >
            <MdFormatListNumbered />
          </IconButton>
          <IconButton
            active={isBlockActive(editor, 'bulleted-list')}
            onPress={handlePressBulletedList}
          >
            <MdFormatListBulleted />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton
            ref={imagePopupAnchorRef}
            active={imagePopup.visible}
            onPress={handlePressImage}
          >
            <RiImage2Fill />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton
            ref={imageSizePopupAnchorRef}
            active={imageSizePopup.visible}
            onPress={handlePressEditableImage}
            className='border border-dotted border-gray-500'
          >
            <RiImageEditFill />
          </IconButton>
          <IconButton
            active={editablePopup.visible}
            className='border border-dotted border-gray-500'
            onPress={handlePressInsertEditable}
          >
            <MdTextFields />
          </IconButton>
          <IconButton className='border border-dotted border-gray-500'>
            <MdTransform />
          </IconButton>
        </IconGroup>
        <IconGroup>
          <IconButton onPress={handlePressUndo} disabled={!canUndo}>
            <GrUndo />
          </IconButton>
          <IconButton onPress={handlePressRedo} disabled={!canRedo}>
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
      <ImagePopup
        anchorRef={imagePopupAnchorRef}
        isVisible={imagePopup.visible}
        onRequestClose={imagePopup.close}
        onSubmitEditing={handleCreateImage}
      />
      <ImageSizePopup
        anchorRef={imageSizePopupAnchorRef}
        isVisible={imageSizePopup.visible}
        onRequestClose={imageSizePopup.close}
        onSubmitEditing={handleCreateEditableImage}
      />
      <EditablePopupProps
        isVisible={editablePopup.visible}
        onRequestClose={editablePopup.close}
        onSubmit={handleCreateEditable}
      />
    </Fragment>
  )
}

export default Toolbar
