import React, { FC } from 'react'
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

const Toolbar: FC = () => {
  return (
    <div className='border-t border-b border-solid border-gray-300 py-20 px-60 bg-blue-50 flex items-center divide-x divide-gray-300 text-gray-500'>
      <div className='w-180 font-medium flex items-center space-x-4 pr-16'>
        <Icon>
          <MdFormatSize />
        </Icon>
        <span className='flex-1 cursor-pointer transition-colors duration-250 hover:text-blue-500'>
          Heading 3
        </span>
        <div className='s-28 cursor-pointer border-2 border-solid border-white bg-blue-500 rounded-full shadow-2' />
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
  )
}

export default Toolbar
