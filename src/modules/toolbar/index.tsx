import React, { FC, useRef, Fragment, useCallback } from 'react'
import IconButton from '../icon-button'
import { RiImage2Fill, RiImageEditFill } from 'react-icons/ri'
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
  useMouseDown,
  usePopupUtils
} from '../../core/hooks'
import TextSizePopup from '../popups/text-size'
import ColorPopup from '../popups/color'
import {
  focusEditor,
  HeadingFormatType,
  toggleBlockActive
} from '../../core/tools'
import { notNil } from '../../core/utils'
import { useSlate } from 'slate-react'

const Toolbar: FC = () => {
  const editor = useSlate()

  const textSizePopupAnchorRef = useRef(null)
  const colorPopupAnchorRef = useRef(null)

  const textSizePopup = usePopupUtils()
  const colorPopup = usePopupUtils()

  const headingFormatType = useHeadingFormatType()

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

  const handlePressTextSize = useMouseDown(() => {
    textSizePopup.open()
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
            className='s-28 cursor-pointer border-2 border-solid border-white mx-16 bg-blue-500 rounded-full shadow-2'
            onClick={colorPopup.open}
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
        value={headingFormatType?.name}
        onPressOption={handlePressHeadingFormatType}
        anchorRef={textSizePopupAnchorRef}
        isVisible={textSizePopup.visible}
        onRequestClose={textSizePopup.close}
      />
      <ColorPopup
        anchorRef={colorPopupAnchorRef}
        isVisible={colorPopup.visible}
        onRequestClose={colorPopup.close}
      />
    </Fragment>
  )
}

export default Toolbar