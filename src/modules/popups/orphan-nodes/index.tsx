import React, { FC, MutableRefObject, useCallback } from 'react'
import { FiInbox } from '@react-icons/all-files/fi/FiInbox'
import { useOrphanNodes } from '../../../core/hooks'
import Icon from '../../icon'
import Popup from '../../popup'
import { FaRegTrashAlt } from '@react-icons/all-files/fa/FaRegTrashAlt'

type OrphanNodesPopupProps = {
  anchorRef: MutableRefObject<Element>
  isVisible: boolean
  onRequestClose: Fn
}

const OrphanNodesPopup: FC<OrphanNodesPopupProps> = ({
  anchorRef,
  isVisible,
  onRequestClose
}) => {
  const [orphanNodes, setOrphanNodes] = useOrphanNodes()

  const handlePressDelete = useCallback(
    (id: string) => {
      const eventualValue = [...orphanNodes]
      const index = eventualValue.findIndex((o) => o.id === id)

      if (!~index) {
        return
      }

      eventualValue.splice(index, 1)
      setOrphanNodes(eventualValue)
    },
    [orphanNodes, setOrphanNodes]
  )

  return (
    <Popup
      position='down'
      alignment='end'
      isVisible={isVisible}
      onRequestClose={onRequestClose}
      anchorRef={anchorRef}
      transparent
      hideArrow
      overlayCloseOnClick
      contentClassName='rounded-default'
    >
      <div className='rounded-default p-8 space-y-8 w-320 bg-white border border-gray-300 overflow-hidden text-gray-500'>
        {!orphanNodes.length && (
          <div className='flex flex-col items-center justify-center text-center py-20 space-y-4'>
            <Icon className='text-blue-500 s-28'>
              <FiInbox />
            </Icon>
            <div className='text-heading-2 font-medium'>Spick and span!</div>
            <div className='text-subhead'>
              Choose the <span className='text-blue-500'>Save to Icebox</span>{' '}
              option to create standalone editables that do not appear in the
              document.
            </div>
          </div>
        )}
        <div className='space-y-4'>
          {orphanNodes.map(({ id, defaultValue }) => (
            <div
              key={id as any}
              className='rounded-default bg-blue-500 text-white font-medium px-8 py-8 flex items-center'
            >
              <div className='flex-1'>{defaultValue}</div>
              <Icon
                onPress={() => handlePressDelete(id as any)}
                className='cursor-pointer text-white opacity-50 transition-opacity duration-250 hover:opacity-100'
              >
                <FaRegTrashAlt />
              </Icon>
            </div>
          ))}
        </div>
      </div>
    </Popup>
  )
}

export default OrphanNodesPopup
