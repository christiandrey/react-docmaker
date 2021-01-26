import React, { FC, useRef, Fragment, useCallback } from 'react'
import IconButton from '../icon-button'
import { RiImage2Fill } from '@react-icons/all-files/ri/RiImage2Fill'
import { RiImageEditFill } from '@react-icons/all-files/ri/RiImageEditFill'
import classnames from 'classnames'
import { GrUndo } from '@react-icons/all-files/gr/GrUndo'
import { GrRedo } from '@react-icons/all-files/gr/GrRedo'
import { MdFormatAlignCenter } from '@react-icons/all-files/md/MdFormatAlignCenter'
import { MdFormatAlignJustify } from '@react-icons/all-files/md/MdFormatAlignJustify'
import { MdFormatAlignLeft } from '@react-icons/all-files/md/MdFormatAlignLeft'
import { MdFormatAlignRight } from '@react-icons/all-files/md/MdFormatAlignRight'
import { MdFormatBold } from '@react-icons/all-files/md/MdFormatBold'
import { MdFormatIndentDecrease } from '@react-icons/all-files/md/MdFormatIndentDecrease'
import { MdFormatIndentIncrease } from '@react-icons/all-files/md/MdFormatIndentIncrease'
import { MdFormatItalic } from '@react-icons/all-files/md/MdFormatItalic'
import { MdFormatListBulleted } from '@react-icons/all-files/md/MdFormatListBulleted'
import { MdFormatListNumbered } from '@react-icons/all-files/md/MdFormatListNumbered'
import { MdFormatSize } from '@react-icons/all-files/md/MdFormatSize'
import { MdFormatStrikethrough } from '@react-icons/all-files/md/MdFormatStrikethrough'
import { MdFormatUnderlined } from '@react-icons/all-files/md/MdFormatUnderlined'
import { MdTextFields } from '@react-icons/all-files/md/MdTextFields'
import { MdTransform } from '@react-icons/all-files/md/MdTransform'
import { FiInbox } from '@react-icons/all-files/fi/FiInbox'
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
  useCanRedo,
  useConditionActive,
  useOrphanNodes
} from '../../core/hooks'
import TextSizePopup from '../popups/text-size'
import ColorPopup from '../popups/color'
import {
  BlockAlignment,
  createEditableNode,
  decreaseIndentation,
  EditableAttributes,
  EditableRefAttributes,
  focusEditor,
  HeadingFormatType,
  increaseIndentation,
  insertEditableBlock,
  insertImageBlock,
  isBlockActive,
  isMarkActive,
  LeafFormatType,
  setAlignment,
  setConditionActive,
  toggleBlockActive,
  toggleColorMarkActive,
  toggleMarkActive,
  unsetConditionActive
} from '../../core/tools'
import { ImageDimensions, nil, notNil } from '../../core/utils'
import { Transforms } from 'slate'
import { ALIGNMENTS } from '../../core/constants'
import { HistoryEditor } from 'slate-history'
import ImagePopup, { ImageProps } from '../popups/image'
import ImageSizePopup from '../popups/image-size'
import EditablePopupProps from '../popups/editable'
import ConditionPopup from '../popups/condition'
import OrphanNodesPopup from '../popups/orphan-nodes'

const Toolbar: FC = () => {
  const editor = useEditor()
  const editorSelection = useRef(editor.selection)

  const textSizePopupAnchorRef = useRef(null)
  const colorPopupAnchorRef = useRef(null)
  const imagePopupAnchorRef = useRef(null)
  const imageSizePopupAnchorRef = useRef(null)
  const conditionPopupAnchorRef = useRef(null)
  const orphanNodesPopupAnchorRef = useRef(null)

  const textSizePopup = usePopupUtils()
  const colorPopup = usePopupUtils()
  const imagePopup = usePopupUtils()
  const imageSizePopup = usePopupUtils()
  const editablePopup = usePopupUtils()
  const conditionPopup = usePopupUtils()
  const orphanNodesPopup = usePopupUtils()

  const textSizeValue = useTextSizeValue()
  const leafColorValue = useLeafColorValue()
  const alignmentValue = useAlignmentValue()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const conditionActive = useConditionActive()

  const [, setOrphanNodes] = useOrphanNodes()

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
    (value: EditableAttributes, isOrphan = false) => {
      if (notNil(editorSelection.current)) {
        Transforms.select(editor, editorSelection.current)
      }

      if (isOrphan) {
        const editableNode = createEditableNode(value, true)
        setOrphanNodes((o) => [editableNode, ...o])
      } else {
        insertEditableBlock(editor, value)
      }

      focusEditor(editor)
    },
    [editor, setOrphanNodes]
  )

  const handleSetConditionActive = useCallback(
    (value: EditableRefAttributes) => {
      if (notNil(editorSelection.current)) {
        Transforms.select(editor, editorSelection.current)
      }

      setConditionActive(editor, value)
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

  const handlePressCondition = useMouseDown(() => {
    if (conditionActive) {
      unsetConditionActive(editor)
      return
    }

    editorSelection.current = editor.selection
    conditionPopup.open()
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
          <IconButton
            ref={conditionPopupAnchorRef}
            active={conditionActive || conditionPopup.visible}
            onPress={handlePressCondition}
            className='border border-dotted border-gray-500'
          >
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
        <div className='flex flex-1 items-center justify-end border-none'>
          <IconButton
            ref={orphanNodesPopupAnchorRef}
            active={orphanNodesPopup.visible}
            onPress={orphanNodesPopup.open}
          >
            <FiInbox />
          </IconButton>
        </div>
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
      <ConditionPopup
        anchorRef={conditionPopupAnchorRef}
        isVisible={conditionPopup.visible}
        onRequestClose={conditionPopup.close}
        onSubmitEditing={handleSetConditionActive}
      />
      <OrphanNodesPopup
        anchorRef={orphanNodesPopupAnchorRef}
        isVisible={orphanNodesPopup.visible}
        onRequestClose={orphanNodesPopup.close}
      />
    </Fragment>
  )
}

export default Toolbar
